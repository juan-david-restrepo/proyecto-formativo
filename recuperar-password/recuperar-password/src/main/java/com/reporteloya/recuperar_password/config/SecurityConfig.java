package com.reporteloya.recuperar_password.config; // << PAQUETE CORREGIDO

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Configuración principal de Spring Security.
 * Define qué rutas están protegidas y cómo, y añade el filtro JWT.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        // El filtro ya tiene el paquete correcto
        // (com.reporteloya.recuperar_password.config)
        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                // Deshabilitamos CSRF (Cross-Site Request Forgery) porque usamos JWT
                                .csrf(csrf -> csrf.disable())

                                // Definimos las reglas de autorización
                                .authorizeHttpRequests(authz -> authz
                                                // Endpoints de autenticación (Registro/Login)
                                                .requestMatchers("/api/auth/**").permitAll()

                                                // Endpoints de recuperación de contraseña (CRÍTICO: deben ser públicos)
                                                .requestMatchers("/api/password/**").permitAll()

                                                // Endpoints de productos:
                                                // Solo ADMIN puede crear productos (POST)
                                                .requestMatchers(HttpMethod.POST, "/api/products").hasRole("ADMIN")
                                                // USER y ADMIN pueden ver productos (GET)
                                                .requestMatchers(HttpMethod.GET, "/api/products")
                                                .hasAnyRole("ADMIN", "USER")

                                                // Todas las demás peticiones deben estar autenticadas
                                                .anyRequest().authenticated())

                                // Configuramos la gestión de sesiones como STATELESS (sin estado)
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                // Definimos el proveedor de autenticación
                                .authenticationProvider(authenticationProvider)

                                // Añadimos nuestro filtro de JWT ANTES del filtro estándar de autenticación
                                // Esto asegura que el token se verifique antes que Spring intente autenticar
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(List.of(
                                "http://localhost:4200", // Front local
                                "https://frontend-app-1-0-0.onrender.com" // Front desplegado en Render
                ));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setExposedHeaders(List.of("Authorization"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}