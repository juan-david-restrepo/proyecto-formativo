package com.reporteloya.recuperar_password.controller;

import com.reporteloya.recuperar_password.dto.AuthResponse;
import com.reporteloya.recuperar_password.dto.LoginRequest;
import com.reporteloya.recuperar_password.dto.RegisterRequest;
import com.reporteloya.recuperar_password.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // Ruta base: /api/auth
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint para el registro de nuevos usuarios.
     * Ruta: POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            // HTTP 201 Created es apropiado para un registro exitoso
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            // Manejar errores como email ya registrado (HTTP 400 Bad Request)
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Manejar cualquier otro error interno del servidor
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno al registrar el usuario.");
        }
    }

    /**
     * Endpoint para el inicio de sesión.
     * Ruta: POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            // HTTP 200 OK es apropiado para un login exitoso
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Spring Security lanza excepciones si las credenciales son incorrectas
            // Por simplicidad, devolvemos 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales inválidas o usuario no encontrado.");
        }
    }
}