package com.hungrymap.server.server.controller;

import com.google.gson.Gson;
import com.hungrymap.server.server.entity.Member;
import com.hungrymap.server.server.security.CustomSecurityConfig;
import com.hungrymap.server.server.service.AuthService;
import com.hungrymap.server.server.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth/naver")
public class AuthNaverController {
    private final AuthService as;
    private final CustomSecurityConfig csc;
    private final MemberService ms;

    @Value("${naver.client.id}")
    private String naverClientId;

    @Value("${naver.client.secret}")
    private String naverClientSecret;

    @Value("${naver.redirect.uri}")
    private String naverRedirectUri;

    private static final String NAVER_OAUTH_URL = "https://nid.naver.com/oauth2.0/authorize";
    private static final String NAVER_TOKEN_URL = "https://nid.naver.com/oauth2.0/token";
    private static final String NAVER_USERINFO_URL = "https://openapi.naver.com/v1/nid/me";

    @Autowired
    public AuthNaverController(AuthService as, CustomSecurityConfig csc, MemberService ms) {
        this.as = as;
        this.csc = csc;
        this.ms = ms;
    }

    @GetMapping("/loginpage")
    public void naverLogin(HttpServletResponse response) throws IOException {
        String authUrl = NAVER_OAUTH_URL + "?response_type=code" +
                "&client_id=" + naverClientId +
                "&redirect_uri=" + naverRedirectUri;
        response.sendRedirect(authUrl);
    }

    @GetMapping("/login")
    public void naverCallback(@RequestParam("code") String code,
                              HttpServletRequest request,
                              HttpServletResponse response) throws IOException {
        String tokenResponse = getNaverAccessToken(code);
        Map<String, String> tokenResponseMap = new Gson().fromJson(tokenResponse, HashMap.class);
        String accessToken = tokenResponseMap.get("access_token");

        String userInfoResponse = getUserInfo(accessToken);
        Map<String, Object> userInfo = new Gson().fromJson(userInfoResponse, HashMap.class);
        Map<String, Object> responseData = (Map<String, Object>) userInfo.get("response");
        String email = (String) responseData.get("email");
        String name = (String) responseData.get("name");

        PasswordEncoder pe = csc.passwordEncoder();

        Member member = ms.getMemberByEmail(email);
        if (member == null) {
            member = new Member();
            member.setNickname(name);
            member.setEmail(email);
            member.setPwd("naver"); // 암호화 처리
            member.setProvider("naver");
            ms.register(member);
        }

        HttpSession session = request.getSession();
        session.setAttribute("loginUser", member);

        String encodedEmail = URLEncoder.encode(member.getEmail(), StandardCharsets.UTF_8.toString());
        String redirectUrl = "http://localhost:3000/naversaveinfo/" + encodedEmail;
        response.sendRedirect(redirectUrl);
    }

    private String getNaverAccessToken(String code) throws IOException {
        URL url = new URL(NAVER_TOKEN_URL);
        String bodyData = "grant_type=authorization_code&" +
                "client_id=" + naverClientId + "&" +
                "client_secret=" + naverClientSecret + "&" +
                "redirect_uri=" + naverRedirectUri + "&" +
                "code=" + code;

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        conn.setDoOutput(true);

        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
        bw.write(bodyData);
        bw.flush();
        bw.close();

        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        StringBuilder sb = new StringBuilder();
        String input;
        while ((input = br.readLine()) != null) {
            sb.append(input);
        }
        br.close();
        return sb.toString();
    }

    private String getUserInfo(String accessToken) throws IOException {
        URL url = new URL(NAVER_USERINFO_URL);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Authorization", "Bearer " + accessToken);

        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        StringBuilder sb = new StringBuilder();
        String input;
        while ((input = br.readLine()) != null) {
            sb.append(input);
        }
        br.close();
        return sb.toString();
    }
}
