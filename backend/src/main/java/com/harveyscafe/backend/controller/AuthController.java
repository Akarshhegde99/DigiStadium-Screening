package com.harveyscafe.backend.controller;

import com.harveyscafe.backend.dto.RegisterRequestDTO;
import com.harveyscafe.backend.dto.LoginRequestDTO;
import com.harveyscafe.backend.dto.AuthResponseDTO;
import com.harveyscafe.backend.model.User;
import com.harveyscafe.backend.repository.UserRepository;
import com.harveyscafe.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already taken!");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            return ResponseEntity.badRequest().body("Phone number is already registered!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getName(), user.getPhone());
        return ResponseEntity.ok(new AuthResponseDTO(token, user.getName(), user.getEmail(), user.getPhone()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid email or password!");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getName(), user.getPhone());
        return ResponseEntity.ok(new AuthResponseDTO(token, user.getName(), user.getEmail(), user.getPhone()));
    }
}
