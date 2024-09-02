package com.hungrymap.server.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "favoritelist")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "listid")
    private Integer listId;

    @Column(name = "email", length = 100)
    private String email;
}