package com.HostelHelp.Hostel_Help.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpStatusCodeException;

import jakarta.mail.internet.MimeMessage;
import jakarta.annotation.PostConstruct;

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

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    @Value("${brevo.sender.email:}")
    private String brevoSenderEmail;

    private RestTemplate restTemplate;

    @PostConstruct
    public void init() {
        System.out.println("Mail User = " + fromEmail);
        this.restTemplate = new RestTemplate();
    }

    // ── send any email asynchronously ──
    // @Async means this runs in background
    // your API response does not wait for email to send
    @Async
    public void sendEmail(String toEmail, String subject, String body) {
        if (brevoApiKey != null && !brevoApiKey.trim().isEmpty()) {
            sendViaBrevo(toEmail, subject, body);
            return;
        }

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

    private void sendViaBrevo(String toEmail, String subject, String body) {
        try {
            String url = "https://api.brevo.com/v3/smtp/email";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("accept", "application/json");
            
            String cleanApiKey = (brevoApiKey != null) ? brevoApiKey.trim() : "";
            String maskedKey = (cleanApiKey.length() > 8) 
                    ? cleanApiKey.substring(0, 4) + "..." + cleanApiKey.substring(cleanApiKey.length() - 4)
                    : "INVALID/SHORT";
            log.info("Preparing Brevo email send. API Key length: {}, masked: {}", cleanApiKey.length(), maskedKey);
            headers.set("api-key", cleanApiKey);

            String senderEmail = (brevoSenderEmail != null && !brevoSenderEmail.trim().isEmpty()) 
                    ? brevoSenderEmail.trim() 
                    : fromEmail;
            log.info("Brevo sender email: {}", senderEmail);

            java.util.Map<String, Object> sender = new java.util.HashMap<>();
            sender.put("name", appName);
            sender.put("email", senderEmail);

            java.util.Map<String, Object> recipient = new java.util.HashMap<>();
            recipient.put("email", toEmail);

            java.util.List<java.util.Map<String, Object>> toList = new java.util.ArrayList<>();
            toList.add(recipient);

            java.util.Map<String, Object> payload = new java.util.HashMap<>();
            payload.put("sender", sender);
            payload.put("to", toList);
            payload.put("subject", subject);
            payload.put("htmlContent", body);

            HttpEntity<java.util.Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            
            log.info("Sending email to {} via Brevo API...", toEmail);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Email sent successfully to {} via Brevo API. Response: {}", toEmail, response.getBody());
            } else {
                log.error("Failed to send email via Brevo. Status: {}, Response: {}", response.getStatusCode(), response.getBody());
            }
        } catch (HttpStatusCodeException e) {
            log.error("HTTP error occurred while sending email via Brevo. Status: {}, Response Body: {}", 
                    e.getStatusCode(), e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            log.error("Exception occurred while sending email to {} via Brevo: {}", toEmail, e.getMessage(), e);
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
        String body = buildEmail(
                wardenName,
                "A new complaint has been assigned to you by Admin.",
                complaintTitle,
                "ASSIGNED",
                "Submitted by: <strong>" + studentName + "</strong>. Please log in to review and start working on this complaint.",
                complaintId
        );
        sendEmail(wardenEmail, subject, body);
    }

    // ── reusable HTML email template ──
    // ── reusable HTML email template ──
    private String buildEmail(String name,
                              String headline,
                              String complaintTitle,
                              String status,
                              String message,
                              Long complaintId) {

        String statusBg = "#F3F4F6";
        String statusColor = "#374151";
        switch (status) {
            case "PENDING":
                statusBg = "#FEF3C7";
                statusColor = "#D97706";
                break;
            case "ASSIGNED":
                statusBg = "#EFF6FF";
                statusColor = "#1D4ED8";
                break;
            case "IN PROGRESS":
                statusBg = "#FFF7ED";
                statusColor = "#EA580C";
                break;
            case "RESOLVED":
                statusBg = "#ECFDF3";
                statusColor = "#027A48";
                break;
            case "REJECTED":
                statusBg = "#FEF2F2";
                statusColor = "#DC2626";
                break;
        }

        String formattedDate = java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy")
                .format(java.time.LocalDate.now());

        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "  <meta charset='utf-8'>"
                + "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                + "  <style>"
                + "    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');"
                + "  </style>"
                + "</head>"
                + "<body style=\"background-color:#F9FAFB; margin:0; padding:0; font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;\">"
                + "  <table border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color:#F9FAFB; padding:40px 16px;'>"
                + "    <tr>"
                + "      <td align='center'>"
                + "        <!-- Card Container -->"
                + "        <table border='0' cellpadding='0' cellspacing='0' width='600' style='background-color:#ffffff; border-radius:16px; border:1px solid #E5E7EB; box-shadow:0 4px 12px rgba(0,0,0,0.03),0 1px 2px rgba(0,0,0,0.02); overflow:hidden;'>"
                + "          <!-- Logo & Header Section -->"
                + "          <tr>"
                + "            <td align='center' style='padding:32px; background:linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #4C1D95 100%);'>"
                + "              <table border='0' cellpadding='0' cellspacing='0' width='100%'>"
                + "                <tr>"
                + "                  <td align='center' style='padding-bottom:12px;'>"
                + "                    <img src='https://raw.githubusercontent.com/shreyasdakhole44/Hostel_Help/main/frontend/src/assets/hostel-help-logo.png' alt='Hostel Help Logo' style='height:44px; width:auto; display:block; filter:brightness(0) invert(1);' />"
                + "                  </td>"
                + "                </tr>"
                + "                <tr>"
                + "                  <td align='center'>"
                + "                    <span style='color:#ffffff; font-size:13px; font-weight:700; letter-spacing:1px; text-transform:uppercase; opacity:0.8;'>" + appName + "</span>"
                + "                  </td>"
                + "                </tr>"
                + "              </table>"
                + "            </td>"
                + "          </tr>"
                + "          <!-- Content Body -->"
                + "          <tr>"
                + "            <td style='padding:40px 32px; background-color:#ffffff;'>"
                + "              <table border='0' cellpadding='0' cellspacing='0' width='100%'>"
                + "                <tr>"
                + "                  <td style=\"color:#111827; font-size:18px; font-weight:700; font-family:'Inter',sans-serif; padding-bottom:8px;\">"
                + "                    Hi " + name + ","
                + "                  </td>"
                + "                </tr>"
                + "                <tr>"
                + "                  <td style=\"color:#374151; font-size:15px; line-height:1.6; font-family:'Inter',sans-serif; padding-bottom:28px;\">"
                + "                    " + headline + ""
                + "                  </td>"
                + "                </tr>"
                + "                <!-- Main Information Block -->"
                + "                <tr>"
                + "                  <td style='background-color:#F9FAFB; border:1px solid #E5E7EB; border-radius:12px; padding:24px;'>"
                + "                    <table border='0' cellpadding='0' cellspacing='0' width='100%'>"
                + "                      <tr>"
                + "                        <td style=\"color:#6B7280; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; font-family:'Inter',sans-serif; padding-bottom:6px;\">"
                + "                          Complaint Details"
                + "                        </td>"
                + "                      </tr>"
                + "                      <tr>"
                + "                        <td style=\"color:#111827; font-size:16px; font-weight:700; font-family:'Inter',sans-serif; padding-bottom:14px;\">"
                + "                          " + complaintTitle + ""
                + "                        </td>"
                + "                      </tr>"
                + "                      <tr>"
                + "                        <td style='padding-bottom:16px;'>"
                + "                          <span style=\"background-color:" + statusBg + "; color:" + statusColor + "; font-size:11px; font-weight:700; padding:4px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px; font-family:'Inter',sans-serif; display:inline-block;\">" + status + "</span>"
                + "                        </td>"
                + "                      </tr>"
                + "                      <tr>"
                + "                        <td style=\"color:#4B5563; font-size:14px; line-height:1.6; font-family:'Inter',sans-serif; padding-bottom:16px; border-top:1px solid #E5E7EB; padding-top:16px;\">"
                + "                          " + message + ""
                + "                        </td>"
                + "                      </tr>"
                + "                      <tr>"
                + "                        <td style='border-top:1px solid #E5E7EB; padding-top:14px;'>"
                + "                          <table border='0' cellpadding='0' cellspacing='0' width='100%'>"
                + "                            <tr>"
                + "                              <td style=\"color:#6B7280; font-size:12px; font-family:'Inter',sans-serif;\">"
                + "                                Reference: <strong style='color:#111827;'>#" + complaintId + "</strong>"
                + "                              </td>"
                + "                              <td align='right' style=\"color:#6B7280; font-size:12px; font-family:'Inter',sans-serif;\">"
                + "                                Date: <strong style='color:#111827;'>" + formattedDate + "</strong>"
                + "                              </td>"
                + "                            </tr>"
                + "                          </table>"
                + "                        </td>"
                + "                      </tr>"
                + "                    </table>"
                + "                  </td>"
                + "                </tr>"
                + "                <!-- Action Button -->"
                + "                <tr>"
                + "                  <td align='center' style='padding-top:32px;'>"
                + "                    <table border='0' cellpadding='0' cellspacing='0'>"
                + "                      <tr>"
                + "                        <td align='center' bgcolor='#7C3AED' style='border-radius:10px;'>"
                + "                          <a href='https://hostelhelps.netlify.app' target='_blank' style=\"display:inline-block; padding:12px 28px; color:#ffffff; font-size:14px; font-weight:600; text-decoration:none; border-radius:10px; border:1px solid #7C3AED; font-family:'Inter',sans-serif;\">View Portal Details</a>"
                + "                        </td>"
                + "                      </tr>"
                + "                    </table>"
                + "                  </td>"
                + "                </tr>"
                + "              </table>"
                + "            </td>"
                + "          </tr>"
                + "          <!-- Footer Section -->"
                + "          <tr>"
                + "            <td align='center' style='padding:32px; background-color:#F9FAFB; border-top:1px solid #E5E7EB;'>"
                + "              <table border='0' cellpadding='0' cellspacing='0' width='100%'>"
                + "                <tr>"
                + "                  <td align='center' style=\"color:#6B7280; font-size:12px; line-height:1.5; font-family:'Inter',sans-serif; padding-bottom:12px;\">"
                + "                    This is an automated notification from <strong>" + appName + "</strong>. Please do not reply directly to this message."
                + "                  </td>"
                + "                </tr>"
                + "                <tr>"
                + "                  <td align='center' style=\"color:#9CA3AF; font-size:11px; font-family:'Inter',sans-serif; padding-bottom:16px;\">"
                + "                    © 2026 Hostel Help. All rights reserved."
                + "                  </td>"
                + "                </tr>"
                + "                <tr>"
                + "                  <td align='center'>"
                + "                    <table border='0' cellpadding='0' cellspacing='0'>"
                + "                      <tr>"
                + "                        <td>"
                + "                          <a href='https://hostelhelps.netlify.app' style=\"color:#7C3AED; font-size:12px; font-weight:600; text-decoration:none; font-family:'Inter',sans-serif;\">Visit Portal</a>"
                + "                        </td>"
                + "                        <td style='padding:0 8px; color:#D1D5DB;'>•</td>"
                + "                        <td>"
                + "                          <a href='mailto:support@hostelhelp.com' style=\"color:#7C3AED; font-size:12px; font-weight:600; text-decoration:none; font-family:'Inter',sans-serif;\">Support</a>"
                + "                        </td>"
                + "                      </tr>"
                + "                    </table>"
                + "                  </td>"
                + "                </tr>"
                + "              </table>"
                + "            </td>"
                + "          </tr>"
                + "        </table>"
                + "      </td>"
                + "    </tr>"
                + "  </table>"
                + "</body>"
                + "</html>";
    }
}