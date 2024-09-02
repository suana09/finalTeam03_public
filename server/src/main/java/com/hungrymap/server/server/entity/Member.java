package com.hungrymap.server.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "member")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    @Id
    @Column(name = "email", length = 100, nullable = false)
    private String email;

    @Column(name = "nickname", length = 50)
    private String nickname;

    @Column(name = "pwd", length = 500)
    private String pwd;

    @Column(name = "provider", length = 30)
    private String provider;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "member_userrolelist")
    @Builder.Default
    private List<Roles> userRoleList = new ArrayList<>();

    @Column(name = "last_login_time")
    private LocalDateTime lastLoginTime;
}
