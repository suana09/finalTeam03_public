package com.hungrymap.server.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "placestorage")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceStorage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "listid", nullable = false)
    private int listId;

    @Column(name = "placeid", length = 50, nullable = false)
    private String placeId;

}

