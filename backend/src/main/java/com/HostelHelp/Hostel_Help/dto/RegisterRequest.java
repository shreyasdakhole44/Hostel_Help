package com.HostelHelp.Hostel_Help.dto;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String roomNumber;
}