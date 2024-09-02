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
import org.hibernate.annotations.Immutable;

@Entity
@Table(name = "matpli_view")
@Immutable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceListView {

    @Id
    private Integer id;

    @Column(name = "listname", length = 100, nullable = false)
    private String listName;

    @Column(name = "writer", length = 100, nullable = false)
    private String writer;

    @Column(name = "writernickname", length = 50, nullable = false)
    private String nickname;

    @Column(name = "image", length = 100, nullable = false)
    private String image;

    @Column(name = "favcount", nullable = false)
    private Integer favcount;
}
