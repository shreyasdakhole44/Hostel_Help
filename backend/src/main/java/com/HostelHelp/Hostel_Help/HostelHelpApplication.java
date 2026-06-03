package com.HostelHelp.Hostel_Help;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class HostelHelpApplication {
	public static void main(String[] args) {
		SpringApplication.run(HostelHelpApplication.class, args);
	}
}