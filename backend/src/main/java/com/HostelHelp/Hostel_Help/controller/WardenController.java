package com.HostelHelp.Hostel_Help.controller;

import com.HostelHelp.Hostel_Help.Model.User;
import com.HostelHelp.Hostel_Help.dto.ComplaintResponse;
import com.HostelHelp.Hostel_Help.dto.StatusUpdateRequest;
import com.HostelHelp.Hostel_Help.service.AnalyticsService;
import com.HostelHelp.Hostel_Help.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warden")
@RequiredArgsConstructor
public class WardenController {

    private final ComplaintService complaintService;
    private final AnalyticsService analyticsService;

    // GET /api/warden/complaints
    // warden sees only complaints assigned to them
    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintResponse>> assignedComplaints(
            @AuthenticationPrincipal User currentUser) {

        List<ComplaintResponse> complaints =
                complaintService.getAssignedComplaints(currentUser.getId());
        return ResponseEntity.ok(complaints);
    }

    // GET /api/warden/complaints/{id}
    // warden views one complaint detail
    @GetMapping("/complaints/{id}")
    public ResponseEntity<ComplaintResponse> complaintDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        return complaintService.getAssignedComplaints(currentUser.getId())
                .stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/warden/complaints/{id}/status
    // warden updates complaint status with remark
    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal User currentUser) {

        ComplaintResponse response =
                complaintService.updateStatus(id, request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    // GET /api/warden/profile
    // warden sees their own profile
    @GetMapping("/profile")
    public ResponseEntity<User> profile(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(analyticsService.getWardenAnalytics(currentUser.getId()));
    }
}