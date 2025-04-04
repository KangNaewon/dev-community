package com.letsgo.devcommunity.domain.post.controller;

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
    public Post getOne(@PathVariable("postId") Long id) {
        return postService.findById(id);
    }

    @GetMapping
    public List<Post> getAll() {
        return postService.findAll();
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

    @PostMapping("/{postId}/star")
    public void createStar(@PathVariable("postId") Long id) {
        postService.createStar(id, 1L);
    }

    @DeleteMapping("/{postId}/star")
    public void deleteStar(@PathVariable("postId") Long id){
        postService.deleteStar(id, 1L);
    }

}
