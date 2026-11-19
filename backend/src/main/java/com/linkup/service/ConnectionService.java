package com.linkup.service;

import com.linkup.dto.ConnectionDto;
import com.linkup.entity.Connection;
import com.linkup.entity.ConnectionStatus;
import com.linkup.entity.NotificationType;
import com.linkup.entity.User;
import com.linkup.exception.BadRequestException;
import com.linkup.exception.ResourceNotFoundException;
import com.linkup.repository.ConnectionRepository;
import com.linkup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final NotificationService notificationService;

    @Transactional
    public ConnectionDto sendRequest(Long receiverId, String currentEmail) {
        User requester = authService.getCurrentUser(currentEmail);
        if (requester.getId().equals(receiverId)) {
            throw new BadRequestException("You cannot connect with yourself");
        }
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + receiverId));

        Optional<Connection> existing = connectionRepository.findConnectionBetween(requester.getId(), receiverId);
        Connection conn;
        if (existing.isPresent()) {
            conn = existing.get();
            if (conn.getStatus() == ConnectionStatus.ACCEPTED) {
                throw new BadRequestException("You are already connected with this user");
            }
            if (conn.getStatus() == ConnectionStatus.PENDING) {
                throw new BadRequestException("Connection request is already pending");
            }
            conn.setRequester(requester);
            conn.setReceiver(receiver);
            conn.setStatus(ConnectionStatus.PENDING);
            conn = connectionRepository.save(conn);
        } else {
            conn = Connection.builder()
                    .requester(requester)
                    .receiver(receiver)
                    .status(ConnectionStatus.PENDING)
                    .build();
            conn = connectionRepository.save(conn);
        }

        notificationService.createNotification(
                receiver,
                requester,
                NotificationType.CONNECTION_REQUEST,
                conn.getId(),
                requester.getFirstName() + " " + requester.getLastName() + " sent you a connection request."
        );

        return mapToDto(conn);
    }

    @Transactional
    public ConnectionDto acceptRequest(Long connectionId, String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        Connection conn = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection not found: " + connectionId));

        if (!conn.getReceiver().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Only the receiver can accept the connection request");
        }
        conn.setStatus(ConnectionStatus.ACCEPTED);
        conn = connectionRepository.save(conn);

        notificationService.createNotification(
                conn.getRequester(),
                currentUser,
                NotificationType.CONNECTION_ACCEPTED,
                conn.getId(),
                currentUser.getFirstName() + " " + currentUser.getLastName() + " accepted your connection request."
        );

        return mapToDto(conn);
    }

    @Transactional
    public ConnectionDto rejectRequest(Long connectionId, String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        Connection conn = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection not found: " + connectionId));

        if (!conn.getReceiver().getId().equals(currentUser.getId()) && !conn.getRequester().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Unauthorized access to this connection");
        }
        conn.setStatus(ConnectionStatus.REJECTED);
        return mapToDto(connectionRepository.save(conn));
    }

    public List<ConnectionDto> getMyConnections(String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        return connectionRepository.findAcceptedConnections(currentUser.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ConnectionDto> getPendingRequests(String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        return connectionRepository.findPendingReceivedRequests(currentUser.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ConnectionDto mapToDto(Connection c) {
        return ConnectionDto.builder()
                .id(c.getId())
                .requester(authService.mapToDto(c.getRequester()))
                .receiver(authService.mapToDto(c.getReceiver()))
                .status(c.getStatus())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
