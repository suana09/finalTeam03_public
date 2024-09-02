package com.hungrymap.server.server.controller;

import com.hungrymap.server.server.entity.Coupons;
import com.hungrymap.server.server.service.CouponService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/coupon")
public class CouponController {
    private final CouponService cs;

    public CouponController(CouponService cs) {
        this.cs = cs;
    }

    @GetMapping("")
    public Coupons getCoupons() {
        return cs.getCoupons();
    }

}
