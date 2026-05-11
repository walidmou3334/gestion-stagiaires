package com.backend.backend.config;

import com.backend.backend.security.JwtAuthFilter;
import com.backend.backend.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider =
                new DaoAuthenticationProvider(userDetailsService);

        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()

                        // CANDIDAT - CANDIDATURE
                        .requestMatchers(HttpMethod.POST, "/api/candidatures").hasRole("CANDIDAT")
                        .requestMatchers(HttpMethod.GET, "/api/candidatures/me").hasRole("CANDIDAT")
                        .requestMatchers(HttpMethod.GET, "/api/candidatures/*/download-cv").authenticated()

                        // RH / ADMIN
                        .requestMatchers("/api/rh/**").hasAnyRole("RH", "ADMIN")
                        .requestMatchers("/api/encadrants/**").hasAnyRole("RH", "ADMIN")

                        // ENCADRANT
                        .requestMatchers("/api/encadrant/**").hasRole("ENCADRANT")

                        // STAGES
                        .requestMatchers(HttpMethod.GET, "/api/stages/me").hasRole("CANDIDAT")
                        .requestMatchers("/api/stages/**").hasAnyRole("RH", "ADMIN")

                        // ENTRETIENS
                        .requestMatchers(HttpMethod.GET, "/api/entretiens/me").hasRole("CANDIDAT")
                        .requestMatchers("/api/entretiens/**").hasAnyRole("RH", "ADMIN")

                        // LIVRABLES
                        .requestMatchers(HttpMethod.POST, "/api/livrables").hasRole("CANDIDAT")
                        .requestMatchers(HttpMethod.GET, "/api/livrables/me").hasRole("CANDIDAT")
                        .requestMatchers(HttpMethod.GET, "/api/livrables/*/download").authenticated()

                        // EVALUATIONS
                        .requestMatchers("/api/evaluations/**").hasRole("CANDIDAT")

                        .requestMatchers("/api/dashboard/rh").hasAnyRole("RH", "ADMIN")
                        .requestMatchers("/api/dashboard/candidat").hasRole("CANDIDAT")
                        .requestMatchers("/api/dashboard/encadrant").hasRole("ENCADRANT")

                        .anyRequest().authenticated()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}