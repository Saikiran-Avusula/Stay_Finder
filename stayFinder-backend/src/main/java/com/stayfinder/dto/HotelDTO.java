package com.stayfinder.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

public class HotelDTO {

    public static class Request {
        @NotBlank
        private String name;
        @NotBlank
        private String location;
        private String description;
        @NotNull
        @Positive
        private BigDecimal pricePerNight;
        private Double rating;
        private Integer totalRooms;
        private Integer availableRooms;
        private String imageUrl;
        private List<String> amenities;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public BigDecimal getPricePerNight() { return pricePerNight; }
        public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }

        public Double getRating() { return rating; }
        public void setRating(Double rating) { this.rating = rating; }

        public Integer getTotalRooms() { return totalRooms; }
        public void setTotalRooms(Integer totalRooms) { this.totalRooms = totalRooms; }

        public Integer getAvailableRooms() { return availableRooms; }
        public void setAvailableRooms(Integer availableRooms) { this.availableRooms = availableRooms; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public List<String> getAmenities() { return amenities; }
        public void setAmenities(List<String> amenities) { this.amenities = amenities; }
    }

    public static class Response {
        private Long id;
        private String name;
        private String location;
        private String description;
        private BigDecimal pricePerNight;
        private Double rating;
        private Integer totalRooms;
        private Integer availableRooms;
        private String imageUrl;
        private List<String> amenities;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public BigDecimal getPricePerNight() { return pricePerNight; }
        public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }

        public Double getRating() { return rating; }
        public void setRating(Double rating) { this.rating = rating; }

        public Integer getTotalRooms() { return totalRooms; }
        public void setTotalRooms(Integer totalRooms) { this.totalRooms = totalRooms; }

        public Integer getAvailableRooms() { return availableRooms; }
        public void setAvailableRooms(Integer availableRooms) { this.availableRooms = availableRooms; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public List<String> getAmenities() { return amenities; }
        public void setAmenities(List<String> amenities) { this.amenities = amenities; }
    }

    public static class SearchRequest {
        private String location;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private Double minRating;
        private boolean availableOnly = false;
        private int page = 0;
        private int size = 10;
        private String sortBy = "pricePerNight";
        private String sortDir = "asc";

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public BigDecimal getMinPrice() { return minPrice; }
        public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

        public BigDecimal getMaxPrice() { return maxPrice; }
        public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }

        public Double getMinRating() { return minRating; }
        public void setMinRating(Double minRating) { this.minRating = minRating; }

        public boolean isAvailableOnly() { return availableOnly; }
        public void setAvailableOnly(boolean availableOnly) { this.availableOnly = availableOnly; }

        public int getPage() { return page; }
        public void setPage(int page) { this.page = page; }

        public int getSize() { return size; }
        public void setSize(int size) { this.size = size; }

        public String getSortBy() { return sortBy; }
        public void setSortBy(String sortBy) { this.sortBy = sortBy; }

        public String getSortDir() { return sortDir; }
        public void setSortDir(String sortDir) { this.sortDir = sortDir; }
    }
}