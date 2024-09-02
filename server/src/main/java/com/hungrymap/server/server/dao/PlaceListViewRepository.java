package com.hungrymap.server.server.dao;

import com.hungrymap.server.server.entity.PlaceList;
import com.hungrymap.server.server.entity.PlaceListView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PlaceListViewRepository extends JpaRepository<PlaceListView, String> {

    List<PlaceListView> findByWriter(String writer);

    @Query("select p from PlaceListView p where p.favcount > 0 order by p.favcount desc limit 10")
    List<PlaceListView> findAllOrderByFavCount();

    @Query("select p from PlaceListView p where p.listName like concat('%', :keyword, '%')")
    List<PlaceListView> findPlaceListByKeyword(String keyword);

    @Query("select p from PlaceListView p where p.id = :listId")
    PlaceListView getPlaceListById(Integer listId);
}
