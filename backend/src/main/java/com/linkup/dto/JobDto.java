package com.linkup.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDto {
    private Long id;
    private UserDto poster;
    @NotBlank(message = "Job title is required")
    private String title;
    @NotBlank(message = "Company is required")
    private String company;
    @NotBlank(message = "Location is required")
    private String location;
    private String employmentType;
    private String workplaceType;
    private String salaryRange;
    @NotBlank(message = "Description is required")
    private String description;
    private long applicantCount;
    private boolean appliedByMe;
    private LocalDateTime createdAt;
}
