package com.hungrymap.server.server.service;

import com.hungrymap.server.server.dao.PlaceRepository;
import com.hungrymap.server.server.entity.Place;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PlaceService {
    private final PlaceRepository pr;
    private final EntityManager em;

    @Autowired
    public PlaceService(PlaceRepository pr, EntityManager em) {
        this.pr = pr;
        this.em = em;
    }



    public List<Place> searchPlaces(String district1, String district2, String district3, Integer minRate, Integer minReview, String word) {
        StringBuilder queryBuilder = new StringBuilder("SELECT p FROM Place p WHERE 1=1");

        List<Object> parameters = new ArrayList<>();

        if ((district1 != null && !district1.isEmpty()) ||
                (district2 != null && !district2.isEmpty()) ||
                (district3 != null && !district3.isEmpty())) {

            queryBuilder.append(" AND (");

            if (district1 != null && !district1.isEmpty()) {
                queryBuilder.append("p.address1 LIKE :district1");
                parameters.add("%" + district1 + "%");
            }
            if (district2 != null && !district2.isEmpty()) {
                if (parameters.size() > 0) {
                    queryBuilder.append(" OR ");
                }
                queryBuilder.append("p.address1 LIKE :district2");
                parameters.add("%" + district2 + "%");
            }
            if (district3 != null && !district3.isEmpty()) {
                if (parameters.size() > 0) {
                    queryBuilder.append(" OR ");
                }
                queryBuilder.append("p.address1 LIKE :district3");
                parameters.add("%" + district3 + "%");
            }

            queryBuilder.append(")");
        }

        if (minRate != 0) {
            queryBuilder.append(" AND p.avgRates >= :minRate");
            parameters.add(minRate);
        }

        if (minReview != 0) {
            queryBuilder.append(" AND p.reviewCount >= :minReview");
            parameters.add(minReview);
        }

        if (word != null && !word.isEmpty()) {
            queryBuilder.append(" AND p.pname LIKE :word");
            parameters.add("%" + word + "%");
        }

        TypedQuery<Place> query = em.createQuery(queryBuilder.toString(), Place.class);

        if (district1 != null && !district1.isEmpty()) {
            query.setParameter("district1", "%" + district1 + "%");
        }
        if (district2 != null && !district2.isEmpty()) {
            query.setParameter("district2", "%" + district2 + "%");
        }
        if (district3 != null && !district3.isEmpty()) {
            query.setParameter("district3", "%" + district3 + "%");
        }
        if (minRate != 0) {
            query.setParameter("minRate", minRate);
        }
        if (minReview != 0) {
            query.setParameter("minReview", minReview);
        }
        if (word != null && !word.isEmpty()) {
            query.setParameter("word", "%" + word + "%");
        }
        return query.getResultList();
    }

    public boolean getPlaceById(String id) {
        Optional<Place> result = pr.findById(id);
        if (result.isPresent()) {
            return true;
        }
        return false;
    }

    public void savePlace(Place place) {
        place.setReviewCount(0);
        pr.save(place);
    }

    public Place getPlaceByPlaceID(String placeId) {
        return pr.getPlaceByPlaceId(placeId);
    }
}
