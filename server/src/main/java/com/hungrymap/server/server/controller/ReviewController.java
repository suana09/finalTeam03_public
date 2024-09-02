package com.hungrymap.server.server.controller;

import com.hungrymap.server.server.dto.Paging;
import com.hungrymap.server.server.entity.Review;
import com.hungrymap.server.server.entity.ReviewImages;
import com.hungrymap.server.server.entity.ReviewView;
import com.hungrymap.server.server.service.ReviewService;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/review")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/reviewList")
    public HashMap<String, Object> reviewList(@RequestParam("writer") String writer){
        HashMap<String, Object> hm = new HashMap<>();

        long count = reviewService.getReviewCountByWriter(writer);

        System.out.println("count : " + count);

        System.out.println("Total Count: " + count);

        List<Review> list = reviewService.reviewList(writer);

        // 리뷰 ID 리스트 생성
        List<Integer> reviewIdList = new ArrayList<>();

        // 각 리뷰의 id를 순회하면서 출력
        for (Review review : list) {
            int reviewId = review.getId(); // 각 행의 id를 가져옴
            System.out.println("Review ID: " + reviewId);
            reviewIdList.add(reviewId); // 리스트에 ID 추가
        }

        // 로그 추가: 조회된 리스트 확인
        System.out.println("Review List Size: " + list.size());


        // 각 리뷰에 연결된 첫 번째 이미지 파일명을 가져옴
        HashMap<Integer, String> reviewImagesMap = reviewService.getReviewImageFilename(list);

        System.out.println("reviewImagesMap" + reviewImagesMap);

        hm.put("reviewList", list);
        hm.put("totalReviews", count); // 총 리뷰 개수 추가
        hm.put("reviewImages", reviewImagesMap);  // 리뷰 이미지 리스트 추가
        hm.put("reviewIds", reviewIdList); // 리뷰 ID 리스트 추가


        return hm;
    }

    @GetMapping("/getPlace")
    public HashMap<String, Object> getPlace(@RequestParam("pname") String pname){
        HashMap<String, Object> hm = new HashMap<>();

        hm.put("place", reviewService.getPlace(pname));

        return hm;
    }

    @PostMapping("/writeReview")
    public HashMap<String, Object> writeReview(@RequestBody Review review){
        HashMap<String, Object> hm = new HashMap<>();

        Review insertedReview = reviewService.writeReview(review);

        if (insertedReview != null){
            hm.put("message", "OK");
            hm.put("review", insertedReview);
        } else {
            hm.put("message", "ERROR");
        }

        return hm;
    }

    @PostMapping("/insertImages")
    public HashMap<String, Object> insertImages(@RequestBody ReviewImages reviewImages){
        HashMap<String, Object> hm = new HashMap<>();

        System.out.println("reviewImages : " + reviewImages);

        reviewService.insertImages(reviewImages);

        hm.put("message", "OK");

        return hm;
    }

    @GetMapping("/memberList")
    public HashMap<String, Object> memberList(){
        HashMap<String, Object> hm = new HashMap<>();

        hm.put("memberList", reviewService.memberList());

        return hm;
    }

    @GetMapping("/reviewDetail/{id}")
    public HashMap<String, Object> reviewDetail(@PathVariable("id") int id){
        HashMap<String, Object> hm = new HashMap<>();
        ReviewView review = reviewService.reviewDetail(id);
        System.out.println("review = " + review);
        hm.put("review", review);

        return hm;

    }

    @PostMapping("/updateReview")
    public HashMap<String, Object> updateReview(@RequestBody Review review){
        HashMap<String, Object> hm = new HashMap<>();
        System.out.println("placeid : " + review.getPlaceId());
        reviewService.updateReview(review);

        hm.put("message", "OK");


        return hm;
    }

    @PostMapping("/updateImages")
    public HashMap<String, Object>updateImages(@RequestBody ReviewImages reviewImages){
        HashMap<String, Object> hm = new HashMap<>();

        reviewService.updateImages(reviewImages);

        hm.put("message", "OK");

        return hm;
    }

    @DeleteMapping("/deleteReview/{id}")
    public HashMap<String, Object> deleteReview(@PathVariable("id") int id){
        HashMap<String, Object> hm = new HashMap<>();

        String placeId = reviewService.deleteReview(id);

        hm.put("message", "OK");
        hm.put("placeId", placeId);
        return hm;
    }

    @PutMapping("/placeinfos")
    public HashMap<String, Object> updateRatesAndReviewCounts (@RequestParam("placeId") String placeId){
        HashMap<String, Object> hm = new HashMap<>();

        reviewService.averageRates(placeId);
        reviewService.reviewCounts(placeId);

        hm.put("message", "OK");

        return hm;
    }

    @GetMapping("/placeList")
    public HashMap<String, Object> placeList(@RequestParam("word") String word){
        HashMap<String, Object> hm = new HashMap<>();

        hm.put("placeList", reviewService.placeList(word));

        return hm;
    }

    @GetMapping("")
    public List<ReviewView> getAllReviewByPlaceId(@RequestParam("placeId") String placeId){
        return reviewService.getAllReviewByPlaceId(placeId);
    }


}
