package com.hungrymap.server.server.dao;

import com.hungrymap.server.server.entity.ReviewImages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewImagesRepository extends JpaRepository<ReviewImages, Integer> {
    // Optional<ReviewImages> findByReviewid(Integer reviewId);

    Optional<ReviewImages> findByReviewId(Integer reviewId);
}
