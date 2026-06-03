package com.HostelHelp.Hostel_Help.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private String message;
    private String type;
    private Long complaintId;
    private boolean read;
    private LocalDateTime createdAt;
}
