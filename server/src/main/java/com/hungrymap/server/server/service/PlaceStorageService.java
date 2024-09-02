package com.hungrymap.server.server.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.hungrymap.server.server.dao.PlaceRepository;
import com.hungrymap.server.server.dao.PlaceStorageRepository;
import com.hungrymap.server.server.entity.Place;
import com.hungrymap.server.server.entity.PlaceStorage;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class PlaceStorageService {

    private final PlaceStorageRepository psr;
    private final PlaceRepository pr;
    private final EntityManager em;

    @Autowired
    public PlaceStorageService(PlaceStorageRepository psr, PlaceRepository pr , EntityManager em) {
        this.psr = psr;
        this.pr = pr;
        this.em = em;
    }

    public Page<PlaceStorage> getPlacesByPlaceListId(Integer listId, Pageable pageable){
        return psr.findByListId(listId, pageable);
    }

    public boolean insertPlace(PlaceStorage placeStorage) {
        Optional<Place> place = pr.findById(placeStorage.getPlaceId());

        List<PlaceStorage> result = psr.findByPlaceIdAndListId(placeStorage.getPlaceId(), placeStorage.getListId());
        if (!result.isEmpty()) {
            return false;
        }

        psr.save(placeStorage);
        return true;
    }

//    public Place getPlaceById(String placeId, Pageable pageable) {
//        return pr.findById(placeId, pageable).orElse(null);
//    }

    public void deletePlace(Integer listId, String placeId) {
        psr.deleteByListIdAndPlaceId(listId, placeId);
    }

}
