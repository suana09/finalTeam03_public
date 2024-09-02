package com.hungrymap.server.server.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Immutable;

import java.util.Date;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity(name = "review_view")
@Immutable
public class ReviewView {
    @Column(name = "writer", length = 100)
    private String writer;

    @Column(name = "content", length = 1000)
    private String content;

    @Column(name = "pname", length = 100)
    private String pname;

    @Column(name = "categoryname", length = 500)
    private String categoryname;

    @Column(name = "savefilename", length = 200)
    private String savefilename;

    @Column(name = "rates")
    private int rates;

    @Id
    @Column(name = "reviewid", nullable = false)
    private int reviewId;

    @Column(name = "placeid", length = 50, nullable = false)
    private String placeid;

    @Column(name = "nickname", length = 50, nullable = false)
    private String nickname;

    @Column(name = "writedate", nullable = false)
    private Date writedate;
}
