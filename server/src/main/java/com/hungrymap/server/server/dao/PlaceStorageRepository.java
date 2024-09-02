package com.hungrymap.server.server.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hungrymap.server.server.entity.PlaceStorage;

@Repository
public interface PlaceStorageRepository extends JpaRepository<PlaceStorage, Integer> {
    Page<PlaceStorage> findByListId(Integer listId, Pageable pageable);

    void deleteByListIdAndPlaceId(Integer listId, String placeId);

//    List<PlaceStorage> findByPlaceId(Integer id);

    @Query("select p from PlaceStorage p where p.listId = :listId and p.placeId = :placeId")
    List<PlaceStorage> findByPlaceIdAndListId(String placeId, Integer listId);
}
