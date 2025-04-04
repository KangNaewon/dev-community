package com.letsgo.devcommunity.domain.member.controller;

import com.letsgo.devcommunity.domain.member.dto.LoginRequest;
import com.letsgo.devcommunity.domain.member.dto.MemberInfoResponse;
import com.letsgo.devcommunity.domain.member.dto.SignUpRequest;
import com.letsgo.devcommunity.domain.member.entity.Member;
import com.letsgo.devcommunity.domain.member.service.MemberService;
import com.letsgo.devcommunity.global.util.SessionUtils;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<Void> signUp(@RequestBody SignUpRequest request) {
        memberService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<MemberInfoResponse> login(@RequestBody LoginRequest request, HttpSession session) {
        Member member = memberService.login(request);
        SessionUtils.setLoginMember(session, member);

        return ResponseEntity.ok(new MemberInfoResponse(member));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        SessionUtils.logout(session);
        return ResponseEntity.noContent().build();  // 204 No Content
    }


}
