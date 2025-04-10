package com.letsgo.devcommunity.domain.post.dto;

import com.letsgo.devcommunity.domain.member.entity.Member;
import com.letsgo.devcommunity.domain.post.entity.Comment;
import com.letsgo.devcommunity.domain.post.entity.Post;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PostDto {
    private Long postId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private int postLikeCount;
    private boolean isPostLiked;
    private List<Comment> comments;
    private Long authorId;
    private String authorNickname;
    private String authorProfileImageUrl;

    public PostDto(Post post, Member member, List<Comment> comments, Integer postLikeCount, Boolean isPostLiked) {
        this.postId = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.createdAt = post.getCreatedAt();
        this.postLikeCount = postLikeCount;
        this.isPostLiked = isPostLiked;
        this.comments = comments;
        this.authorId = member.getId();
        this.authorNickname = member.getNickname();
        this.authorProfileImageUrl = member.getProfileImageUrl();
    }

    public PostDto() {}
}
