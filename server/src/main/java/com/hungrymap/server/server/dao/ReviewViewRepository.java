package com.hungrymap.server.server.dao;

import com.hungrymap.server.server.entity.Review;
import com.hungrymap.server.server.entity.ReviewView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewViewRepository extends JpaRepository<ReviewView, String> {
    ReviewView findByReviewId(int id);

    @Query("select r from review_view r where r.placeid = :placeId order by r.reviewId desc")
    List<ReviewView> getAllReviewByPlaceId(String placeId);

    @Query("select r from review_view r where r.writer = :writer order by r.writedate desc")
    List<ReviewView> findByWriterOrderByIdDesc(String writer);
}
