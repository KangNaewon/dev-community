package com.letsgo.devcommunity.domain.member.dto;

public record VerifyCodeRequest(String email, String code) {
}
