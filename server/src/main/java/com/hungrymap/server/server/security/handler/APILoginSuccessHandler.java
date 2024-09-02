package com.hungrymap.server.server.security.handler;

import com.google.gson.Gson;
import com.hungrymap.server.server.dto.MemberDTO;
import com.hungrymap.server.server.security.util.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Log4j2
public class APILoginSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
//        // getClaims() : 사용자 정보가 담긴 Map을 호출하고, JWT 데이터를 추가하여 클라이언트로 전송
//        // authentication 에는 로그인에 성공한 사용자정보DTO가 담겨있고, getPrincipal로 추출
//        MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();
//        Map<String, Object> claims = memberDTO.getClaims();
//
//        // 액세스 토큰 + 리프레시 토큰 생성
//        String accessToken = JWTUtil.generateToken(claims, 1);
//        String refreshToken = JWTUtil.generateToken(claims, 60 * 24);
//
//        claims.put("accessToken", accessToken);
//        claims.put("refreshToken", refreshToken);
//
//        Gson gson = new Gson();
//        String jsonStr = gson.toJson(claims);
//        log.info("jsonStr{}", jsonStr);
//        response.setContentType("application/json");
//
//        response.setCharacterEncoding("UTF-8");
//        PrintWriter out = response.getWriter();
//        out.print(jsonStr);
//        out.close();
    }
}
