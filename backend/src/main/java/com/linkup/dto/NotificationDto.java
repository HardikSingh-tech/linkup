package com.linkup.dto;

import com.linkup.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private UserDto actor;
    private NotificationType type;
    private Long referenceId;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
}
