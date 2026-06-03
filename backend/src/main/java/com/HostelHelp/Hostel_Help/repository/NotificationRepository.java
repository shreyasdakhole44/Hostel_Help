package com.HostelHelp.Hostel_Help.repository;

import com.HostelHelp.Hostel_Help.Model.Notification;
import com.HostelHelp.Hostel_Help.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);
    long countByRecipientAndRead(User recipient, boolean read);
}
