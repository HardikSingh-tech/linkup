package com.linkup.service;

import com.linkup.dto.JobApplicationDto;
import com.linkup.dto.JobDto;
import com.linkup.dto.PageResponse;
import com.linkup.entity.Job;
import com.linkup.entity.JobApplication;
import com.linkup.entity.User;
import com.linkup.exception.BadRequestException;
import com.linkup.exception.ResourceNotFoundException;
import com.linkup.repository.JobApplicationRepository;
import com.linkup.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final AuthService authService;

    public PageResponse<JobDto> getJobs(String query, String location, int page, int size, String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobsPage = jobRepository.searchJobs(query, location, pageRequest);

        List<JobDto> dtos = jobsPage.getContent().stream()
                .map(j -> mapToDto(j, currentUser.getId()))
                .collect(Collectors.toList());

        return PageResponse.<JobDto>builder()
                .content(dtos)
                .pageNumber(jobsPage.getNumber())
                .pageSize(jobsPage.getSize())
                .totalElements(jobsPage.getTotalElements())
                .totalPages(jobsPage.getTotalPages())
                .last(jobsPage.isLast())
                .build();
    }

    public JobDto getJobById(Long id, String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + id));
        return mapToDto(job, currentUser.getId());
    }

    @Transactional
    public JobDto createJob(JobDto dto, String currentEmail) {
        User poster = authService.getCurrentUser(currentEmail);
        Job job = Job.builder()
                .poster(poster)
                .title(dto.getTitle())
                .company(dto.getCompany())
                .location(dto.getLocation())
                .employmentType(dto.getEmploymentType() != null ? dto.getEmploymentType() : "Full-time")
                .workplaceType(dto.getWorkplaceType() != null ? dto.getWorkplaceType() : "Hybrid")
                .salaryRange(dto.getSalaryRange())
                .description(dto.getDescription())
                .build();

        return mapToDto(jobRepository.save(job), poster.getId());
    }

    @Transactional
    public JobApplicationDto applyJob(Long jobId, String notes, String currentEmail) {
        User applicant = authService.getCurrentUser(currentEmail);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));

        if (jobApplicationRepository.existsByJobIdAndApplicantId(jobId, applicant.getId())) {
            throw new BadRequestException("You have already applied for this job");
        }

        JobApplication application = JobApplication.builder()
                .job(job)
                .applicant(applicant)
                .status("SUBMITTED")
                .notes(notes)
                .build();

        return mapApplicationToDto(jobApplicationRepository.save(application), applicant.getId());
    }

    public List<JobApplicationDto> getMyApplications(String currentEmail) {
        User applicant = authService.getCurrentUser(currentEmail);
        return jobApplicationRepository.findByApplicantIdOrderByAppliedAtDesc(applicant.getId()).stream()
                .map(app -> mapApplicationToDto(app, applicant.getId()))
                .collect(Collectors.toList());
    }

    public JobDto mapToDto(Job job, Long currentUserId) {
        long applicants = jobApplicationRepository.countByJobId(job.getId());
        boolean applied = currentUserId != null && jobApplicationRepository.existsByJobIdAndApplicantId(job.getId(), currentUserId);

        return JobDto.builder()
                .id(job.getId())
                .poster(authService.mapToDto(job.getPoster()))
                .title(job.getTitle())
                .company(job.getCompany())
                .location(job.getLocation())
                .employmentType(job.getEmploymentType())
                .workplaceType(job.getWorkplaceType())
                .salaryRange(job.getSalaryRange())
                .description(job.getDescription())
                .applicantCount(applicants)
                .appliedByMe(applied)
                .createdAt(job.getCreatedAt())
                .build();
    }

    public JobApplicationDto mapApplicationToDto(JobApplication app, Long currentUserId) {
        return JobApplicationDto.builder()
                .id(app.getId())
                .job(mapToDto(app.getJob(), currentUserId))
                .applicant(authService.mapToDto(app.getApplicant()))
                .status(app.getStatus())
                .notes(app.getNotes())
                .appliedAt(app.getAppliedAt())
                .build();
    }
}
