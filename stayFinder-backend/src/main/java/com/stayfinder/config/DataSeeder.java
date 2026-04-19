package com.stayfinder.config;

import com.stayfinder.entity.Amenity;
import com.stayfinder.entity.Hotel;
import com.stayfinder.entity.User;
import com.stayfinder.repository.HotelRepository;
import com.stayfinder.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      HotelRepository hotelRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedHotels();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@stayfinder.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);

        User john = new User();
        john.setName("John Doe");
        john.setEmail("john@example.com");
        john.setPassword(passwordEncoder.encode("user123"));
        john.setRole(User.Role.USER);

        userRepository.saveAll(List.of(admin, john));
        System.out.println("✅ Users seeded — admin@stayfinder.com / admin123");
    }

    private void seedHotels() {
        if (hotelRepository.count() > 0) return;

        hotelRepository.saveAll(List.of(
            buildHotel("The Grand Hyderabad", "Hyderabad",
                "Luxury 5-star hotel in the heart of Hyderabad with world-class amenities and stunning city views.",
                "4500.00", 4.8, 120, 45,
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                "Free Wi-Fi", "Swimming Pool", "Gym", "Spa", "Restaurant", "Room Service"),

            buildHotel("Seaside Residency", "Goa",
                "Beachfront property with direct ocean access, perfect for a relaxing coastal getaway.",
                "3200.00", 4.5, 80, 20,
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
                "Beach Access", "Free Wi-Fi", "Swimming Pool", "Bar", "Water Sports"),

            buildHotel("Metro Stay Mumbai", "Mumbai",
                "Modern business hotel located near BKC with easy access to major corporate hubs.",
                "2800.00", 4.2, 200, 90,
                "https://images.unsplash.com/photo-1551882547-ff40c4fe1fa7?w=800",
                "Free Wi-Fi", "Business Centre", "Gym", "Restaurant", "Parking"),

            buildHotel("Heritage Palace Jaipur", "Jaipur",
                "A royal heritage property offering an authentic Rajasthani experience with modern comforts.",
                "6000.00", 4.9, 60, 10,
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
                "Heritage Tours", "Swimming Pool", "Spa", "Restaurant", "Free Wi-Fi", "Cultural Events"),

            buildHotel("Budget Inn Bangalore", "Bangalore",
                "Clean and comfortable budget accommodation near Koramangala, ideal for solo travellers.",
                "1200.00", 3.8, 50, 30,
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
                "Free Wi-Fi", "Breakfast", "Parking"),

            buildHotel("Mountain View Resort", "Manali",
                "Scenic mountain resort with breathtaking Himalayan views and adventure activity packages.",
                "5500.00", 4.6, 40, 15,
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
                "Mountain View", "Trekking Packages", "Bonfire", "Restaurant", "Free Wi-Fi", "Parking")
        ));

        System.out.println("✅ Hotels seeded — 6 sample hotels added");
    }

    private Hotel buildHotel(String name, String location, String description,
                              String price, double rating, int totalRooms, int availableRooms,
                              String imageUrl, String... amenityNames) {
        Hotel hotel = new Hotel();
        hotel.setName(name);
        hotel.setLocation(location);
        hotel.setDescription(description);
        hotel.setPricePerNight(new BigDecimal(price));
        hotel.setRating(rating);
        hotel.setTotalRooms(totalRooms);
        hotel.setAvailableRooms(availableRooms);
        hotel.setImageUrl(imageUrl);

        List<Amenity> amenities = new ArrayList<>();
        for (String amenityName : amenityNames) {
            amenities.add(new Amenity(hotel, amenityName));
        }
        hotel.setAmenities(amenities);

        return hotel;
    }
}
