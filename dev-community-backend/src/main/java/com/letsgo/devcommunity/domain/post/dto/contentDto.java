package com.letsgo.devcommunity.domain.post.dto;

import com.letsgo.devcommunity.domain.post.entity.Post;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class contentDto {
    Long id;
    String title;
    AuthorDTO authorDTO;
    Integer likeCount;
    Integer commentCount;
    LocalDateTime createdAt;

    public static contentDto fromEntity(Post post, Integer likeCount, Integer commentCount, AuthorDTO authorDTO) {
        return new contentDto(
                post.getId(),
                post.getTitle(),
                authorDTO,
                likeCount,
                commentCount,
                post.getCreatedAt()
        );
    }
}
