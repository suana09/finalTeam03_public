package com.hungrymap.server.server.dao;

import com.hungrymap.server.server.entity.Coupons;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<Coupons, Integer> {

}
