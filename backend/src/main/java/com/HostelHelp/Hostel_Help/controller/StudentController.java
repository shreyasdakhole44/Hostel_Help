package com.HostelHelp.Hostel_Help.controller;

import com.HostelHelp.Hostel_Help.Model.User;
import com.HostelHelp.Hostel_Help.dto.ComplaintRequest;
import com.HostelHelp.Hostel_Help.dto.ComplaintResponse;
import com.HostelHelp.Hostel_Help.service.CategoryService;
import com.HostelHelp.Hostel_Help.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final ComplaintService complaintService;
    private final CategoryService categoryService;

    // POST /api/student/complaints
    // student submits a new complaint
    @PostMapping("/complaints")
    public ResponseEntity<ComplaintResponse> submit(
            @RequestBody ComplaintRequest request,
            @AuthenticationPrincipal User currentUser) {

        ComplaintResponse response = complaintService.submitComplaint(request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    // GET /api/student/complaints
    // student gets their own complaints
    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintResponse>> myComplaints(
            @AuthenticationPrincipal User currentUser) {

        List<ComplaintResponse> complaints = complaintService.getMyComplaints(currentUser.getId());
        return ResponseEntity.ok(complaints);
    }

    // GET /api/student/complaints/{id}
    // student views one complaint detail
    @GetMapping("/complaints/{id}")
    public ResponseEntity<ComplaintResponse> complaintDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {

        // get all my complaints and find the one matching id
        return complaintService.getMyComplaints(currentUser.getId())
                .stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/student/categories
    // student gets category list for complaint form dropdown
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // POST /api/student/complaints/{id}/feedback
    // student submits rating and feedback
    @PostMapping("/complaints/{id}/feedback")
    public ResponseEntity<ComplaintResponse> submitFeedback(
            @PathVariable Long id,
            @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(complaintService.submitFeedback(
                id, request.getRating(), request.getFeedback(), currentUser.getId()));
    }

    // POST /api/student/complaints/{id}/reopen
    // student reopens a resolved complaint
    @PostMapping("/complaints/{id}/reopen")
    public ResponseEntity<ComplaintResponse> reopenComplaint(
            @PathVariable Long id,
            @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(complaintService.reopenComplaint(
                id, request.getFeedback(), currentUser.getId()));
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class FeedbackRequest {
        private Integer rating;
        private String feedback;
    }
}