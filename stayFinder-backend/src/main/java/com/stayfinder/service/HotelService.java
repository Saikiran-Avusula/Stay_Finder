package com.stayfinder.service;

import com.stayfinder.dto.HotelDTO;
import com.stayfinder.entity.Amenity;
import com.stayfinder.entity.Hotel;
import com.stayfinder.repository.HotelRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public Page<HotelDTO.Response> searchHotels(HotelDTO.SearchRequest request) {
        Sort sort = request.getSortDir().equalsIgnoreCase("desc")
                ? Sort.by(request.getSortBy()).descending()
                : Sort.by(request.getSortBy()).ascending();

        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);

        return hotelRepository.searchHotels(
                request.getLocation(),
                request.getMinPrice(),
                request.getMaxPrice(),
                request.getMinRating(),
                request.isAvailableOnly(),
                pageable
        ).map(this::toResponse);
    }

    public HotelDTO.Response getHotelById(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + id));
        return toResponse(hotel);
    }

    @Transactional
    public HotelDTO.Response createHotel(HotelDTO.Request request) {
        Hotel hotel = new Hotel();
        hotel.setName(request.getName());
        hotel.setLocation(request.getLocation());
        hotel.setDescription(request.getDescription());
        hotel.setPricePerNight(request.getPricePerNight());
        hotel.setRating(request.getRating() != null ? request.getRating() : 0.0);
        hotel.setTotalRooms(request.getTotalRooms());
        hotel.setAvailableRooms(request.getAvailableRooms());
        hotel.setImageUrl(request.getImageUrl());

        if (request.getAmenities() != null) {
            List<Amenity> amenities = new ArrayList<>();
            for (String name : request.getAmenities()) {
                amenities.add(new Amenity(hotel, name));
            }
            hotel.setAmenities(amenities);
        }

        return toResponse(hotelRepository.save(hotel));
    }

    @Transactional
    public HotelDTO.Response updateHotel(Long id, HotelDTO.Request request) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + id));

        hotel.setName(request.getName());
        hotel.setLocation(request.getLocation());
        hotel.setDescription(request.getDescription());
        hotel.setPricePerNight(request.getPricePerNight());
        if (request.getRating() != null) hotel.setRating(request.getRating());
        hotel.setTotalRooms(request.getTotalRooms());
        hotel.setAvailableRooms(request.getAvailableRooms());
        hotel.setImageUrl(request.getImageUrl());

        hotel.getAmenities().clear();
        if (request.getAmenities() != null) {
            for (String name : request.getAmenities()) {
                hotel.getAmenities().add(new Amenity(hotel, name));
            }
        }

        return toResponse(hotelRepository.save(hotel));
    }

    public void deleteHotel(Long id) {
        if (!hotelRepository.existsById(id)) {
            throw new RuntimeException("Hotel not found with id: " + id);
        }
        hotelRepository.deleteById(id);
    }

    private HotelDTO.Response toResponse(Hotel hotel) {
        HotelDTO.Response response = new HotelDTO.Response();
        response.setId(hotel.getId());
        response.setName(hotel.getName());
        response.setLocation(hotel.getLocation());
        response.setDescription(hotel.getDescription());
        response.setPricePerNight(hotel.getPricePerNight());
        response.setRating(hotel.getRating());
        response.setTotalRooms(hotel.getTotalRooms());
        response.setAvailableRooms(hotel.getAvailableRooms());
        response.setImageUrl(hotel.getImageUrl());
        response.setAmenities(
                hotel.getAmenities().stream()
                        .map(Amenity::getName)
                        .collect(Collectors.toList())
        );
        return response;
    }
}
