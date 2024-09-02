package com.hungrymap.server.server.controller;

import com.hungrymap.server.server.entity.Member;
import com.hungrymap.server.server.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminCotnroller {
    private final MemberService ms;

    @Autowired
    public AdminCotnroller(MemberService ms) {
        this.ms = ms;
    }

    @GetMapping("/member")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<Member> getAllMembers(@RequestParam(defaultValue = "0") int page, @RequestParam("pageSize") int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize);
        return ms.getAllMembers(pageable);
    }

    @PutMapping("/member/setadmin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> setAdmin(@RequestBody Map<String, Object> payload) {
        List<String> emailList = (List<String>) payload.get("email");
        try {
            ms.roleToAdmin(emailList);
            return new ResponseEntity<>("success", HttpStatus.OK);
        } catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/member/notadmin")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> notAdmin(@RequestBody Map<String, Object> payload) {
        List<String> emailList = (List<String>) payload.get("email");
        try {
            ms.roleNotAdmin(emailList);
            return new ResponseEntity<>("success", HttpStatus.OK);
        } catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

}
