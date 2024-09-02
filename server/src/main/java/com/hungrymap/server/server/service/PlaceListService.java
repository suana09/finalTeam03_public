package com.hungrymap.server.server.service;

import com.hungrymap.server.server.dao.FavoriteRepository;
import com.hungrymap.server.server.dao.PlaceListRepository;
import com.hungrymap.server.server.dao.PlaceListViewRepository;
import com.hungrymap.server.server.entity.FavoriteList;
import com.hungrymap.server.server.entity.PlaceList;
import com.hungrymap.server.server.entity.PlaceListView;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.Console;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Transactional
public class PlaceListService {
    private final PlaceListRepository plr;
    private final FavoriteRepository fr;
    private final PlaceListViewRepository plvr;

    @Autowired
    public PlaceListService(PlaceListRepository plr, FavoriteRepository fr, PlaceListViewRepository plvr) {
        this.plr = plr;
        this.fr = fr;
        this.plvr = plvr;
    }

    public PlaceList savePlaceList(PlaceList placeList) {
        placeList.setFavcount(0);
        Optional<PlaceList> optionalPlaceList = plr.findByWriterAndListName(placeList.getWriter(), placeList.getListName());
        if (optionalPlaceList.isPresent()) {
            return null;
        }
        return plr.save(placeList);
    }

    public PlaceList updatePlaceList(Long id, PlaceList updatedPlaceList) {
        Optional<PlaceList> placeListOptional = plr.findById(id);
        if (placeListOptional.isPresent()) {
            // 기존 리스트
            PlaceList placeList = placeListOptional.get();

            // 같은 이름 + 같은 리스트로 존재하는지
            Optional<PlaceList> nameExists = plr.findByWriterAndListName(updatedPlaceList.getWriter(), updatedPlaceList.getListName());
            if (nameExists.isPresent()) {
                // 해당 이름+리스트 아이디가 기존 리스트 아이디랑 다르면
                if (!Objects.equals(placeList.getId(), nameExists.get().getId())) {
                    // 수정실패
                    System.out.println("수정실패");
                    return null;
                }
            }

            placeList.setListName(updatedPlaceList.getListName());
            placeList.setImage(updatedPlaceList.getImage());
            return plr.save(placeList);
        } else {
            throw new RuntimeException();
        }
    }

    public boolean deletePlaceList(Long id) {
        if (plr.existsById(id)) {
            plr.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    public List<PlaceListView> getMyPlaceLists(String writer) {
        return plvr.findByWriter(writer);
    }


    public void increaseFavCount(FavoriteList savedFavorite) {
        PlaceList addedPlaceList = plr.getPlaceListById(savedFavorite.getListId());
        addedPlaceList.setFavcount(addedPlaceList.getFavcount() + 1);
        plr.save(addedPlaceList);
    }

    public void decreaseFavCount(Integer listId) {
        PlaceList removedPlaceList = plr.getPlaceListById(listId);
        removedPlaceList.setFavcount(removedPlaceList.getFavcount() - 1);
        plr.save(removedPlaceList);
    }

    public List<PlaceListView> getPopularPlaceList() {
        return plvr.findAllOrderByFavCount();
    }

    public List<PlaceListView> searchPlaceList(String keyword) {
        return plvr.findPlaceListByKeyword(keyword);
    }

    public List<PlaceListView> getFavList(String email) {
        List<Integer> listIds = fr.getFavListIdsByEmail(email);
        List<PlaceListView> favLists = new ArrayList<>();

        for (Integer listId : listIds) {
            PlaceListView placeList = plvr.getPlaceListById(listId);
            if (placeList != null) {
                favLists.add(placeList);
            }
        }
        return favLists;

    }
}