package com.HostelHelp.Hostel_Help.service;

import com.HostelHelp.Hostel_Help.Model.Complaint;
import com.HostelHelp.Hostel_Help.Model.ComplaintStatus;
import com.HostelHelp.Hostel_Help.Model.User;
import com.HostelHelp.Hostel_Help.repository.ComplaintRepository;
import com.HostelHelp.Hostel_Help.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public Map<String, Object> getAdminAnalytics() {
        List<Complaint> complaints = complaintRepository.findAll();

        // 1. Category Distribution
        List<Map<String, Object>> categoryStats = complaints.stream()
                .filter(c -> c.getCategory() != null)
                .collect(Collectors.groupingBy(c -> c.getCategory().getName(), Collectors.counting()))
                .entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        // 2. Status Distribution
        List<Map<String, Object>> statusStats = complaints.stream()
                .collect(Collectors.groupingBy(c -> c.getStatus().name(), Collectors.counting()))
                .entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        // 3. Monthly Trend (last 6 months)
        Map<String, Long> monthlyCreated = complaints.stream()
                .filter(c -> c.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        c -> c.getCreatedAt().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + c.getCreatedAt().getYear(),
                        Collectors.counting()
                ));

        Map<String, Long> monthlyResolved = complaints.stream()
                .filter(c -> c.getResolvedAt() != null)
                .collect(Collectors.groupingBy(
                        c -> c.getResolvedAt().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + c.getResolvedAt().getYear(),
                        Collectors.counting()
                ));

        Set<String> allMonths = new HashSet<>();
        allMonths.addAll(monthlyCreated.keySet());
        allMonths.addAll(monthlyResolved.keySet());

        List<Map<String, Object>> monthlyTrends = allMonths.stream()
                .map(month -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("month", month);
                    map.put("complaints", monthlyCreated.getOrDefault(month, 0L));
                    map.put("resolved", monthlyResolved.getOrDefault(month, 0L));
                    return map;
                })
                .sorted((a, b) -> {
                    return ((String) a.get("month")).compareTo((String) b.get("month"));
                })
                .collect(Collectors.toList());

        // 4. Warden Performance Leaderboard
        List<Map<String, Object>> wardenPerformance = complaints.stream()
                .filter(c -> c.getWarden() != null)
                .collect(Collectors.groupingBy(Complaint::getWarden))
                .entrySet().stream()
                .map(entry -> {
                    User warden = entry.getKey();
                    List<Complaint> wardenComplaints = entry.getValue();

                    long resolvedCount = wardenComplaints.stream()
                            .filter(c -> c.getStatus() == ComplaintStatus.CLOSED || c.getStatus() == ComplaintStatus.RESOLVED_PENDING)
                            .count();

                    double avgRating = wardenComplaints.stream()
                            .filter(c -> c.getRating() != null)
                            .mapToInt(Complaint::getRating)
                            .average()
                            .orElse(0.0);

                    avgRating = Math.round(avgRating * 10.0) / 10.0;

                    Map<String, Object> map = new HashMap<>();
                    map.put("wardenName", warden.getName());
                    map.put("resolved", resolvedCount);
                    map.put("averageRating", avgRating);
                    map.put("totalAssigned", (long) wardenComplaints.size());
                    return map;
                })
                .sorted((a, b) -> Long.compare((Long) b.get("resolved"), (Long) a.get("resolved")))
                .collect(Collectors.toList());

        // 5. General stats summary
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalComplaints", (long) complaints.size());
        summary.put("resolvedComplaints", complaints.stream().filter(c -> c.getStatus() == ComplaintStatus.CLOSED || c.getStatus() == ComplaintStatus.RESOLVED_PENDING).count());
        summary.put("pendingComplaints", complaints.stream().filter(c -> c.getStatus() == ComplaintStatus.PENDING || c.getStatus() == ComplaintStatus.REOPENED).count());
        summary.put("inProgressComplaints", complaints.stream().filter(c -> c.getStatus() == ComplaintStatus.IN_PROGRESS || c.getStatus() == ComplaintStatus.ASSIGNED).count());

        Map<String, Object> result = new HashMap<>();
        result.put("categoryDistribution", categoryStats);
        result.put("statusDistribution", statusStats);
        result.put("monthlyTrends", monthlyTrends);
        result.put("wardenPerformance", wardenPerformance);
        result.put("summary", summary);

        return result;
    }

    public Map<String, Object> getWardenAnalytics(Long wardenId) {
        List<Complaint> complaints = complaintRepository.findAll().stream()
                .filter(c -> c.getWarden() != null && c.getWarden().getId().equals(wardenId))
                .collect(Collectors.toList());

        List<Map<String, Object>> categoryStats = complaints.stream()
                .filter(c -> c.getCategory() != null)
                .collect(Collectors.groupingBy(c -> c.getCategory().getName(), Collectors.counting()))
                .entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> statusStats = complaints.stream()
                .collect(Collectors.groupingBy(c -> c.getStatus().name(), Collectors.counting()))
                .entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalComplaints", (long) complaints.size());
        summary.put("resolvedComplaints", complaints.stream().filter(c -> c.getStatus() == ComplaintStatus.CLOSED || c.getStatus() == ComplaintStatus.RESOLVED_PENDING).count());
        summary.put("pendingComplaints", complaints.stream().filter(c -> c.getStatus() == ComplaintStatus.PENDING || c.getStatus() == ComplaintStatus.REOPENED).count());
        summary.put("inProgressComplaints", complaints.stream().filter(c -> c.getStatus() == ComplaintStatus.IN_PROGRESS || c.getStatus() == ComplaintStatus.ASSIGNED).count());

        double avgRating = complaints.stream()
                .filter(c -> c.getRating() != null)
                .mapToInt(Complaint::getRating)
                .average()
                .orElse(0.0);
        summary.put("averageRating", Math.round(avgRating * 10.0) / 10.0);

        Map<String, Object> result = new HashMap<>();
        result.put("categoryDistribution", categoryStats);
        result.put("statusDistribution", statusStats);
        result.put("summary", summary);

        return result;
    }
}
