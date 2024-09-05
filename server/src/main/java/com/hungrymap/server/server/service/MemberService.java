package com.hungrymap.server.server.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.hungrymap.server.server.entity.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hungrymap.server.server.dao.MemberRepository;
import com.hungrymap.server.server.entity.Roles;
import com.hungrymap.server.server.security.CustomSecurityConfig;

@Service
@Transactional
public class MemberService {

    private final MemberRepository mr;
    private final CustomSecurityConfig csc;

    @Autowired
    public MemberService(MemberRepository mr, CustomSecurityConfig csc) {
        this.mr = mr;
        this.csc = csc;
    }

    public Member register(Member member) {
        PasswordEncoder pe = csc.passwordEncoder();
        Member mem = Member.builder()
                .nickname(member.getNickname())
                .email(member.getEmail())
                .pwd(pe.encode(member.getPwd()))
                .provider(member.getProvider())
                .userRoleList(Arrays.asList(Roles.USER))
                .build();

        Member registered = mr.save(mem);
        return registered;
    }

    public Member getMemberByEmail(String email) {
        return mr.getWithRoles(email);
    }


    public Member edit(Member originalInfo, Member editedInfo) {
        PasswordEncoder pe = csc.passwordEncoder();

        Member mem = Member.builder()
                .nickname(editedInfo.getNickname())
                .email(originalInfo.getEmail())
                .pwd(pe.encode(editedInfo.getPwd()))
                .userRoleList(originalInfo.getUserRoleList())
                .provider(originalInfo.getProvider())
                .build();

        return mr.save(mem);
    }

    public boolean roleToDelete(String email, String pwd) {
        PasswordEncoder pe = csc.passwordEncoder();
        Member toDelete = mr.getWithRoles(email);
        List<Roles> roles = toDelete.getUserRoleList();
        
        if (!pe.matches(pwd, toDelete.getPwd())){
            return false;
        }

        List<Roles> updatedRoles = roles.stream().filter(role->!role.name().equals("USER") && !role.name().equals("ADMIN")).collect(Collectors.toList());
        updatedRoles.add(Roles.DELETED);
        toDelete.setUserRoleList(updatedRoles);

        mr.save(toDelete);

        return true;
    }

    public Page<Member> getAllMembers(Pageable pageable) {
        return mr.getAllWithRoles(pageable);
    }

    public void roleToAdmin(List<String> emailList) {
        List<Member> toAdmin = emailList.stream()
                .map(mr::getWithRoles)
                .toList();

        for (Member member : toAdmin) {
            List<Roles> roles = member.getUserRoleList();

            if (roles.stream().noneMatch(role -> role.name().equals("ADMIN"))) {
                roles.add(Roles.ADMIN);
            }
            member.setUserRoleList(roles);
            mr.save(member);
        }
    }

    public void roleNotAdmin(List<String> emailList) {
        List<Member> toRemoveAdmin = emailList.stream()
                .map(mr::getWithRoles)
                .toList();

        for (Member member : toRemoveAdmin) {
            List<Roles> roles = member.getUserRoleList();

            if (roles.stream().anyMatch(role -> role.name().equals("ADMIN"))) {
                roles.remove(Roles.ADMIN);
            }
            member.setUserRoleList(roles);
            mr.save(member);
        }
    }

    public boolean roleToUser(List<String> emailList) {
        List<Member> toUser = emailList.stream()
                .map(mr::getWithRoles)
                .collect(Collectors.toList());

        LocalDateTime now = LocalDateTime.now();

        for (Member member : toUser) {
            List<Roles> roles = member.getUserRoleList();
            LocalDateTime lastLoginTime = member.getLastLoginTime();

            // 1년 이내인지 확인
            boolean isWithinOneYear = lastLoginTime.isAfter(now.minus(1, ChronoUnit.YEARS)) || lastLoginTime.isEqual(now.minus(1, ChronoUnit.YEARS));

            if (roles.stream().anyMatch(role -> role == Roles.DELETED)) {
                if (isWithinOneYear){
                    roles.remove(Roles.DELETED);
                    roles.add(Roles.USER);
                    member.setUserRoleList(roles);
                    mr.save(member);
                    return true;
                }

                return false;
            }

            if (roles.stream().anyMatch(role -> role == Roles.INACTIVE)) {
                roles.remove(Roles.INACTIVE);
                roles.add(Roles.USER);
                member.setUserRoleList(roles);
                mr.save(member);
                return true;
            }

        }
        return false;
    }

    public boolean resetPwd(String email, String pwd) {
        Member member = mr.getWithRoles(email);
        PasswordEncoder pe = csc.passwordEncoder();
        if (member == null) {
            return false;
        }
        member.setPwd(pe.encode(pwd));
        return true;
    }

    public List<Member> turnToInactive() {
        LocalDateTime now = LocalDateTime.now();
        List<Member> toInactive = mr.getAllWithRoles().stream()
                // 마지막 로그인 일시로부터 일년이 지난 회원들 스트림
                .filter(mem -> mem.getLastLoginTime() != null && mem.getLastLoginTime().isBefore(now.minus(1, ChronoUnit.YEARS)))
                // USER O, ADMIN X 인 회원
                // 관리자 회원은 휴면회원 전환 X
                .filter(mem -> mem.getUserRoleList().stream().anyMatch(role -> role == Roles.USER))
                .filter(mem -> mem.getUserRoleList().stream().noneMatch(role -> role == Roles.ADMIN))
                .peek(mem -> {
                    mem.getUserRoleList().removeIf(role -> role == Roles.USER);
                    mem.getUserRoleList().add(Roles.INACTIVE);
                })
                .collect(Collectors.toList());

        mr.saveAll(toInactive);

        return toInactive;
    }
}
