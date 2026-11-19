package com.linkup.dto;

import com.linkup.entity.ConnectionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionDto {
    private Long id;
    private UserDto requester;
    private UserDto receiver;
    private ConnectionStatus status;
    private LocalDateTime createdAt;
}
