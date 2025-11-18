package com.reporteloya.recuperar_password.service;

import com.reporteloya.recuperar_password.dto.ResetPasswordRequest;
import com.reporteloya.recuperar_password.entity.PasswordResetToken;
import com.reporteloya.recuperar_password.repository.TokenRepository;
import com.reporteloya.recuperar_password.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordService {

    private final UsuarioRepository usuarioRepository;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public PasswordService(UsuarioRepository usuarioRepository,
                           TokenRepository tokenRepository,
                           EmailService emailService) {
        this.usuarioRepository = usuarioRepository; 
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
    }

    @Transactional
    public boolean enviarEnlaceRecuperacion(String email) {
        return usuarioRepository.findByEmail(email).map(usuario -> {
            String token = UUID.randomUUID().toString();

            PasswordResetToken resetToken = new PasswordResetToken(
                    email,
                    token,
                    LocalDateTime.now().plusMinutes(15)
            );
            tokenRepository.save(resetToken);

            String enlace = "https://reporteloya.com/reset-password?token=" + token;
            emailService.enviarCorreoRecuperacion(email, enlace);

            return true;
        }).orElse(false);
    }

    @Transactional
    public boolean resetPassword(ResetPasswordRequest request) {
        return tokenRepository.findByToken(request.getToken()).map(tokenEntity -> {
            if (tokenEntity.getExpirationDate().isBefore(LocalDateTime.now())) {
                tokenRepository.delete(tokenEntity);
                return false;
            }

            return usuarioRepository.findByEmail(tokenEntity.getEmail()).map(usuario -> {
                usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));
                usuarioRepository.save(usuario);

                tokenRepository.delete(tokenEntity);
                return true;
            }).orElse(false);
        }).orElse(false);
    }
}