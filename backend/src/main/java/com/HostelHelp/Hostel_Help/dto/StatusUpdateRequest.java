package com.HostelHelp.Hostel_Help.dto;


import com.HostelHelp.Hostel_Help.Model.ComplaintStatus;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    private ComplaintStatus status;
    private String wardenRemark;
}
