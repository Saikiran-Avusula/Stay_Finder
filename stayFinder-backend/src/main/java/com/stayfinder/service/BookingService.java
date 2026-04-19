package com.stayfinder.service;

import com.stayfinder.dto.BookingDTO;
import com.stayfinder.entity.Booking;
import com.stayfinder.entity.Hotel;
import com.stayfinder.entity.User;
import com.stayfinder.repository.BookingRepository;
import com.stayfinder.repository.HotelRepository;
import com.stayfinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          HotelRepository hotelRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.hotelRepository = hotelRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingDTO.Response createBooking(BookingDTO.Request request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        if (hotel.getAvailableRooms() <= 0) {
            throw new RuntimeException("No rooms available for this hotel");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        if (nights <= 0) {
            throw new RuntimeException("Check-out must be after check-in");
        }

        BigDecimal totalPrice = hotel.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setHotel(hotel);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setTotalPrice(totalPrice);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);

        hotel.setAvailableRooms(hotel.getAvailableRooms() - 1);
        hotelRepository.save(hotel);

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingDTO.Response> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public BookingDTO.Response cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorised: This booking does not belong to you");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);

        Hotel hotel = booking.getHotel();
        hotel.setAvailableRooms(hotel.getAvailableRooms() + 1);
        hotelRepository.save(hotel);

        return toResponse(bookingRepository.save(booking));
    }

    private BookingDTO.Response toResponse(Booking booking) {
        BookingDTO.Response response = new BookingDTO.Response();
        response.setId(booking.getId());
        response.setHotelId(booking.getHotel().getId());
        response.setHotelName(booking.getHotel().getName());
        response.setHotelLocation(booking.getHotel().getLocation());
        response.setHotelImageUrl(booking.getHotel().getImageUrl());
        response.setCheckIn(booking.getCheckIn());
        response.setCheckOut(booking.getCheckOut());
        response.setTotalPrice(booking.getTotalPrice());
        response.setStatus(booking.getStatus().name());
        response.setCreatedAt(booking.getCreatedAt());
        return response;
    }
}
