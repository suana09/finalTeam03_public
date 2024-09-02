package com.hungrymap.server.server.security.service;

import com.hungrymap.server.server.dao.MemberRepository;
import com.hungrymap.server.server.dto.MemberDTO;
import com.hungrymap.server.server.entity.Member;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository mr;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("username : " + username);
        log.info("--------------------------loadUserByUsername--------------------------");

        // 멤버 조회
        Member member = mr.getWithRoles(username);
        // 없으면 not found 처리
        if (member == null) {
            log.info("----------------------------User not found------------------------------");
            throw new UsernameNotFoundException(username + " : User not found");
        }

        // 존재할 경우 로그인 처리를 위해 entity 데이터를 DTO 데이터로 transfer
        MemberDTO memberDTO = new MemberDTO(
                member.getNickname(),
                member.getPwd(),
                member.getEmail(),
                member.getProvider(),
                member.getUserRoleList().stream().map(Enum::name).collect(Collectors.toList())
        );

        log.info("member : " + member);

        return memberDTO;
    }
}
