package com.HostelHelp.Hostel_Help.repository;

import com.HostelHelp.Hostel_Help.Model.Role;
import com.HostelHelp.Hostel_Help.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    // Spring generates the SQL automatically from the method name
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);

    boolean existsByEmail(String email);

}
