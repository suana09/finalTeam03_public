package com.hungrymap.server.server.service;

import com.hungrymap.server.server.dao.*;
import com.hungrymap.server.server.dto.Paging;
import com.hungrymap.server.server.entity.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;

    private final PlaceRepository placeRepository;

    private final ReviewImagesRepository reviewImagesRepository;

    private final MemberRepository memberRepository;

    private final ReviewViewRepository reviewViewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, PlaceRepository placeRepository, ReviewImagesRepository reviewImagesRepository, MemberRepository memberRepository, ReviewViewRepository reviewViewRepository) {
        this.reviewRepository = reviewRepository;
        this.placeRepository = placeRepository;
        this.reviewImagesRepository = reviewImagesRepository;
        this.memberRepository = memberRepository;
        this.reviewViewRepository = reviewViewRepository;
    }

    public List<ReviewView> reviewList(String writer) {
       return reviewViewRepository.findByWriterOrderByIdDesc(writer);
    }

    public Place getPlace(String pname) {
        Optional<Place> place = placeRepository.findByPname(pname);

        if(place.isPresent()){
           return place.get();
        }else{
            return null;
        }
    }

    public Review writeReview(Review review) {
        Review reviewExists = reviewRepository.findByWriterAndPlaceId(review.getWriter(), review.getPlaceId());
        if (reviewExists != null) {
            return null;
        }

        return reviewRepository.save(review);
    }

    public void insertImages(ReviewImages reviewImages) {
        reviewImagesRepository.save(reviewImages);
    }


    public List<Member> memberList() {
        List<Member> list = memberRepository.findAll();
        return list;
    }

    public ReviewView reviewDetail(int id) {
        ReviewView list = reviewViewRepository.findByReviewId(id);


        return list;
    }

    public void updateReview(Review review) {
        Optional<Review> review1 = reviewRepository.findById(review.getId());

        if(review1.isPresent()){
            Review review2 = review1.get();
            review2.setContent(review.getContent());
            review2.setWriter(review.getWriter());
            review2.setRates(review.getRates());
            review2.setPlaceId(review.getPlaceId());
            reviewRepository.save(review2);
        }else{
            return;
        }
    }

    public void updateImages(ReviewImages reviewImages) {
        Optional<ReviewImages> reviewImages1 = reviewImagesRepository.findByReviewId(reviewImages.getReviewId());

        if(reviewImages1.isPresent()){
            ReviewImages reviewImages2 = reviewImages1.get();
            reviewImages2.setSavefilename(reviewImages.getSavefilename());
            reviewImages2.setReviewId(reviewImages.getReviewId());
            reviewImagesRepository.save(reviewImages2);
        }

    }

    public String deleteReview(int id) {
        Optional<Review> review = reviewRepository.findById(id);
        if(review.isPresent()){
            reviewRepository.delete(review.get());
            String placeId = review.get().getPlaceId();
            return placeId;
        }

        return "";
    }

    public void averageRates(String placeId) {
        // 여기 실행하기 전에 한번 review 자체를 placeid로 조회해서
        // List size 가 0이면
        // 밑에 실행 안하고 바로 null
        List<Review> list = reviewRepository.findByOnePlaceId(placeId);
        Optional<Place> place = placeRepository.findById(placeId);

        if(place.isPresent()){
            Place place1 = place.get();

            if(list.isEmpty()){
                place1.setAvgRates(null);
                placeRepository.save(place1);
            } else {
                //플레이스 아이디로 리뷰 테이블에서 rates의 평균 조회 select avg(rates) from review where placeid=?
                //위에서 가져온 평균값으로 place 테이블의 해당 id를 가진 레코드의 avgrates 를 update
                Float reviewPlaceIdAvg = reviewRepository.findByPlaceId(placeId);
                place1.setAvgRates(reviewPlaceIdAvg);
                placeRepository.save(place1);
            }

        }
    }

    public List<Place> placeList(String word) {
        List<Place> places = placeRepository.findByPnameOrderByIdDesc(word);

        return places;
    }

    public void reviewCounts(String placeId) {
        int originalCounts = reviewRepository.getReviewCountById(placeId);
        Optional<Place> result = placeRepository.findById(placeId);
        Place originalPlace = result.orElse(null);
        originalPlace.setReviewCount(originalCounts);
        placeRepository.save(originalPlace);
    }

    public List<ReviewView> getAllReviewByPlaceId(String placeId) {
        return reviewViewRepository.getAllReviewByPlaceId(placeId);
    }

    public HashMap<Integer, String> getReviewImageFilename(List<Review> reviews) {
        HashMap<Integer, String> reviewImagesMap = new HashMap<>();

        for (Review review : reviews) {
            // 각 리뷰의 첫 번째 이미지를 Optional로 반환받음
            Optional<ReviewImages> optionalReviewImage = reviewImagesRepository.findByReviewId(review.getId());

            if (optionalReviewImage.isPresent()) {
                // 이미지가 존재할 경우, 맵에 추가
                reviewImagesMap.put(review.getId(), optionalReviewImage.get().getSavefilename());
            } else {
                // 이미지가 없을 경우 null 또는 빈 값으로 처리
                reviewImagesMap.put(review.getId(), null);
            }
        }

        return reviewImagesMap;
    }

    public long getReviewCountByWriter(String writer) {
        return reviewRepository.countByWriter(writer); // writer에 해당하는 리뷰의 수 반환
    }
}
