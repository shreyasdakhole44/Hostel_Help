package com.HostelHelp.Hostel_Help.service;

import com.HostelHelp.Hostel_Help.Model.Notification;
import com.HostelHelp.Hostel_Help.Model.User;
import com.HostelHelp.Hostel_Help.dto.NotificationResponse;
import com.HostelHelp.Hostel_Help.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<NotificationResponse> getMyNotifications(User recipient) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(recipient)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(User recipient) {
        return notificationRepository.countByRecipientAndRead(recipient, false);
    }

    @Transactional
    public NotificationResponse markAsRead(Long id, User recipient) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getRecipient().getId().equals(recipient.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        notification.setRead(true);
        return mapToResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsRead(User recipient) {
        List<Notification> unread = notificationRepository.findByRecipientOrderByCreatedAtDesc(recipient)
                .stream()
                .filter(n -> !n.isRead())
                .collect(Collectors.toList());

        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void createAndSend(User recipient, String message, String type, Long complaintId) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .message(message)
                .type(type)
                .complaintId(complaintId)
                .read(false)
                .build();

        Notification saved = notificationRepository.save(notification);
        NotificationResponse response = mapToResponse(saved);

        messagingTemplate.convertAndSendToUser(
                recipient.getEmail(),
                "/queue/notifications",
                response
        );
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .message(n.getMessage())
                .type(n.getType())
                .complaintId(n.getComplaintId())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
