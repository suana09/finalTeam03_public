package com.hungrymap.server.server.controller;

import com.hungrymap.server.server.dto.MemberDetails;
import com.hungrymap.server.server.entity.Member;
import com.hungrymap.server.server.entity.Roles;
import com.hungrymap.server.server.security.CustomSecurityConfig;
import com.hungrymap.server.server.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;


@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService ms;

    @Autowired
    public MemberController(MemberService ms) {
        this.ms = ms;
    }

    @PostMapping("/register")
    public ResponseEntity<Member> register(@RequestBody Member member){

        Member registerdMember = ms.register(member);
        if (registerdMember == null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Member memberCopied = new Member(registerdMember.getEmail(), registerdMember.getNickname(), "", "", registerdMember.getUserRoleList(), null);
        return ResponseEntity.status(HttpStatus.CREATED).body(memberCopied);
    }

    @GetMapping("/info")
    public ResponseEntity<MemberDetails> getLoggedInUser(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null){
            Object principal = auth.getPrincipal();
            if (principal instanceof MemberDetails memberDetails){
                String email = memberDetails.getUsername();

                Member member = ms.getMemberByEmail(email);
                return ResponseEntity.ok(new MemberDetails(member));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/validation/email")
    public Map<String, Object> emailValidation(@RequestBody Map<String, String> requestBody) {
        Map<String, Object> result = new HashMap<>();
        String email = requestBody.get("email");
        boolean isAlreadyIn = false;
        boolean isDeleted = false;
        boolean isDeletedAndReactivatable = false;
        boolean isInactive = false;
        LocalDateTime now = LocalDateTime.now();


        Member member = ms.getMemberByEmail(email);
        if (member != null) {
            isAlreadyIn = true;
            LocalDateTime lastLoginTime = (member.getLastLoginTime() != null)? (member.getLastLoginTime()) : null;
            boolean isWithinOneYear = false;
            if (lastLoginTime != null) {
                isWithinOneYear = lastLoginTime.isAfter(now.minus(1, ChronoUnit.YEARS)) || lastLoginTime.isEqual(now.minus(1, ChronoUnit.YEARS));
            }

            // 스트림 API를 사용하여 리스트에서 DELETED 또는 INACTIVE 포함 여부를 확인
            isDeleted = ( member.getUserRoleList().stream()
                    .filter(Objects::nonNull)
                    .map(obj -> (Roles) obj)
                    .anyMatch(role -> role == Roles.DELETED));

            isDeletedAndReactivatable = (isDeleted && isWithinOneYear);

            isInactive = member.getUserRoleList().stream()
                    .filter(Objects::nonNull)
                    .map(obj -> (Roles) obj)
                    .anyMatch(role -> role == Roles.INACTIVE);
        }

        result.put("isInactive", isInactive);
        result.put("isDeleted", isDeleted);
        result.put("isDeletedAndReactivatable", isDeletedAndReactivatable);
        result.put("isAlreadyIn", isAlreadyIn);
        return result;
    }

    @PutMapping("/edit")
    public ResponseEntity<Member> editMember(@RequestBody Member member) {
        Member toEdit = ms.getMemberByEmail(member.getEmail());

        Member editedMember = ms.edit(toEdit, member);
        Member memberCopied = new Member(editedMember.getEmail(), editedMember.getNickname(), member.getPwd(), editedMember.getProvider(), editedMember.getUserRoleList(), editedMember.getLastLoginTime());
        return ResponseEntity.status(HttpStatus.OK).body(memberCopied);
    }

    @PutMapping("/deletion")
    public Map<String, Object> deleteMember(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String pwd = requestBody.get("pwd");
        boolean result = ms.roleToDelete(email, pwd);
        String status = "";
        if (result){
            status = "success";
        } else {
            status = "fail";
        }
        return Map.of("status", status);
    }

    @PutMapping("/reactivate")
    public ResponseEntity<Object> regrantUser(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        List<String> emailList = List.of(email);
        try {
            boolean result = ms.roleToUser(emailList);
            if (result){
                return ResponseEntity.status(HttpStatus.OK).body("success");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("fail");
        } catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }


    @PutMapping("/pwd")
    public ResponseEntity<Object> changePassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String pwd = payload.get("pwd");

        boolean result = ms.resetPwd(email, pwd);
        if (result){
            return ResponseEntity.status(HttpStatus.OK).body("success");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("fail");
        }
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public ResponseEntity<List<Member>> turnToInactive(){
        return ResponseEntity.status(HttpStatus.OK).body(ms.turnToInactive());
    }





}
