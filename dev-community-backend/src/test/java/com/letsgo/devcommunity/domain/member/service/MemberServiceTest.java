package com.letsgo.devcommunity.domain.member.service;

import com.letsgo.devcommunity.domain.member.entity.Follow;
import com.letsgo.devcommunity.domain.member.entity.Member;
import com.letsgo.devcommunity.domain.member.repository.FollowRepository;
import com.letsgo.devcommunity.domain.member.repository.MemberRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private FollowRepository followRepository;

    @InjectMocks
    private MemberService memberService;

    enum ErrorMessage {
        NOT_FOUND_MEMBER("존재하지 않는 사용자입니다."),
        CANNOT_FIND_ME("로그인한 회원을 찾을 수 없습니다."),
        CANNOT_FIND_FOLLOW_TARGET("팔로우 대상 회원을 찾을 수 없습니다."),
        CANNOT_FIND_UNFOLLOW_TARGET("언팔로우 대상 회원을 찾을 수 없습니다."),
        ALREADY_FOLLOWING("이미 팔로우한 사용자입니다."),
        CANNOT_FIND_FOLLOW_RELATIONSHIP("팔로우 관계가 존재하지 않습니다.");

        private final String message;

        ErrorMessage(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

//    @Test
//    @DisplayName("프로필 조회 성공")
//    void getProfile_Success() {
//    }
//    void getProfile_Failure_NotFoundMember() {}

    @Test
    @DisplayName("팔로우 성공")
    void follow_Success() {
        // given
        Member me = TestDataFactory.createDefaultMember();
        Member followTarget = TestDataFactory.createMember(
                "targetLoginId",
                "targetEmail@example.com",
                "encodedPassword",
                "targetNickname"
        );
        when(memberRepository.findById(me.getId())).thenReturn(Optional.of(me));
        when(memberRepository.findByLoginId(followTarget.getLoginId())).thenReturn(Optional.of(followTarget));
        when(followRepository.existsByFromMemberAndToMember(me, followTarget)).thenReturn(false);

        // when
        assertDoesNotThrow(() -> memberService.follow(followTarget.getLoginId(), me.getId()));

        // then
        verify(memberRepository).findById(me.getId());
        verify(memberRepository).findByLoginId(followTarget.getLoginId());
        verify(followRepository).existsByFromMemberAndToMember(me, followTarget);

        ArgumentCaptor<Follow> followCaptor = ArgumentCaptor.forClass(Follow.class);
        verify(followRepository).save(followCaptor.capture());

        Follow capturedFollow = followCaptor.getValue();
        assertThat(capturedFollow.getFromMember()).isEqualTo(me);
        assertThat(capturedFollow.getToMember()).isEqualTo(followTarget);
    }

    @Test
    @DisplayName("팔로우 실패: 본인 조회 실패")
    void follow_Failure_CannotFindMe() {
        // given
        Member me = TestDataFactory.createDefaultMember();
        Member followTarget = TestDataFactory.createMember(
                "targetLoginId",
                "targetEmail@example.com",
                "encodedPassword",
                "targetNickname"
        );
        when(memberRepository.findById(me.getId())).thenReturn(Optional.empty());

        // when
        IllegalArgumentException illegalArgumentException = assertThrows(
                IllegalArgumentException.class,
                () -> memberService.follow(followTarget.getLoginId(), me.getId())
        );

        // then
        assertThat(illegalArgumentException.getMessage()).isEqualTo(ErrorMessage.CANNOT_FIND_ME.getMessage());
        verify(memberRepository).findById(me.getId());
        verify(memberRepository, never()).findByLoginId(followTarget.getLoginId());
        verify(followRepository, never()).existsByFromMemberAndToMember(me, followTarget);
        verify(followRepository, never()).save(any(Follow.class));
    }

    @Test
    @DisplayName("팔로우 실패: 팔로우 대상 조회 실패")
    void follow_Failure_CannotFindFollowTarget() {
        // given
        Member me = TestDataFactory.createDefaultMember();
        Member followTarget = TestDataFactory.createMember(
                "targetLoginId",
                "targetEmail@example.com",
                "encodedPassword",
                "targetNickname"
        );
        when(memberRepository.findById(me.getId())).thenReturn(Optional.of(me));
        when(memberRepository.findByLoginId(followTarget.getLoginId())).thenReturn(Optional.empty());

        // when
        IllegalArgumentException illegalArgumentException = assertThrows(
                IllegalArgumentException.class,
                () -> memberService.follow(followTarget.getLoginId(), me.getId())
        );

        // then
        assertThat(illegalArgumentException.getMessage()).isEqualTo(ErrorMessage.CANNOT_FIND_FOLLOW_TARGET.getMessage());
        verify(memberRepository).findById(me.getId());
        verify(memberRepository).findByLoginId(followTarget.getLoginId());
        verify(followRepository, never()).existsByFromMemberAndToMember(me, followTarget);
        verify(followRepository, never()).save(any(Follow.class));
    }

    @Test
    @DisplayName("팔로우 실패: 이미 팔로우 중")
    void follow_Failure_AlreadyFollowing() {
        // given
        Member me = TestDataFactory.createDefaultMember();
        Member followTarget = TestDataFactory.createMember(
                "targetLoginId",
                "targetEmail@example.com",
                "encodedPassword",
                "targetNickname"
        );
        when(memberRepository.findById(me.getId())).thenReturn(Optional.of(me));
        when(memberRepository.findByLoginId(followTarget.getLoginId())).thenReturn(Optional.of(followTarget));
        when(followRepository.existsByFromMemberAndToMember(me, followTarget)).thenReturn(true);

        // when
        IllegalStateException illegalStateException = assertThrows(
                IllegalStateException.class,
                () -> memberService.follow(followTarget.getLoginId(), me.getId())
        );

        // then
        assertThat(illegalStateException.getMessage()).isEqualTo(ErrorMessage.ALREADY_FOLLOWING.getMessage());
        verify(memberRepository).findById(me.getId());
        verify(memberRepository).findByLoginId(followTarget.getLoginId());
        verify(followRepository).existsByFromMemberAndToMember(me, followTarget);
        verify(followRepository, never()).save(any(Follow.class));
    }

    void unfollow_Success() {}
    void unfollow_Failure_CannotFindMe() {}
    void unfollow_Failure_CannotFindUnfollowTarget() {}
    void unfollow_Failure_CannotFindFollowRelationship() {}

    void getFollowers_Success() {}
    void getFollowers_Failure_CannotFindMe() {}

    void getFollowings_Success() {}
    void getFollowings_Failure_CannotFindMe() {}
}

class TestDataFactory {

    static Member createDefaultMember() {
        return new Member("defaultLoginId", "defaultEmail@example.com", "encodedPassword", "defaultNickname", null);
    }

    static Member createMember(String loginId, String email, String password, String nickname) {
        return new Member(loginId, email, password, nickname, null);
    }
}