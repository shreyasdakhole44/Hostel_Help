package com.HostelHelp.Hostel_Help.service;

import com.HostelHelp.Hostel_Help.Model.Role;
import com.HostelHelp.Hostel_Help.Model.User;
import com.HostelHelp.Hostel_Help.dto.AuthResponse;
import com.HostelHelp.Hostel_Help.dto.LoginRequest;
import com.HostelHelp.Hostel_Help.dto.RegisterRequest;
import com.HostelHelp.Hostel_Help.repository.UserRepository;
import com.HostelHelp.Hostel_Help.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ── REGISTER (students only) ──
    public String register(RegisterRequest request) {

        // 1. check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // 2. build the user object
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .phone(request.getPhone())
                .roomNumber(request.getRoomNumber())
                .build();

        // 3. save to database
        userRepository.save(user);

        return "Student registered successfully";
    }

    // ── LOGIN (all roles) ──
    public AuthResponse login(LoginRequest request) {

        // 1. find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. check password matches
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }


        // 3. check account is active
        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated. Contact admin.");
        }

        // 4. generate JWT token (we will add JwtUtil next)

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(token, user.getRole().name(), user.getName(), user.getId());
    }
}