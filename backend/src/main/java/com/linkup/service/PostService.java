package com.linkup.service;

import com.linkup.dto.CommentDto;
import com.linkup.dto.CreateCommentRequest;
import com.linkup.dto.CreatePostRequest;
import com.linkup.dto.PageResponse;
import com.linkup.dto.PostDto;
import com.linkup.entity.Comment;
import com.linkup.entity.NotificationType;
import com.linkup.entity.Post;
import com.linkup.entity.PostLike;
import com.linkup.entity.User;
import com.linkup.exception.BadRequestException;
import com.linkup.exception.ResourceNotFoundException;
import com.linkup.repository.CommentRepository;
import com.linkup.repository.ConnectionRepository;
import com.linkup.repository.PostLikeRepository;
import com.linkup.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentRepository commentRepository;
    private final ConnectionRepository connectionRepository;
    private final AuthService authService;
    private final NotificationService notificationService;

    @Transactional
    public PostDto createPost(CreatePostRequest request, String currentEmail) {
        User author = authService.getCurrentUser(currentEmail);
        Post post = Post.builder()
                .author(author)
                .content(request.getContent())
                .mediaUrl(request.getMediaUrl())
                .build();
        post = postRepository.save(post);
        return mapToDto(post, author.getId());
    }

    public PageResponse<PostDto> getFeed(int page, int size, String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        Set<Long> authorIds = new HashSet<>(connectionRepository.findConnectedUserIds(currentUser.getId()));
        authorIds.add(currentUser.getId());

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> postsPage = postRepository.findFeedPosts(authorIds, pageRequest);

        List<PostDto> dtos = postsPage.getContent().stream()
                .map(p -> mapToDto(p, currentUser.getId()))
                .collect(Collectors.toList());

        return PageResponse.<PostDto>builder()
                .content(dtos)
                .pageNumber(postsPage.getNumber())
                .pageSize(postsPage.getSize())
                .totalElements(postsPage.getTotalElements())
                .totalPages(postsPage.getTotalPages())
                .last(postsPage.isLast())
                .build();
    }

    public PageResponse<PostDto> getUserPosts(Long userId, int page, int size, String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> postsPage = postRepository.findByAuthorIdOrderByCreatedAtDesc(userId, pageRequest);

        List<PostDto> dtos = postsPage.getContent().stream()
                .map(p -> mapToDto(p, currentUser.getId()))
                .collect(Collectors.toList());

        return PageResponse.<PostDto>builder()
                .content(dtos)
                .pageNumber(postsPage.getNumber())
                .pageSize(postsPage.getSize())
                .totalElements(postsPage.getTotalElements())
                .totalPages(postsPage.getTotalPages())
                .last(postsPage.isLast())
                .build();
    }

    @Transactional
    public void deletePost(Long postId, String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + postId));

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can only delete your own posts");
        }
        postRepository.delete(post);
    }

    @Transactional
    public boolean toggleLike(Long postId, String currentEmail) {
        User currentUser = authService.getCurrentUser(currentEmail);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + postId));

        Optional<PostLike> existingLike = postLikeRepository.findByPostIdAndUserId(postId, currentUser.getId());
        if (existingLike.isPresent()) {
            postLikeRepository.delete(existingLike.get());
            return false;
        } else {
            PostLike like = PostLike.builder().post(post).user(currentUser).build();
            postLikeRepository.save(like);

            notificationService.createNotification(
                    post.getAuthor(),
                    currentUser,
                    NotificationType.POST_LIKE,
                    post.getId(),
                    currentUser.getFirstName() + " " + currentUser.getLastName() + " liked your post."
            );

            return true;
        }
    }

    @Transactional
    public CommentDto addComment(Long postId, CreateCommentRequest request, String currentEmail) {
        User author = authService.getCurrentUser(currentEmail);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + postId));

        Comment comment = Comment.builder()
                .post(post)
                .author(author)
                .content(request.getContent())
                .build();

        comment = commentRepository.save(comment);

        notificationService.createNotification(
                post.getAuthor(),
                author,
                NotificationType.POST_COMMENT,
                post.getId(),
                author.getFirstName() + " " + author.getLastName() + " commented on your post."
        );

        return mapCommentToDto(comment);
    }

    public List<CommentDto> getPostComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId).stream()
                .map(this::mapCommentToDto)
                .collect(Collectors.toList());
    }

    public PostDto mapToDto(Post post, Long currentUserId) {
        long likeCount = postLikeRepository.countByPostId(post.getId());
        long commentCount = commentRepository.countByPostId(post.getId());
        boolean likedByMe = currentUserId != null && postLikeRepository.existsByPostIdAndUserId(post.getId(), currentUserId);

        return PostDto.builder()
                .id(post.getId())
                .author(authService.mapToDto(post.getAuthor()))
                .content(post.getContent())
                .mediaUrl(post.getMediaUrl())
                .likeCount(likeCount)
                .commentCount(commentCount)
                .likedByMe(likedByMe)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    public CommentDto mapCommentToDto(Comment c) {
        return CommentDto.builder()
                .id(c.getId())
                .postId(c.getPost().getId())
                .author(authService.mapToDto(c.getAuthor()))
                .content(c.getContent())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
