package com.hungrymap.server.server.dto;

import lombok.NoArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class MemberDTO extends User {

    public MemberDTO(
            String username,
            String password,
            String nickname,
            String provider,
            List<String> roleNames) {
        super(username, password, roleNames.stream()
                .map(role -> role.startsWith("ROLE_") ? role : "ROLE_" + role)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList())
        );

        this.email = username;
        this.pwd = password;
        this.nickname = nickname;
        this.provider = provider;
        this.roleNames = roleNames;
    }

    private String nickname;
    private String pwd;
    private String email;
    private List<String> roleNames = new ArrayList<String>();
    private String provider;

    // JWT 토큰 생성시에 그 안에 넣을 개인정보들을 Map 형식으로 구현
    // 암호화 JWT 토큰 생성시 그 Map 을 통째로 암호화 하는 것
    public Map<String, Object> getClaims(){
        Map<String, Object> claims = new HashMap<>();
        claims.put("nickname", nickname);
        claims.put("pwd", pwd);
        claims.put("email", email);
        claims.put("provider", provider);
        claims.put("roleNames", roleNames);
        return claims;
    }
}
