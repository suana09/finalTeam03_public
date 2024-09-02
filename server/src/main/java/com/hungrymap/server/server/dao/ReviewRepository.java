package com.hungrymap.server.server.dao;

import com.hungrymap.server.server.entity.Review;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    @Query("select distinct avg(r.rates) from Review r where r.placeId=:placeId")
    Float findByPlaceId(String placeId);



    List<Review> findByWriterOrderByIdDesc(String writer);

    @Query("select count(r) from Review r where r.placeId = :placeId")
    int getReviewCountById(String placeId);

    @Query("select r from Review r where r.placeId = :placeId")
    List<Review> findByOnePlaceId(String placeId);

    long countByWriter(String writer);

    @Query("select r from Review r where r.writer = :writer and r.placeId = :placeId")
    Review findByWriterAndPlaceId(String writer, String placeId);
}
