package com.letsgo.devcommunity.post;

import com.letsgo.devcommunity.post.entity.Comment;
import com.letsgo.devcommunity.post.entity.Post;
import com.letsgo.devcommunity.post.entity.PostStar;
import com.letsgo.devcommunity.post.repository.PostRepository;
import com.letsgo.devcommunity.post.repository.StarRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.sql.ast.tree.expression.Star;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.letsgo.devcommunity.post.repository.CommentRepository;

import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final StarRepository starRepository;

    @Autowired
    public PostService(PostRepository postRepository, CommentRepository commentRepository, StarRepository starRepository) {
        this.starRepository = starRepository;
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
        final var star = starRepository.findByPostIdAndUserId(postId, userId);
        if(star.isEmpty()){
            starRepository.save(new PostStar(userId, postId));
        }
    }

    public void deleteStar(Long postId, Long userId) {
        starRepository.deleteByPostIdAndUserId(postId, userId);
    }

}
