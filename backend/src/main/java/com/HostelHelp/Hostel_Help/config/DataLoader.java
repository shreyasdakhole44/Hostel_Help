package com.HostelHelp.Hostel_Help.config;

import com.HostelHelp.Hostel_Help.Model.Category;
import com.HostelHelp.Hostel_Help.Model.Role;
import com.HostelHelp.Hostel_Help.Model.User;
import com.HostelHelp.Hostel_Help.Model.Complaint;
import com.HostelHelp.Hostel_Help.Model.ComplaintStatus;
import com.HostelHelp.Hostel_Help.repository.CategoryRepository;
import com.HostelHelp.Hostel_Help.repository.UserRepository;
import com.HostelHelp.Hostel_Help.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ComplaintRepository complaintRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Users
        
        // Admin
        User admin = userRepository.findByEmail("admin@hostel.com").orElse(null);
        if (admin == null) {
            admin = User.builder()
                    .name("System Admin")
                    .email("admin@hostel.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .phone("1111111111")
                    .isActive(true)
                    .build();
            admin = userRepository.save(admin);
            System.out.println(">>> Seeded Admin account: admin@hostel.com / admin123");
        }

        // Warden 1 (Joe)
        User warden1 = userRepository.findByEmail("warden@hostel.com").orElse(null);
        if (warden1 == null) {
            warden1 = User.builder()
                    .name("Warden Joe")
                    .email("warden@hostel.com")
                    .password(passwordEncoder.encode("warden123"))
                    .role(Role.WARDEN)
                    .phone("2222222222")
                    .isActive(true)
                    .build();
            warden1 = userRepository.save(warden1);
            System.out.println(">>> Seeded Warden account: warden@hostel.com / warden123");
        }

        // Warden 2 (Sarah)
        User warden2 = userRepository.findByEmail("warden2@hostel.com").orElse(null);
        if (warden2 == null) {
            warden2 = User.builder()
                    .name("Warden Sarah")
                    .email("warden2@hostel.com")
                    .password(passwordEncoder.encode("warden123"))
                    .role(Role.WARDEN)
                    .phone("3333333333")
                    .isActive(true)
                    .build();
            warden2 = userRepository.save(warden2);
            System.out.println(">>> Seeded Warden account: warden2@hostel.com / warden123");
        }

        // Student 1 (Alex)
        User student1 = userRepository.findByEmail("student@hostel.com").orElse(null);
        if (student1 == null) {
            student1 = User.builder()
                    .name("Alex Mercer")
                    .email("student@hostel.com")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .phone("4444444444")
                    .isActive(true)
                    .build();
            student1 = userRepository.save(student1);
            System.out.println(">>> Seeded Student account: student@hostel.com / student123");
        }

        // Student 2 (John)
        User student2 = userRepository.findByEmail("john@hostel.com").orElse(null);
        if (student2 == null) {
            student2 = User.builder()
                    .name("John Doe")
                    .email("john@hostel.com")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .phone("5555555555")
                    .isActive(true)
                    .build();
            student2 = userRepository.save(student2);
            System.out.println(">>> Seeded Student account: john@hostel.com / student123");
        }

        // 2. Seed Categories
        Category electrical = categoryRepository.findByName("Electricity").orElse(null);
        if (electrical == null) {
            electrical = Category.builder()
                    .name("Electricity")
                    .description("Issues with fans, lights, geysers, or power sockets")
                    .warden(warden1)
                    .build();
            electrical = categoryRepository.save(electrical);
        }

        Category plumbing = categoryRepository.findByName("Plumbing").orElse(null);
        if (plumbing == null) {
            plumbing = Category.builder()
                    .name("Plumbing")
                    .description("Taps, pipelines, toilet leakage, or pipe blockages")
                    .warden(warden1)
                    .build();
            plumbing = categoryRepository.save(plumbing);
        }

        Category internet = categoryRepository.findByName("Internet").orElse(null);
        if (internet == null) {
            internet = Category.builder()
                    .name("Internet")
                    .description("WiFi router, ethernet cable connection, or speed complaints")
                    .warden(warden2)
                    .build();
            internet = categoryRepository.save(internet);
            System.out.println(">>> Seeded categories: Electricity & Plumbing (Warden Joe), Internet (Warden Sarah)");
        }

        // 3. Seed Complaints (Only if database has no complaints)
        if (complaintRepository.count() == 0) {
            LocalDateTime now = LocalDateTime.now();

            // February 2026 complaints
            Complaint c1 = Complaint.builder()
                    .title("Ceiling fan not working")
                    .description("The fan in room 102 makes a clicking sound and does not spin at full speed.")
                    .status(ComplaintStatus.CLOSED)
                    .category(electrical)
                    .student(student1)
                    .warden(warden1)
                    .wardenRemark("Replaced capacitor in the fan motor.")
                    .createdAt(LocalDateTime.of(2026, 2, 10, 10, 30))
                    .resolvedAt(LocalDateTime.of(2026, 2, 11, 14, 0))
                    .rating(5)
                    .feedback("Repaired successfully next day. Thank you!")
                    .build();

            Complaint c2 = Complaint.builder()
                    .title("Water leakage in bathroom")
                    .description("The bathroom faucet is continuously leaking, causing water wastage.")
                    .status(ComplaintStatus.CLOSED)
                    .category(plumbing)
                    .student(student2)
                    .warden(warden1)
                    .wardenRemark("Replaced tap washers.")
                    .createdAt(LocalDateTime.of(2026, 2, 18, 9, 15))
                    .resolvedAt(LocalDateTime.of(2026, 2, 19, 16, 45))
                    .rating(4)
                    .feedback("Leak is stopped now.")
                    .build();

            Complaint c3 = Complaint.builder()
                    .title("WiFi dropping frequently")
                    .description("Internet connection on the 2nd floor drops every 10 minutes.")
                    .status(ComplaintStatus.CLOSED)
                    .category(internet)
                    .student(student1)
                    .warden(warden2)
                    .wardenRemark("Restarted main access point and refreshed IP configurations.")
                    .createdAt(LocalDateTime.of(2026, 2, 22, 16, 0))
                    .resolvedAt(LocalDateTime.of(2026, 2, 23, 11, 30))
                    .rating(3)
                    .feedback("Speed is fine, but drop issues still happen sometimes.")
                    .build();

            // March 2026 complaints
            Complaint c4 = Complaint.builder()
                    .title("Geyser not heating water")
                    .description("Geyser in the block C common bathroom does not turn on at all.")
                    .status(ComplaintStatus.CLOSED)
                    .category(electrical)
                    .student(student2)
                    .warden(warden1)
                    .wardenRemark("Replaced burnt thermostat element.")
                    .createdAt(LocalDateTime.of(2026, 3, 5, 8, 0))
                    .resolvedAt(LocalDateTime.of(2026, 3, 7, 10, 0))
                    .rating(5)
                    .feedback("Great job fixing the geyser in winter!")
                    .build();

            Complaint c5 = Complaint.builder()
                    .title("Blocked sink drain")
                    .description("Washbasin sink in room 305 is completely clogged and overflowing.")
                    .status(ComplaintStatus.CLOSED)
                    .category(plumbing)
                    .student(student1)
                    .warden(warden1)
                    .wardenRemark("Cleared pipe blockage using drainage plunger.")
                    .createdAt(LocalDateTime.of(2026, 3, 12, 11, 45))
                    .resolvedAt(LocalDateTime.of(2026, 3, 12, 17, 0))
                    .rating(5)
                    .feedback("Extremely fast resolution!")
                    .build();

            Complaint c6 = Complaint.builder()
                    .title("Ethernet port damaged")
                    .description("The RJ45 ethernet socket in room 208 wall is broken.")
                    .status(ComplaintStatus.CLOSED)
                    .category(internet)
                    .student(student2)
                    .warden(warden2)
                    .wardenRemark("Replaced the internal modular jack.")
                    .createdAt(LocalDateTime.of(2026, 3, 20, 14, 0))
                    .resolvedAt(LocalDateTime.of(2026, 3, 22, 12, 0))
                    .rating(4)
                    .feedback("Port works perfectly now.")
                    .build();

            // April 2026 complaints
            Complaint c7 = Complaint.builder()
                    .title("Corridor lights blinking")
                    .description("The tube lights in the corridor of Block A are flickering constantly.")
                    .status(ComplaintStatus.CLOSED)
                    .category(electrical)
                    .student(student1)
                    .warden(warden1)
                    .wardenRemark("Replaced two faulty choke starters.")
                    .createdAt(LocalDateTime.of(2026, 4, 2, 20, 30))
                    .resolvedAt(LocalDateTime.of(2026, 4, 3, 11, 0))
                    .rating(4)
                    .feedback("Flickering fixed.")
                    .build();

            Complaint c8 = Complaint.builder()
                    .title("WiFi speed is very slow")
                    .description("Download speed is below 1 Mbps on the student network.")
                    .status(ComplaintStatus.CLOSED)
                    .category(internet)
                    .student(student2)
                    .warden(warden2)
                    .wardenRemark("Allocated higher bandwidth priority to the hostel block.")
                    .createdAt(LocalDateTime.of(2026, 4, 15, 13, 10))
                    .resolvedAt(LocalDateTime.of(2026, 4, 17, 10, 0))
                    .rating(4)
                    .feedback("Better speed now.")
                    .build();

            Complaint c9 = Complaint.builder()
                    .title("Broken toilet flush handle")
                    .description("The flush lever in the toilet of room 108 is broken.")
                    .status(ComplaintStatus.CLOSED)
                    .category(plumbing)
                    .student(student1)
                    .warden(warden1)
                    .wardenRemark("Fitted a new plastic handle lever.")
                    .createdAt(LocalDateTime.of(2026, 4, 24, 9, 0))
                    .resolvedAt(LocalDateTime.of(2026, 4, 25, 15, 0))
                    .rating(3)
                    .feedback("Fixed but the handle feels a bit loose.")
                    .build();

            // May 2026 complaints (Live status demo)
            Complaint c10 = Complaint.builder()
                    .title("Room power socket dead")
                    .description("The primary laptop plug socket in room 204 has no power supply.")
                    .status(ComplaintStatus.IN_PROGRESS)
                    .category(electrical)
                    .student(student1)
                    .warden(warden1)
                    .createdAt(LocalDateTime.of(2026, 5, 20, 14, 0))
                    .build();

            Complaint c11 = Complaint.builder()
                    .title("High packet loss on WiFi")
                    .description("Online gaming and video calls are lagging due to 20% packet loss.")
                    .status(ComplaintStatus.RESOLVED_PENDING)
                    .category(internet)
                    .student(student2)
                    .warden(warden2)
                    .wardenRemark("Updated router firmware and relocated the antenna.")
                    .createdAt(LocalDateTime.of(2026, 5, 24, 11, 30))
                    .build();

            Complaint c12 = Complaint.builder()
                    .title("Water filter tap broken")
                    .description("Water filter in the mess area has a leaking push button.")
                    .status(ComplaintStatus.REOPENED)
                    .category(plumbing)
                    .student(student1)
                    .warden(warden1)
                    .wardenRemark("Fixed the button spring.")
                    .createdAt(LocalDateTime.of(2026, 5, 25, 8, 30))
                    .feedback("The spring was fixed but it started leaking again the next morning.")
                    .build();

            Complaint c13 = Complaint.builder()
                    .title("WiFi authentication issue")
                    .description("Cannot authenticate on the portal with my roll number credentials.")
                    .status(ComplaintStatus.PENDING)
                    .category(internet)
                    .student(student1)
                    .createdAt(LocalDateTime.of(2026, 5, 28, 12, 0))
                    .build();

            complaintRepository.saveAll(List.of(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13));
            System.out.println(">>> Seeded 13 dummy complaints across different statuses and months!");
        }
    }
}
