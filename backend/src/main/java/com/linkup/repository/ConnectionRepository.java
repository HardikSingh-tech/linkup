package com.linkup.repository;

import com.linkup.entity.Connection;
import com.linkup.entity.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    
    @Query("SELECT c FROM Connection c WHERE (c.requester.id = :u1 AND c.receiver.id = :u2) OR (c.requester.id = :u2 AND c.receiver.id = :u1)")
    Optional<Connection> findConnectionBetween(@Param("u1") Long u1, @Param("u2") Long u2);

    @Query("SELECT c FROM Connection c WHERE (c.requester.id = :userId OR c.receiver.id = :userId) AND c.status = 'ACCEPTED'")
    List<Connection> findAcceptedConnections(@Param("userId") Long userId);

    @Query("SELECT c FROM Connection c WHERE c.receiver.id = :userId AND c.status = 'PENDING'")
    List<Connection> findPendingReceivedRequests(@Param("userId") Long userId);

    @Query("SELECT CASE WHEN c.requester.id = :userId THEN c.receiver.id ELSE c.requester.id END " +
           "FROM Connection c WHERE (c.requester.id = :userId OR c.receiver.id = :userId) AND c.status = 'ACCEPTED'")
    List<Long> findConnectedUserIds(@Param("userId") Long userId);

    @Query("SELECT CASE WHEN c.requester.id = :userId THEN c.receiver.id ELSE c.requester.id END " +
           "FROM Connection c WHERE (c.requester.id = :userId OR c.receiver.id = :userId)")
    List<Long> findAllAssociatedUserIds(@Param("userId") Long userId);
}
