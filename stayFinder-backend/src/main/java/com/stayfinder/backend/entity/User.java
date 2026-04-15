
@Entity
@Table(name = "users")
public Class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    // role ENUM('USER', 'ADMIN') DEFAULT 'USER', - create this feild using java enum
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum Role {
        USER,
        ADMIN
    }
    // Constructors, getters, and setters
}