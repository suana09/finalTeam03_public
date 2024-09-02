package com.hungrymap.server.server.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "placelist")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "listname", length = 100, nullable = false)
    private String listName;

    @Column(name = "writer", length = 100, nullable = false)
    private String writer;

    @Column(name = "image", length = 100, nullable = false)
    private String image;

    @Column(name = "favcount", nullable = false)
    private Integer favcount;
}
