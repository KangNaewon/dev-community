package com.letsgo.devcommunity.domain.auth.service;

import com.letsgo.devcommunity.domain.auth.dto.LoginRequest;
import com.letsgo.devcommunity.domain.auth.dto.SignUpRequest;
import com.letsgo.devcommunity.domain.auth.email.EmailVerificationStore;
import com.letsgo.devcommunity.domain.auth.repository.AuthRepository;
import com.letsgo.devcommunity.domain.member.entity.Member;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthRepository authRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailVerificationStore emailVerificationStore;

    @InjectMocks
    private AuthService authService;

    private SignUpRequest signUpRequest;
    private LoginRequest loginRequest;
    private Member member;

    @BeforeEach
    void setUp() {
        signUpRequest = new SignUpRequest("loginId", "email", "password", "nickname");
        loginRequest = new LoginRequest("loginId", "password");
        member = new Member(
                "loginId",
                "email",
                "password",
                "nickname",
                null
        );
    }

    @Test
    @DisplayName("회원가입 성공")
    void signUp_Success() {
        // given
        when(emailVerificationStore.isVerified("email")).thenReturn(true);
        when(authRepository.existsByLoginId("loginId")).thenReturn(false);
        when(authRepository.existsByEmail("email")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");

        // when
        assertDoesNotThrow(() -> authService.signUp(signUpRequest));

        // then
        verify(emailVerificationStore).isVerified(signUpRequest.email());
        verify(authRepository).existsByLoginId(signUpRequest.loginId());
        verify(authRepository).existsByEmail(signUpRequest.email());
        verify(passwordEncoder).encode(signUpRequest.password());

        ArgumentCaptor<Member> memberCaptor = ArgumentCaptor.forClass(Member.class);
        verify(authRepository).save(memberCaptor.capture());

        Member capturedMember = memberCaptor.getValue();
        assertThat(capturedMember.getLoginId()).isEqualTo("loginId");
        assertThat(capturedMember.getEmail()).isEqualTo("email");
        assertThat(capturedMember.getPassword()).isEqualTo("encodedPassword");
        assertThat(capturedMember.getNickname()).isEqualTo("nickname");
        assertThat(capturedMember.getProfileImageUrl()).isNull();
    }

    @Test
    @DisplayName("회원가입 실패: 이메일 인증 미완료")
    void signUp_Failure_EmailNotVerified() {
        // given
        when(emailVerificationStore.isVerified("email")).thenReturn(false);

        // when
        IllegalArgumentException illegalArgumentException = assertThrows(
                IllegalArgumentException.class,
                () -> authService.signUp(signUpRequest)
        );

        // then
        assertThat(illegalArgumentException.getMessage()).isEqualTo("이메일 인증이 완료되지 않았습니다.");
        verify(emailVerificationStore).isVerified(signUpRequest.email());
        verify(authRepository, never()).save(any(Member.class));
    }

    @Test
    @DisplayName("회원가입 실패: 아이디 중복")
    void signUp_Failure_DuplicateLoginId() {
        // given
        when(emailVerificationStore.isVerified("email")).thenReturn(true);
        when(authRepository.existsByLoginId("loginId")).thenReturn(true);

        // when
        IllegalArgumentException illegalArgumentException = assertThrows(
                IllegalArgumentException.class,
                () -> authService.signUp(signUpRequest)
        );

        // then
        assertThat(illegalArgumentException.getMessage()).isEqualTo("이미 사용 중인 ID 입니다.");
        verify(emailVerificationStore).isVerified(signUpRequest.email());
        verify(authRepository).existsByLoginId(signUpRequest.loginId());
        verify(authRepository, never()).save(any(Member.class));
    }

    @Test
    @DisplayName("회원가입 실패: 이메일 중복")
    void signUp_Failure_DuplicateEmail() {
        // given
        when(emailVerificationStore.isVerified("email")).thenReturn(true);
        when(authRepository.existsByLoginId("loginId")).thenReturn(false);
        when(authRepository.existsByEmail("email")).thenReturn(true);

        // when
        IllegalArgumentException illegalArgumentException = assertThrows(
                IllegalArgumentException.class,
                () -> authService.signUp(signUpRequest)
        );

        // then
        assertThat(illegalArgumentException.getMessage()).isEqualTo("이미 가입된 이메일입니다.");
        verify(emailVerificationStore).isVerified(signUpRequest.email());
        verify(authRepository).existsByLoginId(signUpRequest.loginId());
        verify(authRepository).existsByEmail(signUpRequest.email());
        verify(authRepository, never()).save(any(Member.class));
    }

}