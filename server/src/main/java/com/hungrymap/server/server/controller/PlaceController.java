package com.hungrymap.server.server.controller;

import com.hungrymap.server.server.entity.Place;
import com.hungrymap.server.server.service.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/place")
public class PlaceController {

    private final PlaceService ps;

    @Autowired
    public PlaceController(PlaceService ps) {
        this.ps = ps;
    }


    @PostMapping("")
    public Map<String, Object> savePlace(@RequestBody Place place) {
        if (ps.getPlaceById(place.getId())){
            return Map.of("message", "alreadyExists");
        }

        ps.savePlace(place);
        return Map.of("message", "success");
    }

    @GetMapping("")
    public Place getPlaceById(@RequestParam("placeId") String placeId) {
        return ps.getPlaceByPlaceID(placeId);
    }

}
