package com.letsgo.devcommunity.domain.member.repository;

import com.letsgo.devcommunity.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findById(Long id);
    Optional<Member> findByLoginId(String loginId);
}
