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

    @GetMapping("/my")
    public HashMap<String, Object> reviewList(@RequestParam("writer") String writer){
        HashMap<String, Object> hm = new HashMap<>();

        long count = reviewService.getReviewCountByWriter(writer);
        List<ReviewView> list = reviewService.reviewList(writer);

        hm.put("reviewList", list);

        return hm;
    }


    @PostMapping("")
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

    @PostMapping("/images")
    public HashMap<String, Object> insertImages(@RequestBody ReviewImages reviewImages){
        HashMap<String, Object> hm = new HashMap<>();

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

    @GetMapping("/{id}")
    public HashMap<String, Object> reviewDetail(@PathVariable("id") int id){
        HashMap<String, Object> hm = new HashMap<>();
        ReviewView review = reviewService.reviewDetail(id);
        hm.put("review", review);

        return hm;

    }

    @PutMapping("")
    public HashMap<String, Object> updateReview(@RequestBody Review review){
        HashMap<String, Object> hm = new HashMap<>();
        reviewService.updateReview(review);

        hm.put("message", "OK");


        return hm;
    }

    @PutMapping("/images")
    public HashMap<String, Object>updateImages(@RequestBody ReviewImages reviewImages){
        HashMap<String, Object> hm = new HashMap<>();

        reviewService.updateImages(reviewImages);

        hm.put("message", "OK");

        return hm;
    }

    @DeleteMapping("/{id}")
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



    @GetMapping("")
    public List<ReviewView> getAllReviewByPlaceId(@RequestParam("placeId") String placeId){
        return reviewService.getAllReviewByPlaceId(placeId);
    }

    // ??
    @GetMapping("/getPlace")
    public HashMap<String, Object> getPlace(@RequestParam("pname") String pname){
        HashMap<String, Object> hm = new HashMap<>();

        hm.put("place", reviewService.getPlace(pname));

        return hm;
    }

    // ??
    @GetMapping("/placeList")
    public HashMap<String, Object> placeList(@RequestParam("word") String word){
        HashMap<String, Object> hm = new HashMap<>();

        hm.put("placeList", reviewService.placeList(word));

        return hm;
    }


}
