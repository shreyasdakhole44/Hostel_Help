package com.HostelHelp.Hostel_Help.service;

import com.HostelHelp.Hostel_Help.Model.Category;
import com.HostelHelp.Hostel_Help.Model.User;
import com.HostelHelp.Hostel_Help.repository.CategoryRepository;
import com.HostelHelp.Hostel_Help.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    // everyone: get all categories (for complaint form dropdown)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // admin: add new category
    public String addCategory(String name, String description) {
        if (categoryRepository.existsByName(name)) {
            throw new RuntimeException("Category already exists");
        }
        Category category = Category.builder()
                .name(name)
                .description(description)
                .build();
        categoryRepository.save(category);
        return "Category added successfully";
    }

    // admin: assign a warden to a category
    public String assignWarden(Long categoryId, Long wardenId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        User warden = userRepository.findById(wardenId)
                .orElseThrow(() -> new RuntimeException("Warden not found"));

        category.setWarden(warden);
        categoryRepository.save(category);
        return "Warden assigned to category";
    }
}