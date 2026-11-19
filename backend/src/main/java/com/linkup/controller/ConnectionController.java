package com.linkup.controller;

import com.linkup.dto.ConnectionDto;
import com.linkup.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/connections")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;

    @PostMapping("/request/{userId}")
    public ResponseEntity<ConnectionDto> sendRequest(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(connectionService.sendRequest(userId, userDetails.getUsername()));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ConnectionDto> acceptRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(connectionService.acceptRequest(id, userDetails.getUsername()));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ConnectionDto> rejectRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(connectionService.rejectRequest(id, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<ConnectionDto>> getMyConnections(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(connectionService.getMyConnections(userDetails.getUsername()));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ConnectionDto>> getPendingRequests(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(connectionService.getPendingRequests(userDetails.getUsername()));
    }
}
