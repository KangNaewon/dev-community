package com.letsgo.devcommunity.domain.member.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

public record SignUpRequest(
        @JsonProperty("id") String loginId,
        @JsonProperty("email") String email,
        @JsonProperty("password") String password,
        @JsonProperty("nickname") String nickname
) {}
