package com.hungrymap.server.server.controller;

import com.google.gson.Gson;
import com.hungrymap.server.server.dto.KakaoProfile;
import com.hungrymap.server.server.dto.OAuthToken;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/auth/kakao")
public class AuthKakaoController {
    private final AuthService as;
    private final CustomSecurityConfig csc;
    private final MemberService ms;

    @Value("${kakao.client_id}")
    private String client_id;
    @Value("${kakao.redirect_uri}")
    private String redirect_uri;

    @Autowired
    public AuthKakaoController(AuthService as, CustomSecurityConfig csc, MemberService ms) {
        this.as = as;
        this.csc = csc;
        this.ms = ms;
    }

    @RequestMapping("/loginpage")
    public String kakao() {
        String a = "<script type='text/javascript'>"
                + "location.href='https://kauth.kakao.com/oauth/authorize?"
                + "client_id=" + client_id + "&"
                + "redirect_uri=" + redirect_uri + "&"
                + "response_type=code';" + "</script>";
        return a;
    }

    @RequestMapping("/login")
    public void kakaoLogin(
            HttpServletRequest request,
            HttpServletResponse response)
            throws UnsupportedEncodingException, IOException {

        PasswordEncoder pe = csc.passwordEncoder();

        String code = request.getParameter("code");
        String endpoint = "https://kauth.kakao.com/oauth/token";
        URL url = new URL(endpoint);
        String bodyData = "grant_type=authorization_code&";
        bodyData += "client_id=" + client_id + "&";
        bodyData += "redirect_uri=" + redirect_uri + "&";
        bodyData += "code=" + code;

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        conn.setDoOutput(true);
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
        bw.write(bodyData);
        bw.flush();
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        String input = "";
        StringBuilder sb = new StringBuilder();
        while ((input = br.readLine()) != null) {
            sb.append(input);
        }
        Gson gson = new Gson();
        OAuthToken oAuthToken = gson.fromJson(sb.toString(), OAuthToken.class);
        String endpoint2 = "https://kapi.kakao.com/v2/user/me";
        URL url2 = new URL(endpoint2);

        HttpsURLConnection conn2 = (HttpsURLConnection) url2.openConnection();
        conn2.setRequestProperty("Authorization", "Bearer " + oAuthToken.getAccess_token());
        conn2.setDoOutput(true);
        BufferedReader br2 = new BufferedReader(new InputStreamReader(conn2.getInputStream(), "UTF-8"));
        String input2 = "";
        StringBuilder sb2 = new StringBuilder();
        while ((input2 = br2.readLine()) != null) {
            sb2.append(input2);
        }

        Gson gson2 = new Gson();
        KakaoProfile kakaoProfile = gson2.fromJson(sb2.toString(), KakaoProfile.class);
        KakaoProfile.KakaoAccount ac = kakaoProfile.getAccount();
        KakaoProfile.KakaoAccount.Profile pf = ac.getProfile();


        Member member = (Member) ms.getMemberByEmail( kakaoProfile.getId() );
        if( member == null) {
            member = new Member();
            member.setNickname( pf.getNickname() );
            member.setEmail(ac.getEmail());
            member.setPwd("kakao");
            member.setProvider( "kakao" );
            ms.register(member);
        }
        HttpSession session = request.getSession();
        session.setAttribute("loginUser", member);

        String encodedEmail = URLEncoder.encode(member.getEmail(), StandardCharsets.UTF_8.toString());
        String redirectUrl = "https://matchive.site/kakaosaveinfo/"+encodedEmail;
        response.sendRedirect(redirectUrl);
    }

}
