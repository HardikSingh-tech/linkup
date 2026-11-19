package com.linkup.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreatePostRequest {
    @NotBlank(message = "Content cannot be empty")
    private String content;
    private String mediaUrl;
}
