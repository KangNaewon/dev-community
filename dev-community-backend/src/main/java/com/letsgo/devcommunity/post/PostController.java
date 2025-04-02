package com.letsgo.devcommunity.post;

import com.letsgo.devcommunity.post.entity.Comment;
import com.letsgo.devcommunity.post.entity.Post;
import lombok.RequiredArgsConstructor;
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
    public Post create(@RequestBody Post post) {
        return postService.create(post);
    }

    @GetMapping("/{postId}")
    public Post getOne(@PathVariable Long id) {
        return postService.findById(id);
    }

    @GetMapping
    public List<Post> getAll() {
        return postService.findAll();
    }

    @PutMapping("/{postId}")
    public Post update(@PathVariable Long id, @RequestBody Post post) {
        return postService.update(id,post);
    }

    @DeleteMapping("/{postId}")
    public void delete(@PathVariable Long id) {
        postService.delete  (id);
    }

    @PostMapping("/{postId}/comment")
    public Comment createComment(@PathVariable Long id, @RequestBody Comment comment){
        return postService.createComment(id, comment);
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long id) {
        postService.deleteComment(id);
    }

    @PostMapping("/{postId}/star")
    public void createStar(@PathVariable Long id) {
        postService.createStar(id, 1L);
    }

    @DeleteMapping("/{postId}/star")
    public void deleteStar(@PathVariable Long id){
        postService.deleteStar(id, 1L);
    }

}
