package com.HostelHelp.Hostel_Help.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
@Async
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.name}")
    private String appName;

    // ── send any email asynchronously ──
    // @Async means this runs in background
    // your API response does not wait for email to send
    @Async
    public void sendEmail(String toEmail, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true); // true = HTML email

            mailSender.send(message);
            log.info("Email sent to: {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
    }

    // ── complaint submitted ──
    public void sendComplaintSubmitted(String studentEmail,
                                       String studentName,
                                       String complaintTitle,
                                       Long complaintId) {
        String subject = appName + " — Complaint Submitted Successfully";
        String body = buildEmail(
                studentName,
                "Your complaint has been submitted successfully.",
                complaintTitle,
                "PENDING",
                "Your complaint is now pending review. Admin will assign it to a warden shortly.",
                complaintId
        );
        sendEmail(studentEmail, subject, body);
    }

    // ── complaint assigned to warden ──
    public void sendComplaintAssigned(String studentEmail,
                                      String studentName,
                                      String complaintTitle,
                                      String wardenName,
                                      Long complaintId) {
        String subject = appName + " — Complaint Assigned to Warden";
        String body = buildEmail(
                studentName,
                "Your complaint has been assigned to a warden.",
                complaintTitle,
                "ASSIGNED",
                "Warden <strong>" + wardenName + "</strong> has been assigned to resolve your complaint.",
                complaintId
        );
        sendEmail(studentEmail, subject, body);
    }

    // ── warden started working ──
    public void sendComplaintInProgress(String studentEmail,
                                        String studentName,
                                        String complaintTitle,
                                        String wardenName,
                                        Long complaintId) {
        String subject = appName + " — Warden is Working on Your Complaint";
        String body = buildEmail(
                studentName,
                "Work has started on your complaint.",
                complaintTitle,
                "IN PROGRESS",
                "Warden <strong>" + wardenName + "</strong> has started working on your issue.",
                complaintId
        );
        sendEmail(studentEmail, subject, body);
    }

    // ── complaint resolved ──
    public void sendComplaintResolved(String studentEmail,
                                      String studentName,
                                      String complaintTitle,
                                      String wardenRemark,
                                      Long complaintId) {
        String subject = appName + " — Your Complaint Has Been Resolved ✅";
        String remarkSection = (wardenRemark != null && !wardenRemark.isEmpty())
                ? "Warden's remark: <em>\"" + wardenRemark + "\"</em>"
                : "Your issue has been resolved.";
        String body = buildEmail(
                studentName,
                "Great news! Your complaint has been resolved.",
                complaintTitle,
                "RESOLVED",
                remarkSection,
                complaintId
        );
        sendEmail(studentEmail, subject, body);
    }

    // ── complaint rejected ──
    public void sendComplaintRejected(String studentEmail,
                                      String studentName,
                                      String complaintTitle,
                                      String wardenRemark,
                                      Long complaintId) {
        String subject = appName + " — Update on Your Complaint";
        String body = buildEmail(
                studentName,
                "Your complaint could not be resolved.",
                complaintTitle,
                "REJECTED",
                "Reason: <em>\"" + wardenRemark + "\"</em>",
                complaintId
        );
        sendEmail(studentEmail, subject, body);
    }

    // ── warden notification when complaint is assigned ──
    public void sendWardenAssigned(String wardenEmail,
                                   String wardenName,
                                   String complaintTitle,
                                   String studentName,
                                   Long complaintId) {
        String subject = appName + " — New Complaint Assigned to You";
        String body = "<div style='font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;'>"
                + "<div style='background:#4f46e5;padding:28px 32px;border-radius:12px 12px 0 0;'>"
                + "<h1 style='color:#fff;font-size:20px;margin:0;'>New Complaint Assigned</h1>"
                + "</div>"
                + "<div style='background:#ffffff;padding:28px 32px;border:1px solid #e2e8f0;'>"
                + "<p style='color:#374151;font-size:15px;'>Hi <strong>" + wardenName + "</strong>,</p>"
                + "<p style='color:#374151;font-size:15px;'>A new complaint has been assigned to you by Admin.</p>"
                + "<div style='background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:20px 0;'>"
                + "<p style='color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;margin:0 0 6px 0;'>Complaint</p>"
                + "<p style='color:#1e293b;font-size:16px;font-weight:600;margin:0 0 8px 0;'>" + complaintTitle + "</p>"
                + "<p style='color:#64748b;font-size:13px;margin:0;'>Submitted by: <strong>" + studentName + "</strong></p>"
                + "</div>"
                + "<p style='color:#374151;font-size:14px;'>Please log in to review and start working on this complaint.</p>"
                + "</div>"
                + "<div style='background:#f8fafc;padding:16px 32px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none;'>"
                + "<p style='color:#94a3b8;font-size:12px;margin:0;text-align:center;'>Hostel Help — Complaint Management System</p>"
                + "</div>"
                + "</div>";
        sendEmail(wardenEmail, subject, body);
    }

    // ── reusable HTML email template ──
    private String buildEmail(String name,
                              String headline,
                              String complaintTitle,
                              String status,
                              String message,
                              Long complaintId) {

        String statusColor = switch (status) {
            case "PENDING"     -> "#d97706";
            case "ASSIGNED"    -> "#1d4ed8";
            case "IN PROGRESS" -> "#7c3aed";
            case "RESOLVED"    -> "#059669";
            case "REJECTED"    -> "#dc2626";
            default            -> "#64748b";
        };

        return "<div style='font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;'>"

                // header
                + "<div style='background:#4f46e5;padding:28px 32px;border-radius:12px 12px 0 0;'>"
                + "<h1 style='color:#fff;font-size:20px;margin:0;'>🏠 " + appName + "</h1>"
                + "</div>"

                // body
                + "<div style='background:#ffffff;padding:28px 32px;border:1px solid #e2e8f0;'>"
                + "<p style='color:#374151;font-size:15px;margin:0 0 8px 0;'>Hi <strong>" + name + "</strong>,</p>"
                + "<p style='color:#374151;font-size:15px;margin:0 0 20px 0;'>" + headline + "</p>"

                // complaint detail box
                + "<div style='background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:0 0 20px 0;'>"
                + "<p style='color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 6px 0;'>Complaint</p>"
                + "<p style='color:#1e293b;font-size:16px;font-weight:600;margin:0 0 12px 0;'>" + complaintTitle + "</p>"
                + "<span style='background:" + statusColor + ";color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:0.5px;'>" + status + "</span>"
                + "</div>"

                // message
                + "<p style='color:#374151;font-size:14px;line-height:1.7;margin:0 0 20px 0;'>" + message + "</p>"

                + "<p style='color:#64748b;font-size:13px;margin:0;'>Complaint ID: <strong>#" + complaintId + "</strong></p>"
                + "</div>"

                // footer
                + "<div style='background:#f8fafc;padding:16px 32px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none;text-align:center;'>"
                + "<p style='color:#94a3b8;font-size:12px;margin:0;'>You received this email because you are registered on " + appName + ".</p>"
                + "</div>"

                + "</div>";
    }
}