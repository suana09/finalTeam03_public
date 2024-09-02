package com.hungrymap.server.server.service;

import com.hungrymap.server.server.dao.FavoriteRepository;
import com.hungrymap.server.server.entity.FavoriteList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class FavoriteService {
    private final FavoriteRepository fr;

    @Autowired
    public FavoriteService(FavoriteRepository fr) {
        this.fr = fr;
    }

    // 즐겨찾기 항목 추가
    public FavoriteList addFavorite(FavoriteList favoriteList) {

        Optional<FavoriteList> existedFavoriteList = fr.findByListIdAndEmail(favoriteList.getListId(), favoriteList.getEmail());

        if (existedFavoriteList.isPresent()) {
            return null;
        }

        return fr.save(favoriteList);
    }

    // 즐겨찾기 항목 삭제
    public void deleteFavorite(Integer listId, String email) {
        Optional<FavoriteList> existedFavoriteList = fr.findByListIdAndEmail(listId, email);
        if (existedFavoriteList.isEmpty()) {
            return;
        }

        FavoriteList fl = existedFavoriteList.get();
        fr.delete(fl);
    }
}
