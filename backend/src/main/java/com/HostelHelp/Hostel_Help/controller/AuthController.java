package com.HostelHelp.Hostel_Help.controller;

import com.HostelHelp.Hostel_Help.dto.AuthResponse;
import com.HostelHelp.Hostel_Help.dto.LoginRequest;
import com.HostelHelp.Hostel_Help.dto.RegisterRequest;
import com.HostelHelp.Hostel_Help.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
  @PostMapping("/register")
   public ResponseEntity<String> request(@RequestBody RegisterRequest request){
       String message= authService.register(request);
       return ResponseEntity.ok(message);
   }
    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
