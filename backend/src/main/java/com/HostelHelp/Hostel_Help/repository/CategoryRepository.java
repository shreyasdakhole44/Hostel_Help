package com.HostelHelp.Hostel_Help.repository;

import com.HostelHelp.Hostel_Help.Model.Category;
import com.HostelHelp.Hostel_Help.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByWarden(User warden);
    boolean existsByName(String name);
    Optional<Category> findByName(String name);
}
