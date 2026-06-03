package com.HostelHelp.Hostel_Help.service;

import com.HostelHelp.Hostel_Help.Model.Category;
import com.HostelHelp.Hostel_Help.Model.Complaint;
import com.HostelHelp.Hostel_Help.Model.ComplaintStatus;
import com.HostelHelp.Hostel_Help.Model.User;
import com.HostelHelp.Hostel_Help.dto.ComplaintRequest;
import com.HostelHelp.Hostel_Help.dto.ComplaintResponse;
import com.HostelHelp.Hostel_Help.dto.StatusUpdateRequest;
import com.HostelHelp.Hostel_Help.repository.CategoryRepository;
import com.HostelHelp.Hostel_Help.repository.ComplaintRepository;
import com.HostelHelp.Hostel_Help.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;
    // ── STUDENT: submit a complaint ──
    public ComplaintResponse submitComplaint(ComplaintRequest request, Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .student(student)
                .status(ComplaintStatus.PENDING)
                .build();

        Complaint saved = complaintRepository.save(complaint);

        // ── send email to student ──
        emailService.sendComplaintSubmitted(
                student.getEmail(),
                student.getName(),
                saved.getTitle(),
                saved.getId()
        );

        return mapToResponse(saved);
    }

    // ── STUDENT: get my complaints ──
    public List<ComplaintResponse> getMyComplaints(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return complaintRepository.findByStudent(student)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── WARDEN: get assigned complaints ──
    public List<ComplaintResponse> getAssignedComplaints(Long wardenId) {
        User warden = userRepository.findById(wardenId)
                .orElseThrow(() -> new RuntimeException("Warden not found"));

        return complaintRepository.findByWarden(warden)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── WARDEN: update complaint status ──
    public ComplaintResponse updateStatus(Long complaintId,
                                          StatusUpdateRequest request,
                                          Long wardenId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (!complaint.getWarden().getId().equals(wardenId)) {
            throw new RuntimeException("You are not assigned to this complaint");
        }

        validateStatusTransition(complaint.getStatus(), request.getStatus());

        complaint.setStatus(request.getStatus());
        complaint.setWardenRemark(request.getWardenRemark());

        Complaint saved = complaintRepository.save(complaint);

        String studentEmail = saved.getStudent().getEmail();
        String studentName  = saved.getStudent().getName();
        String title        = saved.getTitle();
        String remark       = saved.getWardenRemark();
        Long   id           = saved.getId();
        String wardenName   = saved.getWarden().getName();

        // ── send correct email based on new status ──
        switch (saved.getStatus()) {
            case IN_PROGRESS -> emailService.sendComplaintInProgress(
                    studentEmail, studentName, title, wardenName, id);

            case RESOLVED    -> emailService.sendComplaintResolved(
                    studentEmail, studentName, title, remark, id);

            case REJECTED    -> emailService.sendComplaintRejected(
                    studentEmail, studentName, title, remark, id);

            default -> {} // no email for other transitions
        }

        return mapToResponse(saved);
    }

    // ── STUDENT: submit feedback and close complaint ──
    public ComplaintResponse submitFeedback(Long complaintId, Integer rating, String feedback, Long studentId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (!complaint.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("You are not authorized to submit feedback for this complaint");
        }

        if (complaint.getStatus() != ComplaintStatus.RESOLVED_PENDING && complaint.getStatus() != ComplaintStatus.RESOLVED) {
            throw new RuntimeException("Feedback can only be submitted for resolved complaints");
        }

        complaint.setRating(rating);
        complaint.setFeedback(feedback);
        complaint.setFeedbackSubmittedAt(java.time.LocalDateTime.now());
        complaint.setStatus(ComplaintStatus.CLOSED);

        Complaint saved = complaintRepository.save(complaint);

        if (saved.getWarden() != null) {
            notificationService.createAndSend(
                    saved.getWarden(),
                    "Student verified and closed complaint: " + saved.getTitle() + " (Rating: " + rating + "★)",
                    "COMPLAINT_CLOSED",
                    saved.getId()
            );
        }

        return mapToResponse(saved);
    }

    // ── STUDENT: reopen complaint ──
    public ComplaintResponse reopenComplaint(Long complaintId, String feedback, Long studentId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (!complaint.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("You are not authorized to reopen this complaint");
        }

        if (complaint.getStatus() != ComplaintStatus.RESOLVED_PENDING && complaint.getStatus() != ComplaintStatus.RESOLVED) {
            throw new RuntimeException("Only resolved complaints can be reopened");
        }

        complaint.setFeedback("Reopened: " + feedback);
        complaint.setStatus(ComplaintStatus.REOPENED);

        Complaint saved = complaintRepository.save(complaint);

        if (saved.getWarden() != null) {
            notificationService.createAndSend(
                    saved.getWarden(),
                    "Student reopened complaint: " + saved.getTitle(),
                    "COMPLAINT_REOPENED",
                    saved.getId()
            );
        }

        return mapToResponse(saved);
    }

    // ── ADMIN: get all complaints ──
    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── ADMIN: assign complaint to warden ──
    public ComplaintResponse assignComplaint(Long complaintId, Long wardenId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        User warden = userRepository.findById(wardenId)
                .orElseThrow(() -> new RuntimeException("Warden not found"));

        complaint.setWarden(warden);
        complaint.setStatus(ComplaintStatus.ASSIGNED);

        Complaint saved = complaintRepository.save(complaint);

        // ── notify student ──
        emailService.sendComplaintAssigned(
                saved.getStudent().getEmail(),
                saved.getStudent().getName(),
                saved.getTitle(),
                warden.getName(),
                saved.getId()
        );

        // ── notify warden ──
        emailService.sendWardenAssigned(
                warden.getEmail(),
                warden.getName(),
                saved.getTitle(),
                saved.getStudent().getName(),
                saved.getId()
        );

        return mapToResponse(saved);
    }

    // ── status transition validator ──
    private void validateStatusTransition(ComplaintStatus current, ComplaintStatus next) {
        boolean valid = switch (current) {
            case PENDING          -> next == ComplaintStatus.ASSIGNED;
            case ASSIGNED         -> next == ComplaintStatus.IN_PROGRESS;
            case IN_PROGRESS      -> next == ComplaintStatus.RESOLVED_PENDING
                    || next == ComplaintStatus.RESOLVED
                    || next == ComplaintStatus.REJECTED;
            case RESOLVED_PENDING -> next == ComplaintStatus.CLOSED
                    || next == ComplaintStatus.REOPENED;
            case REOPENED         -> next == ComplaintStatus.IN_PROGRESS
                    || next == ComplaintStatus.ASSIGNED;
            case CLOSED           -> false;
            case RESOLVED         -> next == ComplaintStatus.CLOSED
                    || next == ComplaintStatus.REOPENED;
            case REJECTED         -> false;
        };
        if (!valid) {
            throw new RuntimeException(
                    "Invalid status transition: " + current + " → " + next
            );
        }
    }

    // ── helper: convert Complaint entity to ComplaintResponse DTO ──
    private ComplaintResponse mapToResponse(Complaint c) {
        return ComplaintResponse.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .status(c.getStatus())
                .categoryName(c.getCategory() != null ? c.getCategory().getName() : null)
                .studentName(c.getStudent().getName())
                .wardenName(c.getWarden() != null ? c.getWarden().getName() : null)
                .wardenRemark(c.getWardenRemark())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .rating(c.getRating())
                .feedback(c.getFeedback())
                .resolvedAt(c.getResolvedAt())
                .feedbackSubmittedAt(c.getFeedbackSubmittedAt())
                .build();
    }
}