package com.hungrymap.server.server.service;

import com.hungrymap.server.server.dao.CouponRepository;
import com.hungrymap.server.server.entity.Coupons;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CouponService {
    private final CouponRepository cr;

    public CouponService(CouponRepository cr) {
        this.cr = cr;
    }


    public Coupons getCoupons() {
        Optional<Coupons> coupons = cr.findById(1);
        return coupons.orElse(null);
    }
}
