package com.hungrymap.server.server.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.hungrymap.server.server.dao.PlaceListRepository;
import com.hungrymap.server.server.dao.PlaceListViewRepository;
import com.hungrymap.server.server.dao.PlaceRepository;
import com.hungrymap.server.server.entity.PlaceListView;
import com.hungrymap.server.server.service.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hungrymap.server.server.entity.Place;
import com.hungrymap.server.server.entity.PlaceList;
import com.hungrymap.server.server.entity.PlaceStorage;
import com.hungrymap.server.server.service.PlaceListService;
import com.hungrymap.server.server.service.PlaceStorageService;

@RestController
@RequestMapping("/placelist")
public class PlaceListController {
    private final PlaceListService pls;
    private final PlaceStorageService pss;
    private final PlaceService ps;
    private final PlaceRepository placeRepository;

    @Autowired
    public PlaceListController(PlaceListService pls, PlaceStorageService pss, PlaceService ps, PlaceRepository placeRepository) {
        this.pls = pls;
        this.pss = pss;
        this.ps = ps;
        this.placeRepository = placeRepository;
    }

    // 리스트 추가
    @PostMapping("")
    public ResponseEntity<PlaceList> insertPlaceList(@RequestBody PlaceList placeList) {
        Map<String, Object> result = new HashMap<>();
        PlaceList savedList = pls.savePlaceList(placeList);

        if (savedList != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(savedList);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    // 내 리스트 조회
    @GetMapping("/my")
    public List<PlaceListView> getMyPlaceLists(@RequestParam("writer") String writer) {
        return pls.getMyPlaceLists(writer);
    }

    // 리스트별 장소 조회
    @GetMapping("/place/{id}")
    public Page<Place> getPlacesByPlaceListId(@PathVariable Integer id, @RequestParam(defaultValue = "0") int page) {
        Pageable pageable = PageRequest.of(page, 4);

        Page<PlaceStorage> placeStoragesPage  = pss.getPlacesByPlaceListId(id, pageable);

        List<String> placeIds = placeStoragesPage.getContent().stream()
                .map(PlaceStorage::getPlaceId)
                .collect(Collectors.toList());

        List<Place> places = placeRepository.findAllById(placeIds);

        return new PageImpl<>(places, pageable, placeStoragesPage.getTotalElements());
    }

    // 리스트 수정
    @PutMapping("/{id}")
    public ResponseEntity<PlaceList> updatePlaceList(@PathVariable Long id, @RequestBody PlaceList placeList) {
        PlaceList placeListUpdated = pls.updatePlaceList(id, placeList);
        if (placeListUpdated == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }

        return ResponseEntity.status(HttpStatus.OK).body(placeListUpdated);
    }

    // 리스트 삭제
    @DeleteMapping("/{id}")
    public Map<String, Object> deletePlaceList(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        boolean success = pls.deletePlaceList(id);
        result.put("success", success);
        return result;
    }

    // 리스트에 장소 추가
    @PostMapping("/place")
    public ResponseEntity<Map<String, Object>> insertPlace(@RequestBody PlaceStorage placeStorage) {
        Map<String, Object> res = new HashMap<>();
        if (pss.insertPlace(placeStorage)){
            res.put("status", "success");
        } else {
            res.put("status", "fail");
        }

        return ResponseEntity.ok(res);
    }

    // 리스트에서 장소 삭제
    @DeleteMapping("/place")
    public ResponseEntity<Map<String, Object>> deletePlace(@RequestParam("listId") Integer listId,
                                                           @RequestParam("placeId") String placeId) {
        Map<String, Object> res = new HashMap<>();
        try {
            pss.deletePlace(listId, placeId); // 삭제 메서드 호출
            res.put("status", "success");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            throw new RuntimeException(e);
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 맛플리 인기순 조회
    @GetMapping("/popular")
    public List<PlaceListView> getPopularPlaceList() {
        return pls.getPopularPlaceList();
    }

    //맛플리 제목으로 검색
    @GetMapping("/search")
    public List<PlaceListView> searchPlaceList(@RequestParam("keyword") String keyword) {
        return pls.searchPlaceList(keyword);

    }

    @GetMapping("/fav")
    public List<PlaceListView> getFavPlaceList(@RequestParam("email") String email) {
        return pls.getFavList(email);
    }

}
