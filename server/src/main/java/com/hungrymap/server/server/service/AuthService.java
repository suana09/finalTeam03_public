package com.hungrymap.server.server.service;

import com.google.gson.Gson;
import com.hungrymap.server.server.dao.MemberRepository;
import com.hungrymap.server.server.dto.MemberDTO;
import com.hungrymap.server.server.dto.MemberDetails;
import com.hungrymap.server.server.entity.Member;
import com.hungrymap.server.server.entity.Roles;
import com.hungrymap.server.server.security.CustomSecurityConfig;
import com.hungrymap.server.server.security.util.JWTUtil;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@Log4j2
public class AuthService {
    private final MemberRepository mr;
    private final CustomSecurityConfig csc;

    @Autowired
    public AuthService(MemberRepository mr, CustomSecurityConfig csc) {
        this.mr = mr;
        this.csc = csc;
    }

    public Map<String, Object> login(Member member) {
        Map<String, Object> result = new HashMap<>();

        String email = member.getEmail();
        String pwd = member.getPwd();

        Member mem = mr.getWithRoles(email);

        if (mem == null) {
            result.put("error", "ERROR_LOGIN");
            return result;
        }
        if (!mem.getUserRoleList().contains(Roles.USER)){
            if (mem.getUserRoleList().contains(Roles.DELETED)) {
                result.put("error", "ERROR_USER_DELETED");
                return result;
            }
            if (mem.getUserRoleList().contains(Roles.INACTIVE)) {
                result.put("error", "ERROR_USER_INACTIVE");
            }
        }

        // 비밀번호 검증
        PasswordEncoder pe = csc.passwordEncoder();

        if (!pe.matches(pwd, mem.getPwd())){
            result.put("error", "ERROR_LOGIN");
            log.info("password does not match [original]: " + mem.getPwd() + "   ,   [raw password]" + pwd);
            return result;
        }

        MemberDetails memberDetails = new MemberDetails(mem);
        Authentication authentication = new UsernamePasswordAuthenticationToken(memberDetails, null, memberDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        MemberDTO memberDTO = memberDetails.toMemberDTO();

        String accessToken = JWTUtil.createToken(memberDTO, 5);
        String refreshToken = JWTUtil.createToken(memberDTO, 60 * 24);

        mem.setLastLoginTime(LocalDateTime.now());
        mr.save(mem);

        result.put("accessToken", accessToken);
        result.put("refreshToken", refreshToken);
        result.put("user", mem);

        return result;
    }

    public Map<String, Object> adminLogin(Member member) {
        Map<String, Object> result = new HashMap<>();

        String email = member.getEmail();
        String pwd = member.getPwd();

        Member mem = mr.getWithRoles(email);

        if (mem == null) {
            result.put("error", "ERROR_USER_NOT_FOUND");
            return result;
        }

        if (!mem.getUserRoleList().contains(Roles.USER) || !mem.getUserRoleList().contains(Roles.ADMIN)){
            result.put("error", "ERROR_USER_NOT_GRANTED");
            return result;
        }

        // 비밀번호 검증
        PasswordEncoder pe = csc.passwordEncoder();

        if (!pe.matches(pwd, mem.getPwd())){
            result.put("error", "ERROR_LOGIN");
            log.info("password does not match [original]: " + mem.getPwd() + "   ,   [raw password]" + pwd);
            return result;
        }

        MemberDetails memberDetails = new MemberDetails(mem);
        Authentication authentication = new UsernamePasswordAuthenticationToken(memberDetails, null, memberDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        MemberDTO memberDTO = memberDetails.toMemberDTO();



        String accessToken = JWTUtil.createToken(memberDTO, 5);
        String refreshToken = JWTUtil.createToken(memberDTO, 60 * 24);

        result.put("accessToken", accessToken);
        result.put("refreshToken", refreshToken);
        result.put("user", mem);

        return result;
    }
}
