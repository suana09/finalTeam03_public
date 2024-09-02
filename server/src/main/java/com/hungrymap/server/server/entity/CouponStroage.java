package com.hungrymap.server.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "couponstorage")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponStroage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "couponid", nullable = false)
    private Integer couponId;

    @Column(name = "user", length = 50, nullable = false)
    private String email;

    @Builder.Default
    @Column(name = "iscouponused", nullable = false)
    private boolean isCouponUsed = false;
}
