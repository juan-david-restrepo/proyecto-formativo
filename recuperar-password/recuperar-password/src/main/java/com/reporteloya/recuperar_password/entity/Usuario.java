package com.reporteloya.recuperar_password.entity;

import jakarta.persistence.*;
<<<<<<< HEAD
import lombok.*;
=======
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
>>>>>>> develop
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

<<<<<<< HEAD
@Entity
@Table(name = "usuarios")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "tipo_documento")
    private String tipoDocumento;

    @Column(name = "numero_documento")
    private String numeroDocumento;

    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    // ===== UserDetails =====
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

=======
@Data // Proporciona Getters, Setters, toString, etc. (Si usa Lombok)
@Builder // Proporciona el patrón Builder (Si usa Lombok)
@NoArgsConstructor // Constructor sin argumentos (Necesario por JPA)
@AllArgsConstructor // Constructor con todos los argumentos (Si usa Lombok)
@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails { // <<-- Implementar UserDetails es CRÍTICO

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Campos del formulario de registro
    private String tipoDocumento; // <<-- Nuevo campo
    private String numeroDocumento; // <<-- Nuevo campo
    private String nombreCompleto; // <<-- Nuevo campo

    // Campos existentes
    @Column(unique = true) // El email debe ser único
    private String email;
    private String password; // Contraseña HASHEADA (almacenada en la BD)

    // Campo de Rol (Necesario para Spring Security y Autorización)
    @Enumerated(EnumType.STRING) // Almacenar el ENUM como String en la BD
    private Role role; // <<-- Nuevo campo

    // -------------------------------------------------------------------
    // MÉTODOS DE USERDETAILS (Requeridos por Spring Security)
    // -------------------------------------------------------------------

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Retorna la lista de autoridades (roles) del usuario.
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    // Spring Security utiliza este método para obtener el nombre de usuario.
    // En nuestro caso, usamos el EMAIL como nombre de usuario.
>>>>>>> develop
    @Override
    public String getUsername() {
        return email;
    }

<<<<<<< HEAD
=======
    // El resto de métodos se dejan a 'true' para indicar que la cuenta está activa.
>>>>>>> develop
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> develop
