package com.hungrymap.server.server.dto;

import com.hungrymap.server.server.entity.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class MemberDetails implements UserDetails {
    private final Member member;

    public MemberDetails(Member member) {
        this.member = member;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return member.getUserRoleList().stream().map(role->new SimpleGrantedAuthority(role.name())).collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return member.getPwd();
    }

    @Override
    public String getUsername() {
        return member.getEmail();
    }

    public String getNickname() {
        return member.getNickname();
    }

    public String getProvider() {
        return member.getProvider();
    }

    public MemberDTO toMemberDTO() {
        return new MemberDTO(
                member.getEmail(),
                member.getPwd(),
                member.getNickname(),
                member.getProvider(),
                member.getUserRoleList().stream().map(Enum::name).collect(Collectors.toList())
        );
    }
}
