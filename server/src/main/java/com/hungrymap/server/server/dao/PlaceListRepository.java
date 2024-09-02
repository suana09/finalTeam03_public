package com.hungrymap.server.server.dao;

import com.hungrymap.server.server.entity.PlaceList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaceListRepository extends JpaRepository<PlaceList, Long> {

    List<PlaceList> findByWriter(String writer); // writer를 기준으로 검색

    @Query("select p from PlaceList p where p.id = :listId")
    PlaceList getPlaceListById(Integer listId);

    @Query("select p from PlaceList p order by p.favcount desc limit 10")
    List<PlaceList> findAllOrderByFavCount();

    @Query("select p from PlaceList p where p.listName like concat('%', :keyword, '%')")
    List<PlaceList> findPlaceListByKeyword(String keyword);

    @Query("select p from PlaceList p where p.writer = :writer and p.listName = :listName")
    Optional<PlaceList> findByWriterAndListName(String writer, String listName);
}