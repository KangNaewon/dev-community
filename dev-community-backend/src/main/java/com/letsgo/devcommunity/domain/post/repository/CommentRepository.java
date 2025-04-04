package com.letsgo.devcommunity.domain.post.repository;

import com.letsgo.devcommunity.domain.post.entity.Comment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface CommentRepository extends JpaRepository<Comment, Long> {
}
