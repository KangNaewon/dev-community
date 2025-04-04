package com.letsgo.devcommunity.domain.post.repository;

import com.letsgo.devcommunity.domain.post.entity.Post;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface PostRepository extends JpaRepository<Post, Long> {
}
