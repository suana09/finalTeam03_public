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
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(name = "review")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "content", length = 1000, nullable = false)
    private String content;

    @CreationTimestamp
    @Column(name = "writedate", nullable = false)
    private Date writedate;

    @Column(name = "rates", nullable = false)
    private Integer rates;

    @Column(name = "writer", length = 100, nullable = false)
    private String writer;

    @Column(name = "placeid", length = 50, nullable = false)
    private String placeId;
}
