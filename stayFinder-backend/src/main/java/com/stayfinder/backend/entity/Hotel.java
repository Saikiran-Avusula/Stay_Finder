
@Entity
@Table(name = "hotels")
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(length = 1000, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private double pricePerNight;

    private double rating=0.0; // average rating calculated from reviews, so default is 0.0

    private availableRooms;

    private String imageUrl;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Amenities> amenities;

    @CreationTimestamp
    private LocalDateTime createdAt;


    // Constructors, getters, and setters
}