
@Entity
@Table(name = "bookings")
public class Bookings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @Column(nullable = false)
    private LocalDate checkInDate;

    @Column(nullable = false)
    private LocalDate checkOutDate;
    
    @Column(nullable = false)
    private double totalPrice;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum BookingStatus {
        PENDING,
        CONFIRMED,
        CANCELLED
    }

    // Constructors, getters, and setters
    public Bookings() {
    }

    public Bookings(User user, Hotel hotel, LocalDate checkInDate, LocalDate checkOutDate, double totalPrice) {
        this.user = user;
        this.hotel = hotel;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.totalPrice = totalPrice;
    }
    

}