package com.letsgo.devcommunity.domain.post.service;

import com.letsgo.devcommunity.domain.post.entity.Comment;
import com.letsgo.devcommunity.domain.post.entity.Post;
import com.letsgo.devcommunity.domain.post.entity.PostLike;
import com.letsgo.devcommunity.domain.post.repository.PostRepository;
import com.letsgo.devcommunity.domain.post.repository.PostLikeRepository;
import com.letsgo.devcommunity.domain.post.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;

    @Autowired
    public PostService(PostRepository postRepository, CommentRepository commentRepository, PostLikeRepository postLikeRepository) {
        this.postLikeRepository = postLikeRepository;
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post findById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다."));
    }

    public List<Post> findAll() {
        return postRepository.findAll();
    }

    public Post updatePost(Long id, Post updatedPost) {
        Post post = findById(id);
        post.setTitle(updatedPost.getTitle());
        post.setContent(updatedPost.getContent());
        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public Comment createComment(Long id, Comment comment) {
        return commentRepository.save(comment);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    public void createStar(Long postId, Long userId) {
        final var star = postLikeRepository.findByPostIdAndUserId(postId, userId);
        if(star.isEmpty()){
            postLikeRepository.save(new PostLike(userId, postId));
        }
    }

    public void deleteStar(Long postId, Long userId) {
        postLikeRepository.deleteByPostIdAndUserId(postId, userId);
    }

}
