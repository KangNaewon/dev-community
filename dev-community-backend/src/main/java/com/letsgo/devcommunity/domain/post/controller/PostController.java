package com.letsgo.devcommunity.domain.post.controller;

import com.letsgo.devcommunity.domain.post.dto.PostDto;
import  com.letsgo.devcommunity.domain.post.entity.Comment;
import com.letsgo.devcommunity.domain.post.dto.postListDto;
import com.letsgo.devcommunity.domain.post.entity.Comment;
import com.letsgo.devcommunity.domain.post.entity.Post;
import com.letsgo.devcommunity.domain.post.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {
    private final PostService postService;

    @Autowired
    public PostController(PostService postService){
        this.postService = postService;
    }

    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return postService.createPost(post);
    }

    @GetMapping("/{postId}")
    public PostDto getOnePost(@PathVariable("postId") Long id) {
        return postService.getOnePost(id);
    }

    @GetMapping
    public postListDto getAll(@RequestParam(defaultValue = "0") Integer page,
                              @RequestParam(defaultValue = "10") Integer size,
                              @RequestParam(defaultValue = "createdAt,desc") String sort) {
        return postService.findAll(page, size, sort);
    }

    @PutMapping("/{postId}")
    public Post updatePost(@PathVariable("postId") Long id, @RequestBody Post post) {
        return postService.updatePost(id,post);
    }

    @DeleteMapping("/{postId}")
    public void deletePost(@PathVariable("postId") Long id) {
        postService.deletePost(id);
    }

    @PostMapping("/{postId}/comment")
    public Comment createComment(@PathVariable("postId") Long id, @RequestBody Comment comment){
        return postService.createComment(id, comment);
    }

    @DeleteMapping("/comment/{commentId}")
    public void deleteComment(@PathVariable("commentId") Long id) {
        postService.deleteComment(id);
    }

    @PostMapping("/{postId}/postLike")
    public void createPostLike(@PathVariable("postId") Long id) {
        postService.createPostLike(id, 1L);
    }

    @DeleteMapping("/{postId}/postLike")
    public void deletePostLike(@PathVariable("postId") Long id){
        postService.deletePostLike(id, 1L);
    }

    @GetMapping("/my/{userId}")
    public List<Post> getUserPosts(@PathVariable("userId") Long userId) {
        return postService.getUserPosts(userId);
    }
    @GetMapping("/like/{userId}")
    public List<Post> getUserPostLike(@PathVariable("userId") Long userId) {
        return postService.getUserPostLike(userId);
    }

}
