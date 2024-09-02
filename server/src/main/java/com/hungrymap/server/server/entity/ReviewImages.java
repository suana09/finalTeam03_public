package com.hungrymap.server.server.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reviewimages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "savefilename", length = 200, nullable = false)
    private String savefilename;

    @Column(name = "reviewid", nullable = false)
    private Integer reviewId;
}
