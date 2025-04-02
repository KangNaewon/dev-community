package com.letsgo.devcommunity.post.repository;

import com.letsgo.devcommunity.post.entity.PostStar;
import jakarta.transaction.Transactional;
import org.hibernate.sql.ast.tree.expression.Star;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@Transactional
public interface StarRepository extends JpaRepository<PostStar, Long> {
    Optional<Star> findByPostIdAndUserId(Long postId, Long userId);
    void deleteByPostIdAndUserId(Long postId, Long userId);
}
