package com.hungrymap.server.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "placeimages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "address1", length = 100, nullable = false)
    private String filename;

    @Column(name = "placeid", nullable = false)
    private Integer placeId;

}
