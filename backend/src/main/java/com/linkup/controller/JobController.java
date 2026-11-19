package com.linkup.controller;

import com.linkup.dto.JobApplicationDto;
import com.linkup.dto.JobDto;
import com.linkup.dto.PageResponse;
import com.linkup.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<PageResponse<JobDto>> getJobs(
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false, defaultValue = "") String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(jobService.getJobs(q, location, page, size, userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(jobService.getJobById(id, userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<JobDto> createJob(
            @Valid @RequestBody JobDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(jobService.createJob(dto, userDetails.getUsername()));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<JobApplicationDto> applyJob(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String notes = body != null ? body.get("notes") : "";
        return ResponseEntity.ok(jobService.applyJob(id, notes, userDetails.getUsername()));
    }

    @GetMapping("/applied")
    public ResponseEntity<List<JobApplicationDto>> getAppliedJobs(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(jobService.getMyApplications(userDetails.getUsername()));
    }
}
