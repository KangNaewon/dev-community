package com.letsgo.devcommunity.domain.member.dto;

import lombok.Getter;

public record SignUpRequest(
        String loginId,
        String email,
        String password,
        String nickname
) {}
