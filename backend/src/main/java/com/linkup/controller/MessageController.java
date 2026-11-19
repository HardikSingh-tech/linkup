package com.linkup.controller;

import com.linkup.dto.ConversationDto;
import com.linkup.dto.MessageDto;
import com.linkup.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getConversations(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(messageService.getConversations(userDetails.getUsername()));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<MessageDto>> getThread(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(messageService.getThread(userId, userDetails.getUsername()));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<MessageDto> sendMessage(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String content = body.getOrDefault("content", "");
        return ResponseEntity.ok(messageService.sendMessage(userId, content, userDetails.getUsername()));
    }

    @PutMapping("/{userId}/read")
    public ResponseEntity<Void> markRead(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        messageService.markConversationAsRead(userId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}
