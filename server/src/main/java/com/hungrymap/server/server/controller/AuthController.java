package com.hungrymap.server.server.controller;
import com.google.gson.Gson;
import com.hungrymap.server.server.dto.KakaoProfile;
import com.hungrymap.server.server.dto.OAuthToken;
import com.hungrymap.server.server.entity.Member;
import com.hungrymap.server.server.security.CustomSecurityConfig;
import com.hungrymap.server.server.service.AuthService;
import com.hungrymap.server.server.service.MemberService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService as;
    private final CustomSecurityConfig csc;
    private final MemberService ms;

    @Autowired
    public AuthController(AuthService as, CustomSecurityConfig csc, MemberService ms) {
        this.as = as;
        this.csc = csc;
        this.ms = ms;
    }



    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Member member, HttpServletResponse res) {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> serviceResult = as.login(member);

        if (serviceResult.get("error") != null){
            result.put("error", serviceResult.get("error"));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

        result.put("accessToken", serviceResult.get("accessToken"));
        String refreshToken = serviceResult.get("refreshToken").toString();
        result.put("user", serviceResult.get("user"));

        if (refreshToken != null) {
            Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(60 * 60 * 24);

            res.addCookie(refreshTokenCookie);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest req, HttpServletResponse res) {
        Map<String, Object> result = new HashMap<>();
        HttpSession session = req.getSession(false);

        if (session != null) {
            String accessToken = (String) session.getAttribute("accessToken");
            if (accessToken != null) {
                session.invalidate();
            }
        }

        // 모든 쿠키 가져오기
        Cookie[] cookies = req.getCookies();

        // 모든 쿠키 삭제
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                cookie.setMaxAge(0); // 쿠키의 만료 시간을 0으로 설정하여 삭제
                cookie.setPath("/"); // 모든 경로에서 쿠키 삭제
                res.addCookie(cookie); // 응답에 쿠키 추가하여 삭제
            }
        }

        SecurityContextHolder.getContext().setAuthentication(null);

        result.put("message", "Logged out successfully");
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @PostMapping("/admin/login")
    public ResponseEntity<Map<String, Object>> adminLogin(@RequestBody Member member, HttpServletResponse res) {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> serviceResult = as.adminLogin(member);

        if (serviceResult.get("error") != null){
            result.put("error", serviceResult.get("error"));
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

        result.put("accessToken", serviceResult.get("accessToken"));
        String refreshToken = serviceResult.get("refreshToken").toString();
        result.put("user", serviceResult.get("user"));

        if (refreshToken != null) {
            Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(60 * 60 * 24);

            res.addCookie(refreshTokenCookie);
        }
        return ResponseEntity.ok(result);
    }







}
