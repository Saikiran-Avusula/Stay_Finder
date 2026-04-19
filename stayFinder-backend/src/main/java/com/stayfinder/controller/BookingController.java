package com.stayfinder.controller;

import com.stayfinder.dto.BookingDTO;
import com.stayfinder.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingDTO.Response> createBooking(
            @Valid @RequestBody BookingDTO.Request request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookingService.createBooking(request, userDetails.getUsername()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingDTO.Response>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookingService.getUserBookings(userDetails.getUsername()));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingDTO.Response> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, userDetails.getUsername()));
    }
}
