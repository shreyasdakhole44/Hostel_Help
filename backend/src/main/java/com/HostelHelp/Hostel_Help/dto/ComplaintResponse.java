package com.HostelHelp.Hostel_Help.dto;

import com.HostelHelp.Hostel_Help.Model.ComplaintStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ComplaintResponse {
    private Long id;
    private String title;
    private String description;
    private ComplaintStatus status;
    private String categoryName;
    private String studentName;
    private String wardenName;
    private String wardenRemark;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer rating;
    private String feedback;
    private LocalDateTime resolvedAt;
    private LocalDateTime feedbackSubmittedAt;
}