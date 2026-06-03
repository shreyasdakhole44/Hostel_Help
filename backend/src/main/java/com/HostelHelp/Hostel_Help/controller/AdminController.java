package com.HostelHelp.Hostel_Help.controller;

import com.HostelHelp.Hostel_Help.Model.User;
import com.HostelHelp.Hostel_Help.dto.ComplaintResponse;
import com.HostelHelp.Hostel_Help.dto.RegisterRequest;
import com.HostelHelp.Hostel_Help.service.AnalyticsService;
import com.HostelHelp.Hostel_Help.service.CategoryService;
import com.HostelHelp.Hostel_Help.service.ComplaintService;
import com.HostelHelp.Hostel_Help.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {
  private final UserService userService;
  private final CategoryService categoryService;
  private final ComplaintService complaintService;
  private final AnalyticsService analyticsService;
  @GetMapping("/users/student")
    public ResponseEntity<List<User>> getAllStudent(){
      return ResponseEntity.ok(userService.getAllStudents());
  }
    @GetMapping("/users/warden")
    public ResponseEntity<List<User>> getAllWarden(){
        return ResponseEntity.ok(userService.getAllWardens());
    }
    // admin creates a warden account
    @PostMapping("/users/wardens")
    public ResponseEntity<String> createWarden(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.createWarden(request));
    }
   @PutMapping("/users/{id}/toggle")
   public ResponseEntity<String> toggleUser(@PathVariable Long id){
      return ResponseEntity.ok(userService.toggleUserStatus(id));
   }
    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    // PUT /api/admin/complaints/{id}/assign
    // admin assigns a complaint to a warden
    @PutMapping("/complaints/{id}/assign")
    public ResponseEntity<ComplaintResponse> assignComplaint(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {

        Long wardenId = body.get("wardenId");
        return ResponseEntity.ok(complaintService.assignComplaint(id, wardenId));
    }
    // GET /api/admin/categories
    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
    // POST /api/admin/categories
    @PostMapping("/categories")
    public ResponseEntity<String> addCategory(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String description = body.get("description");
        return ResponseEntity.ok(categoryService.addCategory(name, description));
    }
    @PutMapping("/categories/{id}/assign-warden")
    public ResponseEntity<String> assignWardenToCategory(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {

        Long wardenId = body.get("wardenId");
        return ResponseEntity.ok(categoryService.assignWarden(id, wardenId));
    }
    @GetMapping("/stats")
    public ResponseEntity<?> getStats(){
      return ResponseEntity.ok(Map.of(
              "totalComplaints", complaintService.getAllComplaints().size(),
              "totalStudents",   userService.getAllStudents().size(),
              "totalWardens",    userService.getAllWardens().size()
      ));
    }
    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        return ResponseEntity.ok(analyticsService.getAdminAnalytics());
    }
}