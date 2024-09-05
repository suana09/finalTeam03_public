package com.hungrymap.server.server.security.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import com.hungrymap.server.server.entity.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.google.gson.Gson;
import com.hungrymap.server.server.dto.MemberDTO;
import com.hungrymap.server.server.dto.MemberDetails;
import com.hungrymap.server.server.security.util.CustomJWTException;
import com.hungrymap.server.server.security.util.JWTUtil;
import com.hungrymap.server.server.service.MemberService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class JWTAuthFilter extends OncePerRequestFilter {

    @Autowired
    private MemberService ms;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeaderStr = request.getHeader("Authorization");

        System.out.println("authHeaderStr = " + authHeaderStr);
        String refreshToken = getRefreshToken(request);

        try {
            String accessToken = authHeaderStr.substring(7);
            Map<String, Object> claims = JWTUtil.validateToken(accessToken);
            log.info("JWT claims: " + claims);

            String email = (String) claims.get("username");
            Member member = ms.getMemberByEmail(email);
            MemberDetails memberDetails = new MemberDetails(member);

            UsernamePasswordAuthenticationToken authenticationToken
                    = new UsernamePasswordAuthenticationToken(memberDetails, null , memberDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            filterChain.doFilter(request, response);
        } catch(Exception e){
            System.out.println("JWTAuthFilter Error: " + e);
            if (e.getMessage().equals("Expired")) {
                if (refreshToken != null){
                    try {
                        System.out.println("refreshToken = " + refreshToken);
                        Map<String, Object> claims = JWTUtil.validateToken(refreshToken);

                        String email = (String) claims.get("username");
                        List<String> roleNames = (List<String>) claims.get("roles");

                        List<String> formattedRoleNames = roleNames.stream().map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role).toList();

                        Member member = ms.getMemberByEmail(email);
                        MemberDetails memberDetails = new MemberDetails(member);


                        MemberDTO memberDTO = new MemberDTO(email, "", "", "", formattedRoleNames);

                        String newAccessToken = JWTUtil.createToken(memberDTO, 5);
                        response.setHeader("Authorization", "Bearer " + newAccessToken);
                        System.out.println("newAccessToken = " + newAccessToken);

                        UsernamePasswordAuthenticationToken authenticationToken
                                = new UsernamePasswordAuthenticationToken(memberDetails, null , memberDetails.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                        filterChain.doFilter(request, response);
                    } catch (CustomJWTException ex) {
                        log.error("refreshToken : validateToken 에러발생?");
                        log.error("CustomJWTException: {}", ex.getMessage(), ex);
                        throw new RuntimeException(ex);
                    }
                } else {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "refresh token not found");
                }
            } else {
                log.error("JWT Auth Error");
                log.error("message : " + e.getMessage());
                Gson gson = new Gson();
                String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));
                response.setContentType("application/json");
                PrintWriter printWriter = response.getWriter();
                printWriter.println(msg);
                printWriter.close();
            }
        }
    }

    private String getRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null){
            System.out.println("cookies is null");
        }
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }


    // 필터하지 않겠다 = 인증/인가를 거치지 않겠다
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        log.info("check uri....... " + path);

        String[] excludedPaths = {
                "/auth/login",
                "/member/register",
                "/auth/kakao",
                "/auth/google",
                "/auth/naver",
                "/auth/admin/login",
                "/images",
                "/place/search",
                "/member/validation/email",
                "/mail",
                "/placelist", //임시
                "/map",
                "/placelist/popular",
                "/place",
                "/review",
                "/member/reactivate",
                "/member/pwd",
                "/coupon"
        };

        // OPTIONS 메소드 예외 처리
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        // 경로 예외 처리
        for (String excludedPath : excludedPaths) {
            if (path.startsWith(excludedPath)) {
                log.info("Skipping filter for excluded path: " + excludedPath);
                return true;
            }
        }

        log.info("not skipping checked uri : "+path);
        return false;
    }

}
