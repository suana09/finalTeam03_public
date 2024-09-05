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
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth/google")
public class AuthGoogleController {

    private final AuthService as;
    private final CustomSecurityConfig csc;
    private final MemberService ms;

    private static final String GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    private static final String GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";

    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    @Value("${google.redirect.uri}")
    private String redirectUri;

    @Autowired
    public AuthGoogleController(AuthService as, CustomSecurityConfig csc, MemberService ms) {
        this.as = as;
        this.csc = csc;
        this.ms = ms;
    }


    @GetMapping("/loginpage")
    public void googleLogin(HttpServletResponse response) throws IOException {
        String authUrl = GOOGLE_OAUTH_URL + "?client_id=" + clientId +
                "&redirect_uri=" + redirectUri +
                "&response_type=code" +
                "&scope=openid%20email%20profile";
        response.sendRedirect(authUrl);
    }

    @GetMapping("/login")
    public void googleCallback(HttpServletRequest request, HttpServletResponse response) throws IOException {
        PasswordEncoder pe = csc.passwordEncoder();
        String code = request.getParameter("code");
        String tokenResponse = getAccessToken(code);
        Map<String, String> tokenResponseMap = new Gson().fromJson(tokenResponse, HashMap.class);
        String accessToken = tokenResponseMap.get("access_token");

        String userInfoResponse = getUserInfo(accessToken);
        Map<String, Object> userInfo = new Gson().fromJson(userInfoResponse, HashMap.class);
        String email = (String) userInfo.get("email");
        String name = (String) userInfo.get("name");

        Member member = ms.getMemberByEmail(email);
        if (member == null) {
            member = new Member();
            member.setNickname(name);
            member.setEmail(email);
            member.setPwd("google");
            member.setProvider("google");
            ms.register(member);
        }

        HttpSession session = request.getSession();
        session.setAttribute("loginUser", member);

        String encodedEmail = URLEncoder.encode(member.getEmail(), StandardCharsets.UTF_8.toString());
        String redirectUrl = "https://matchive.site/googlesaveinfo/" + encodedEmail;
        response.sendRedirect(redirectUrl);
    }

    private String getAccessToken(String code) throws IOException {
        URL url = new URL(GOOGLE_TOKEN_URL);
        String bodyData = "grant_type=authorization_code&" +
                "client_id=" + clientId + "&" +
                "client_secret=" + clientSecret + "&" +
                "redirect_uri=" + redirectUri + "&" +
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
        URL url = new URL(GOOGLE_USERINFO_URL + "&access_token=" + accessToken);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");

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
