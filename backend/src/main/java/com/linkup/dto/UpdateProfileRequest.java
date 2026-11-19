package com.linkup.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank(message = "First name is required")
    private String firstName;
    @NotBlank(message = "Last name is required")
    private String lastName;
    private String headline;
    private String location;
    private String about;
    private String avatarUrl;
    private String bannerUrl;
}
