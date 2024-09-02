package com.hungrymap.server.server.dao;

import java.util.List;
import java.util.Optional;

import com.hungrymap.server.server.entity.PlaceList;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hungrymap.server.server.entity.Place;

public interface PlaceRepository extends JpaRepository<Place, String> {
    Optional<Place> findByPname(String pname);

    List<Place> findByPnameOrderByIdDesc(String word);

    @Query("select p from Place p where p.id = :placeId")
    Place getPlaceByPlaceId(String placeId);
}
