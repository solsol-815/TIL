# Spring Boot Best Practices

## 목차 📑
- [Spring Boot Best Practices](#spring-boot-best-practices)
  - [목차 📑](#목차-)
  - [1. 아키텍처 설계 원칙](#1-아키텍처-설계-원칙)
    - [1.1 계층형 아키텍처](#11-계층형-아키텍처)
    - [1.2 도메인 중심 설계](#12-도메인-중심-설계)
  - [2. 설정 관리](#2-설정-관리)
    - [2.1 프로파일 기반 설정](#21-프로파일-기반-설정)
    - [2.2 외부 설정 관리](#22-외부-설정-관리)
  - [3. 코드 품질](#3-코드-품질)
    - [3.1 예외 처리](#31-예외-처리)
    - [3.2 테스트 작성](#32-테스트-작성)
  - [4. 성능 최적화](#4-성능-최적화)
    - [4.1 데이터베이스 최적화](#41-데이터베이스-최적화)
    - [4.2 캐싱 전략](#42-캐싱-전략)
  - [5. 보안 설정](#5-보안-설정)
    - [5.1 Spring Security 설정](#51-spring-security-설정)
    - [5.2 CSRF 및 CORS](#52-csrf-및-cors)
  - [6. 모니터링과 로깅](#6-모니터링과-로깅)
    - [6.1 Actuator 설정](#61-actuator-설정)
    - [6.2 로깅 전략](#62-로깅-전략)
  - [7. 🔑 Key Points](#7--key-points)

## 1. 아키텍처 설계 원칙
---------------------------------------------------

### 1.1 계층형 아키텍처

✅ **체크리스트**
- [ ] Controller, Service, Repository 계층 분리
- [ ] 각 계층의 책임 명확화
- [ ] DTO와 Entity 분리
- [ ] 비즈니스 로직은 Service 계층에만 구현

**👎 Bad Practice:**
```java
@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;  // 직접 Repository 접근

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);   // 비즈니스 로직 없음
    }
}
```

**👍 Good Practice:**
```java
@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/users")
    public UserResponseDto createUser(@Valid @RequestBody UserRequestDto request) {
        return userService.createUser(request);
    }
}

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    
    @Transactional
    public UserResponseDto createUser(UserRequestDto request) {
        // 비즈니스 로직 구현
        validateUserEmail(request.getEmail());
        User user = request.toEntity();
        user = userRepository.save(user);
        return UserResponseDto.from(user);
    }
}
```

### 1.2 도메인 중심 설계
```java
// Entity
@Entity
@Table(name = "users")
@Getter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String email;
    
    private String password;
    
    // 도메인 로직
    public void updatePassword(String newPassword) {
        validatePassword(newPassword);
        this.password = newPassword;
    }
}

// DTO
@Getter
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String email;
    
    public static UserResponseDto from(User user) {
        return new UserResponseDto(user.getId(), user.getEmail());
    }
}
```

## 2. 설정 관리
---------------------------------------------------

### 2.1 프로파일 기반 설정

```yaml
# application.yml
spring:
  profiles:
    active: local

---
# application-local.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    
---
# application-prod.yml
spring:
  datasource:
    url: jdbc:mysql://production-db:3306/myapp
```

### 2.2 외부 설정 관리

```java
@Configuration
@ConfigurationProperties(prefix = "app")
@Validated
public class AppProperties {
    @NotNull
    private String apiKey;
    
    private int maxRetries = 3;  // 기본값 설정
    
    // getters, setters
}
```

## 3. 코드 품질
---------------------------------------------------

### 3.1 예외 처리

**👎 Bad Practice:**
```java
try {
    // 비즈니스 로직
} catch (Exception e) {
    e.printStackTrace();  // 절대 금지!
}
```

**👍 Good Practice:**
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        log.error("Business error occurred: {}", e.getMessage(), e);
        return ResponseEntity.badRequest().body(new ErrorResponse(e.getErrorCode(), e.getMessage()));
    }
}
```

### 3.2 테스트 작성

```java
@SpringBootTest
class UserServiceTest {
    @MockBean
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    @Test
    void createUser_WithValidInput_ShouldSucceed() {
        // Given
        UserRequestDto request = new UserRequestDto("test@email.com", "password");
        when(userRepository.save(any())).thenReturn(new User(1L, "test@email.com"));
        
        // When
        UserResponseDto response = userService.createUser(request);
        
        // Then
        assertNotNull(response);
        assertEquals("test@email.com", response.getEmail());
    }
}
```

## 4. 성능 최적화
---------------------------------------------------

### 4.1 데이터베이스 최적화

```properties
# application.properties

# 커넥션 풀 설정
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5

# JPA 설정
spring.jpa.properties.hibernate.jdbc.batch_size=50
spring.jpa.properties.hibernate.order_inserts=true
```

### 4.2 캐싱 전략

```java
@Service
public class ProductService {
    private final ProductRepository productRepository;
    
    @Cacheable(value = "products", key = "#id", unless = "#result == null")
    public ProductDto getProduct(Long id) {
        return productRepository.findById(id)
            .map(ProductDto::from)
            .orElse(null);
    }
    
    @CacheEvict(value = "products", key = "#id")
    public void updateProduct(Long id, ProductDto dto) {
        // 업데이트 로직
    }
}
```

## 5. 보안 설정
---------------------------------------------------

### 5.1 Spring Security 설정

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf()
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            .and()
            .authorizeRequests()
                .antMatchers("/public/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }
}
```

### 5.2 CSRF 및 CORS

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("https://trusted-domain.com")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

## 6. 모니터링과 로깅
---------------------------------------------------

### 6.1 Actuator 설정

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  endpoint:
    health:
      show-details: always
```

### 6.2 로깅 전략

```xml
<!-- logback-spring.xml -->
<configuration>
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/application.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/application-%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>
</configuration>
```

## 7. 🔑 Key Points
---------------------------------------------------

> **주요 포인트**
> 1. 명확한 계층 구조와 책임 분리
> 2. 환경별 설정 분리와 외부 설정 관리
> 3. 체계적인 예외 처리와 로깅
> 4. 성능과 보안을 고려한 설정
> 5. 테스트 자동화와 문서화