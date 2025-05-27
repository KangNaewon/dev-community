package com.letsgo.devcommunity.domain.member.service;

import com.letsgo.devcommunity.domain.member.dto.FollowMemberResponse;
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

import java.util.List;
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

    @Test
    @DisplayName("언팔로우 성공")
    void unfollow_Success() {
        // given
        Member me = TestDataFactory.createDefaultMember();
        Member unfollowTarget = TestDataFactory.createMember(
                "targetLoginId",
                "targetEmail@example.com",
                "encodedPassword",
                "targetNickname"
        );
        when(memberRepository.findById(me.getId())).thenReturn(Optional.of(me));
        when(memberRepository.findByLoginId(unfollowTarget.getLoginId())).thenReturn(Optional.of(unfollowTarget));
        Follow followRelationship = new Follow(me, unfollowTarget);
        when(followRepository.findByFromMemberAndToMember(me, unfollowTarget)).thenReturn(Optional.of(followRelationship));

        // when
        assertDoesNotThrow(() -> memberService.unfollow(unfollowTarget.getLoginId(), me.getId()));

        // then
        verify(memberRepository).findById(me.getId());
        verify(memberRepository).findByLoginId(unfollowTarget.getLoginId());
        verify(followRepository).findByFromMemberAndToMember(me, unfollowTarget);
        verify(followRepository).delete(followRelationship);
    }

    @Test
    @DisplayName("언팔로우 실패: 본인 조회 실패")
    void unfollow_Failure_CannotFindMe() {
        // given
        Member me = TestDataFactory.createDefaultMember();
        Member unfollowTarget = TestDataFactory.createMember(
                "targetLoginId",
                "targetEmail@example.com",
                "encodedPassword",
                "targetNickname"
        );
        when(memberRepository.findById(me.getId())).thenReturn(Optional.empty());

        // when
        IllegalArgumentException illegalArgumentException = assertThrows(
                IllegalArgumentException.class,
                () -> memberService.unfollow(unfollowTarget.getLoginId(), me.getId())
        );

        // then
        assertThat(illegalArgumentException.getMessage()).isEqualTo(ErrorMessage.CANNOT_FIND_ME.getMessage());
        verify(memberRepository).findById(me.getId());
        verify(memberRepository, never()).findByLoginId(unfollowTarget.getLoginId());
        verify(followRepository, never()).findByFromMemberAndToMember(me, unfollowTarget);
        verify(followRepository, never()).delete(any(Follow.class));
    }

    @Test
    @DisplayName("언팔로우 실패: 언팔로우 대상 조회 실패")
    void unfollow_Failure_CannotFindUnfollowTarget() {
        // given
        Member me = TestDataFactory.createDefaultMember();
        Member unfollowTarget = TestDataFactory.createMember(
                "targetLoginId",
                "targetEmail@example.com",
                "encodedPassword",
                "targetNickname"
        );
        when(memberRepository.findById(me.getId())).thenReturn(Optional.of(me));
        when(memberRepository.findByLoginId(unfollowTarget.getLoginId())).thenReturn(Optional.empty());

        // when
        IllegalArgumentException illegalArgumentException = assertThrows(
                IllegalArgumentException.class,
                () -> memberService.unfollow(unfollowTarget.getLoginId(), me.getId())
        );

        // then
        assertThat(illegalArgumentException.getMessage()).isEqualTo(ErrorMessage.CANNOT_FIND_UNFOLLOW_TARGET.getMessage());
        verify(memberRepository).findById(me.getId());
        verify(memberRepository).findByLoginId(unfollowTarget.getLoginId());
        verify(followRepository, never()).findByFromMemberAndToMember(me, unfollowTarget);
        verify(followRepository, never()).delete(any(Follow.class));
    }

    @Test
    @DisplayName("언팔로우 실패: 팔로우 관계 없음")
    void unfollow_Failure_CannotFindFollowRelationship() {
        // given
        Member me = TestDataFactory.createDefaultMember();
        Member unfollowTarget = TestDataFactory.createMember(
                "targetLoginId",
                "targetEmail@example.com",
                "encodedPassword",
                "targetNickname"
        );
        when(memberRepository.findById(me.getId())).thenReturn(Optional.of(me));
        when(memberRepository.findByLoginId(unfollowTarget.getLoginId())).thenReturn(Optional.of(unfollowTarget));
        when(followRepository.findByFromMemberAndToMember(me, unfollowTarget)).thenReturn(Optional.empty());

        // when
        IllegalStateException illegalStateException = assertThrows(
                IllegalStateException.class,
                () -> memberService.unfollow(unfollowTarget.getLoginId(), me.getId())
        );

        // then
        assertThat(illegalStateException.getMessage()).isEqualTo(ErrorMessage.CANNOT_FIND_FOLLOW_RELATIONSHIP.getMessage());
        verify(memberRepository).findById(me.getId());
        verify(memberRepository).findByLoginId(unfollowTarget.getLoginId());
        verify(followRepository).findByFromMemberAndToMember(me, unfollowTarget);
        verify(followRepository, never()).delete(any(Follow.class));
    }

    @Test
    @DisplayName("팔로워 목록 조회 성공")
    void getFollowers_Success() {
        // given
        Member me = TestDataFactory.createDefaultMember();
        Member follower1 = TestDataFactory.createMember(
                "followerId1",
                "followerEmail1@example.com",
                "encodedPassword1",
                "follower1Nickname"
        );
        Member follower2 = TestDataFactory.createMember(
                "followerId2",
                "followerEmail2@example.com",
                "encodedPassword2",
                "follower2Nickname"
        );
        Follow follow1 = new Follow(follower1, me);
        Follow follow2 = new Follow(follower2, me);

        when(memberRepository.findByLoginId(me.getLoginId())).thenReturn(Optional.of(me));
        when(followRepository.findAllByToMember(me)).thenReturn(List.of(follow1, follow2));

        // when
        List<FollowMemberResponse> followers = memberService.getFollowers(me.getLoginId());

        // then
        verify(memberRepository).findByLoginId(me.getLoginId());
        verify(followRepository).findAllByToMember(me);
        assertThat(followers).hasSize(2);
        assertThat(followers.get(0).loginId()).isEqualTo(follower1.getLoginId());
        assertThat(followers.get(1).loginId()).isEqualTo(follower2.getLoginId());
        assertThat(followers.get(0).nickname()).isEqualTo(follower1.getNickname());
        assertThat(followers.get(1).nickname()).isEqualTo(follower2.getNickname());
    }

    @Test
    @DisplayName("팔로우 목록 조회 실패: 본인 조회 실패")
    void getFollowers_Failure_CannotFindMe() {
        // given
        Member me = TestDataFactory.createDefaultMember();
        when(memberRepository.findByLoginId(me.getLoginId())).thenReturn(Optional.empty());

        // when
        IllegalArgumentException illegalArgumentException = assertThrows(
                IllegalArgumentException.class,
                () -> memberService.getFollowers(me.getLoginId())
        );

        // then
        assertThat(illegalArgumentException.getMessage()).isEqualTo(ErrorMessage.CANNOT_FIND_ME.getMessage());
        verify(memberRepository).findByLoginId(me.getLoginId());
        verify(followRepository, never()).findAllByToMember(me);
    }

    @Test
    @DisplayName("팔로잉 목록 조회 성공")
    void getFollowings_Success() {
        // given
        Member me = TestDataFactory.createDefaultMember();
        Member following1 = TestDataFactory.createMember(
                "followingId1",
                "followingEmail1@example.com",
                "encodedPassword1",
                "following1Nickname"
        );
        Member following2 = TestDataFactory.createMember(
                "followingId2",
                "followingEmail2@example.com",
                "encodedPassword2",
                "following2Nickname"
        );
        Follow follow1 = new Follow(me, following1);
        Follow follow2 = new Follow(me, following2);

        when(memberRepository.findByLoginId(me.getLoginId())).thenReturn(Optional.of(me));
        when(followRepository.findAllByFromMember(me)).thenReturn(List.of(follow1, follow2));

        // when
        List<FollowMemberResponse> followings = memberService.getFollowings(me.getLoginId());

        // then
        verify(memberRepository).findByLoginId(me.getLoginId());
        verify(followRepository).findAllByFromMember(me);
        assertThat(followings).hasSize(2);
        assertThat(followings.get(0).loginId()).isEqualTo(following1.getLoginId());
        assertThat(followings.get(1).loginId()).isEqualTo(following2.getLoginId());
        assertThat(followings.get(0).nickname()).isEqualTo(following1.getNickname());
        assertThat(followings.get(1).nickname()).isEqualTo(following2.getNickname());
    }

    @Test
    @DisplayName("팔로잉 목록 조회 실패: 본인 조회 실패")
    void getFollowings_Failure_CannotFindMe() {
        // given
        Member me = TestDataFactory.createDefaultMember();
        when(memberRepository.findByLoginId(me.getLoginId())).thenReturn(Optional.empty());

        // when
        IllegalArgumentException illegalArgumentException = assertThrows(
                IllegalArgumentException.class,
                () -> memberService.getFollowings(me.getLoginId())
        );

        // then
        assertThat(illegalArgumentException.getMessage()).isEqualTo(ErrorMessage.CANNOT_FIND_ME.getMessage());
        verify(memberRepository).findByLoginId(me.getLoginId());
        verify(followRepository, never()).findAllByFromMember(me);
    }
}

class TestDataFactory {

    static Member createDefaultMember() {
        return new Member("defaultLoginId", "defaultEmail@example.com", "encodedPassword", "defaultNickname", null);
    }

    static Member createMember(String loginId, String email, String password, String nickname) {
        return new Member(loginId, email, password, nickname, null);
    }
}