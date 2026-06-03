package com.HostelHelp.Hostel_Help.repository;

import com.HostelHelp.Hostel_Help.Model.Complaint;
import com.HostelHelp.Hostel_Help.Model.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import com.HostelHelp.Hostel_Help.Model.User;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint,Long> {
List<Complaint> findByStudent(User Student);
    List<Complaint> findByWarden(User  Warden);
    List<Complaint> findByStatus(ComplaintStatus Status);
    List<Complaint> findByStatusAndCategoryId(ComplaintStatus status, Long categoryId);
    long countByStatus(ComplaintStatus status);
    long countByStudent(User student);
}
