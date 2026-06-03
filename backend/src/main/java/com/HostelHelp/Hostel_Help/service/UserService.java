package com.HostelHelp.Hostel_Help.service;

import com.HostelHelp.Hostel_Help.Model.Role;
import com.HostelHelp.Hostel_Help.Model.User;
import com.HostelHelp.Hostel_Help.dto.RegisterRequest;
import com.HostelHelp.Hostel_Help.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Admin: get all students
    public List<User> getAllStudents() {
        return userRepository.findByRole(Role.STUDENT);
    }

    // Admin: get all wardens
    public List<User> getAllWardens() {
        return userRepository.findByRole(Role.WARDEN);
    }

    // Admin: create a warden account
    public String createWarden(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User warden = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.WARDEN)
                .phone(request.getPhone())
                .build();

        userRepository.save(warden);
        return "Warden created successfully";
    }

    // Admin: activate or deactivate a user
    public String toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(!user.isActive());
        userRepository.save(user);

        return user.isActive() ? "User activated" : "User deactivated";
    }

}