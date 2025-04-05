package com.letsgo.devcommunity.domain.post.service;

import com.letsgo.devcommunity.domain.member.entity.Member;
import com.letsgo.devcommunity.domain.member.repository.MemberRepository;
import com.letsgo.devcommunity.domain.post.dto.PostDto;
import com.letsgo.devcommunity.domain.post.entity.Comment;
import com.letsgo.devcommunity.domain.post.entity.Post;
import com.letsgo.devcommunity.domain.post.entity.PostLike;
import com.letsgo.devcommunity.domain.post.repository.PostRepository;
import com.letsgo.devcommunity.domain.post.repository.PostLikeRepository;
import com.letsgo.devcommunity.domain.post.repository.CommentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;
    private final MemberRepository memberRepository;

    @Autowired
    public PostService(PostRepository postRepository, CommentRepository commentRepository, PostLikeRepository postLikeRepository, MemberRepository memberRepository) {
        this.postLikeRepository = postLikeRepository;
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.memberRepository = memberRepository;
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

    public void createPostLike(Long postId, Long userId) {
        final var star = postLikeRepository.findByPostIdAndUserId(postId, userId);
        if(star.isEmpty()){
            postLikeRepository.save(new PostLike(userId, postId));
        }
    }

    public void deletePostLike(Long postId, Long userId) {
        postLikeRepository.deleteByPostIdAndUserId(postId, userId);
    }

    public List<Post> getUserPosts(Long userId){
        return postRepository.findAllByUserId(userId);
    }

    public List<Post> getUserPostLike(Long userId){
        List<PostLike> likeList = postLikeRepository.findAllByUserId(userId);
        if(!likeList.isEmpty()){
            List<Long> postIds = likeList.stream().map(PostLike::getPostId).toList();
            return postRepository.findAllByIdIn(postIds);
        }
        return new ArrayList<>();
    }

    public PostDto getOnePost(Long postId) {
        Optional<Post> post = postRepository.findById(postId);
        if (post.isEmpty()){
            throw new IllegalArgumentException("post not found");
        }
        Long userId = post.get().getUserId();
        Optional<Member> member = memberRepository.findById(userId);
        if(member.isEmpty()){
            throw new IllegalArgumentException("member not found");
        }
        List<Comment> comments = commentRepository.findAllByPostId(postId);
        List<PostLike> postLikes = postLikeRepository.findAllByPostId(postId);
        return new PostDto(post.get(), member.get(), comments, postLikes.size(), false);
    }
}
