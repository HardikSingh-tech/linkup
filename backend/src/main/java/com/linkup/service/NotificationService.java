package com.linkup.service;

import com.linkup.dto.NotificationDto;
import com.linkup.entity.Notification;
import com.linkup.entity.NotificationType;
import com.linkup.entity.User;
import com.linkup.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AuthService authService;

    @Transactional
    public void createNotification(User recipient, User actor, NotificationType type, Long referenceId, String message) {
        if (recipient.getId().equals(actor.getId())) {
            return; // don't notify for own actions
        }

        Notification notification = Notification.builder()
                .recipient(recipient)
                .actor(actor)
                .type(type)
                .referenceId(referenceId)
                .message(message)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    public List<NotificationDto> getMyNotifications(String currentEmail) {
        User recipient = authService.getCurrentUser(currentEmail);
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipient.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String currentEmail) {
        User recipient = authService.getCurrentUser(currentEmail);
        return notificationRepository.countByRecipientIdAndIsReadFalse(recipient.getId());
    }

    @Transactional
    public void markAllAsRead(String currentEmail) {
        User recipient = authService.getCurrentUser(currentEmail);
        notificationRepository.markAllAsRead(recipient.getId());
    }

    private NotificationDto mapToDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .actor(authService.mapToDto(n.getActor()))
                .type(n.getType())
                .referenceId(n.getReferenceId())
                .message(n.getMessage())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
