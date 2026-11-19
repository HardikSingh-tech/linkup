package com.linkup.service;

import com.linkup.dto.ConversationDto;
import com.linkup.dto.MessageDto;
import com.linkup.entity.Message;
import com.linkup.entity.User;
import com.linkup.exception.ResourceNotFoundException;
import com.linkup.repository.MessageRepository;
import com.linkup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public List<ConversationDto> getConversations(String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        List<Long> partnerIds = messageRepository.findConversationPartnerIds(currentUser.getId());
        List<ConversationDto> conversations = new ArrayList<>();

        for (Long partnerId : partnerIds) {
            User partner = userRepository.findById(partnerId).orElse(null);
            if (partner == null) continue;

            List<Message> thread = messageRepository.findConversation(currentUser.getId(), partnerId);
            if (thread.isEmpty()) continue;

            Message lastMsg = thread.get(thread.size() - 1);
            long unread = thread.stream()
                    .filter(m -> m.getRecipient().getId().equals(currentUser.getId()) && !m.isRead())
                    .count();

            conversations.add(ConversationDto.builder()
                    .partner(authService.mapToDto(partner))
                    .lastMessage(mapToDto(lastMsg))
                    .unreadCount(unread)
                    .build());
        }

        // Sort by last message time desc
        conversations.sort((a, b) -> b.getLastMessage().getCreatedAt().compareTo(a.getLastMessage().getCreatedAt()));
        return conversations;
    }

    public List<MessageDto> getThread(Long targetUserId, String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        return messageRepository.findConversation(currentUser.getId(), targetUserId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageDto sendMessage(Long targetUserId, String content, String currentEmail) {
        User sender = authService.getCurrentUser(currentEmail);
        User recipient = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + targetUserId));

        Message message = Message.builder()
                .sender(sender)
                .recipient(recipient)
                .content(content)
                .isRead(false)
                .build();

        return mapToDto(messageRepository.save(message));
    }

    @Transactional
    public void markConversationAsRead(Long targetUserId, String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        messageRepository.markConversationAsRead(targetUserId, currentUser.getId());
    }

    private MessageDto mapToDto(Message m) {
        return MessageDto.builder()
                .id(m.getId())
                .senderId(m.getSender().getId())
                .recipientId(m.getRecipient().getId())
                .content(m.getContent())
                .isRead(m.isRead())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
