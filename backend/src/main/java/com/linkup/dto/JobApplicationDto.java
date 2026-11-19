package com.linkup.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationDto {
    private Long id;
    private JobDto job;
    private UserDto applicant;
    private String status;
    private String notes;
    private LocalDateTime appliedAt;
}
