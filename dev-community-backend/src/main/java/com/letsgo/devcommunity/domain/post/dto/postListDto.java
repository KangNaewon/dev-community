package com.letsgo.devcommunity.domain.post.dto;

import jakarta.persistence.PrePersist;

import java.time.LocalDateTime;
import java.util.List;

public class postListDto {
    Integer totalPages;
    Integer totalElements;
    Integer number;
    Integer size;
    List<contentDto> content;

    public postListDto(Integer totalPages, Integer totalElements, Integer number, Integer size, List<contentDto> content) {
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.number = number;
        this.size = size;
        this.content = content;
    }
}
