package com.HostelHelp.Hostel_Help.dto;

import lombok.Data;

@Data
public class ComplaintRequest {
    private String title;
    private String description;
    private Long categoryId;
}