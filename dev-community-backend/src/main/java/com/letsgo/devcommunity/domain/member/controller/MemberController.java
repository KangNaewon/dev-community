package com.letsgo.devcommunity.domain.member.controller;

import com.letsgo.devcommunity.domain.member.dto.FollowMemberResponse;
import com.letsgo.devcommunity.domain.member.dto.MemberProfileResponse;
import com.letsgo.devcommunity.domain.member.dto.NicknameUpdateRequestDto;
import com.letsgo.devcommunity.domain.member.dto.PasswordUpdateRequestDto;
import com.letsgo.devcommunity.domain.member.entity.Member;
import com.letsgo.devcommunity.domain.member.service.MemberService;
import com.letsgo.devcommunity.global.util.SessionUtils;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/{loginId}")
    public MemberProfileResponse getProfile(@PathVariable String loginId) {
        return memberService.getProfile(loginId);
    }

    @PostMapping("/{loginId}/follow")
    public void follow(@PathVariable String loginId, HttpSession session) {
        Member currentMember = SessionUtils.getLoginMember(session);
        memberService.follow(loginId, currentMember.getId());
    }

    @DeleteMapping("/{loginId}/follow")
    public void unfollow(@PathVariable String loginId, HttpSession session) {
        Member currentMember = SessionUtils.getLoginMember(session);
        memberService.unfollow(loginId, currentMember.getId());
    }

    @GetMapping("/{loginId}/followers")
    public List<FollowMemberResponse> getFollowers(@PathVariable String loginId) {
        return memberService.getFollowers(loginId);
    }

    @GetMapping("/{loginId}/followings")
    public List<FollowMemberResponse> getFollowings(@PathVariable String loginId) {
        return memberService.getFollowings(loginId);
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> updatePassword(@RequestBody PasswordUpdateRequestDto passwordUpdateRequestDto, HttpSession session) {
        Member currentMember = SessionUtils.getLoginMember(session);
        if (currentMember == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }
        memberService.updatePassword(currentMember.getId(), passwordUpdateRequestDto);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me/nickname")
    public ResponseEntity<Void> updateNickname(@RequestBody NicknameUpdateRequestDto nicknameUpdateRequestDto, HttpSession session) {
        Member currentMember = SessionUtils.getLoginMember(session);
        if (currentMember == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }
        memberService.updateNickname(currentMember.getId(), nicknameUpdateRequestDto);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{loginId}/profile-image")
    public ResponseEntity<String> updateProfileImage(@PathVariable String loginId,
                                                     @RequestParam("file")MultipartFile file) throws IOException {
        String imageUrl = memberService.updateProfileImage(loginId, file);
        return ResponseEntity.ok(imageUrl);
    }

    @DeleteMapping("/{loginId}/profile-image")
    public ResponseEntity<Void> deleteProfileImage(@PathVariable String loginId) throws IOException {
        memberService.deleteProfileImage(loginId);
        return ResponseEntity.noContent().build();
    }
}
