package com.stayfinder.repository;

import com.stayfinder.entity.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query("SELECT h FROM Hotel h WHERE " +
           "(:location IS NULL OR LOWER(h.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:minPrice IS NULL OR h.pricePerNight >= :minPrice) AND " +
           "(:maxPrice IS NULL OR h.pricePerNight <= :maxPrice) AND " +
           "(:minRating IS NULL OR h.rating >= :minRating) AND " +
           "(:availableOnly = false OR h.availableRooms > 0)")
    Page<Hotel> searchHotels(
            @Param("location") String location,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minRating") Double minRating,
            @Param("availableOnly") boolean availableOnly,
            Pageable pageable
    );
}
