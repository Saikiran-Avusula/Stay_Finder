package com.stayfinder.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingDTO {

    public static class Request {
        @NotNull
        private Long hotelId;
        @NotNull
        @Future
        private LocalDate checkIn;
        @NotNull
        private LocalDate checkOut;

        public Long getHotelId() { return hotelId; }
        public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

        public LocalDate getCheckIn() { return checkIn; }
        public void setCheckIn(LocalDate checkIn) { this.checkIn = checkIn; }

        public LocalDate getCheckOut() { return checkOut; }
        public void setCheckOut(LocalDate checkOut) { this.checkOut = checkOut; }
    }

    public static class Response {
        private Long id;
        private Long hotelId;
        private String hotelName;
        private String hotelLocation;
        private String hotelImageUrl;
        private LocalDate checkIn;
        private LocalDate checkOut;
        private BigDecimal totalPrice;
        private String status;
        private LocalDateTime createdAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getHotelId() { return hotelId; }
        public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

        public String getHotelName() { return hotelName; }
        public void setHotelName(String hotelName) { this.hotelName = hotelName; }

        public String getHotelLocation() { return hotelLocation; }
        public void setHotelLocation(String hotelLocation) { this.hotelLocation = hotelLocation; }

        public String getHotelImageUrl() { return hotelImageUrl; }
        public void setHotelImageUrl(String hotelImageUrl) { this.hotelImageUrl = hotelImageUrl; }

        public LocalDate getCheckIn() { return checkIn; }
        public void setCheckIn(LocalDate checkIn) { this.checkIn = checkIn; }

        public LocalDate getCheckOut() { return checkOut; }
        public void setCheckOut(LocalDate checkOut) { this.checkOut = checkOut; }

        public BigDecimal getTotalPrice() { return totalPrice; }
        public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}