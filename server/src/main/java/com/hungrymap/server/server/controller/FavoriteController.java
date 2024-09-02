package com.hungrymap.server.server.controller;

import com.hungrymap.server.server.entity.FavoriteList;
import com.hungrymap.server.server.entity.PlaceList;
import com.hungrymap.server.server.service.FavoriteService;
import com.hungrymap.server.server.service.PlaceListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favorite")
public class FavoriteController {
    private final FavoriteService fs;
    private final PlaceListService pls;

    @Autowired
    public FavoriteController(FavoriteService fs, PlaceListService pls) {
        this.fs = fs;
        this.pls = pls;
    }

    @PostMapping("")
    public ResponseEntity<FavoriteList> addFavorite(@RequestBody FavoriteList dto) {
        FavoriteList favoriteList = FavoriteList.builder()
                .listId(dto.getListId())
                .email(dto.getEmail())
                .build();
        // 수정사항 : 같은 회원이 같은 리스트를 즐겨찾기 할 수 없도록
        //          + 리스트 즐겨찾기 했을 때 favcount 컬럼에 +1

        FavoriteList savedFavorite = fs.addFavorite(favoriteList);
        if (savedFavorite == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        pls.increaseFavCount(savedFavorite);
        return new ResponseEntity<>(savedFavorite, HttpStatus.CREATED);
    }

    @DeleteMapping("")
    public ResponseEntity<String> deleteFavorite(@RequestBody FavoriteList dto) {
        // 수정사항 : 리스트를 즐겨찾기에서 삭제했을 때 favcount 컬럼 -1
        try {
            fs.deleteFavorite(dto.getListId(), dto.getEmail());
            pls.decreaseFavCount(dto.getListId());
            return new ResponseEntity<>("Favorite item deleted successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
