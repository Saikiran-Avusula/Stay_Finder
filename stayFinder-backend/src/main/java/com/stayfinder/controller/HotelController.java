package com.stayfinder.controller;

import com.stayfinder.dto.HotelDTO;
import com.stayfinder.service.HotelService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<HotelDTO.Response>> searchHotels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "false") boolean availableOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "pricePerNight") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        HotelDTO.SearchRequest request = new HotelDTO.SearchRequest();
        request.setLocation(location);
        request.setMinPrice(minPrice);
        request.setMaxPrice(maxPrice);
        request.setMinRating(minRating);
        request.setAvailableOnly(availableOnly);
        request.setPage(page);
        request.setSize(size);
        request.setSortBy(sortBy);
        request.setSortDir(sortDir);
        return ResponseEntity.ok(hotelService.searchHotels(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDTO.Response> getHotel(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelDTO.Response> createHotel(@Valid @RequestBody HotelDTO.Request request) {
        return ResponseEntity.ok(hotelService.createHotel(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelDTO.Response> updateHotel(@PathVariable Long id,
                                                          @Valid @RequestBody HotelDTO.Request request) {
        return ResponseEntity.ok(hotelService.updateHotel(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.noContent().build();
    }
}
