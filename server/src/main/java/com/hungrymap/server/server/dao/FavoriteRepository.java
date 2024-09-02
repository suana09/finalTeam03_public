package com.hungrymap.server.server.dao;

import com.hungrymap.server.server.entity.FavoriteList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<FavoriteList, Integer> {
    Optional<FavoriteList> findByListIdAndEmail(Integer listId, String email);

    @Query("select f.listId from FavoriteList f where f.email = :email")
    List<Integer> getFavListIdsByEmail(String email);
}