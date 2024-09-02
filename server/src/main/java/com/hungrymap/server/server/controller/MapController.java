package com.hungrymap.server.server.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class MapController {

    @GetMapping("/map/details")
    public ResponseEntity<String> getMapDetails(@RequestParam String placeId){
        String url = "https://place.map.kakao.com/main/v/" + placeId;

        RestTemplate restTemplate = new RestTemplate();
        // 카카오 API 요청
        String response = restTemplate.getForObject(url, String.class);

        return ResponseEntity.ok(response);
    }
}
