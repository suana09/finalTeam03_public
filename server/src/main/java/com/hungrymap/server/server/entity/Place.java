package com.hungrymap.server.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "place")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Place {

    @Id
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "y", length = 100)
    private String latitude;

    @Column(name = "x", length = 100)
    private String longitude;

    @Column(name = "pname", length = 100, nullable = false)
    private String pname;

    @Column(name = "address", length = 100, nullable = false)
    private String address;

    @Column(name = "reviewcount")
    private Integer reviewCount;

    @Column(name = "avgrates", nullable = true)
    private Float avgRates;

    @Column(name = "categoryname", length = 500)
    private String categoryName;

    @Column(name = "image", length = 200)
    private String image;

}