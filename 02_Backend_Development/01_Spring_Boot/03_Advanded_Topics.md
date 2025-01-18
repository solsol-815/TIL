# Spring Boot 심화 개념 (Advanced Topics)

## 목차 📑
- [Spring Boot 심화 개념 (Advanced Topics)](#spring-boot-심화-개념-advanced-topics)
  - [목차 📑](#목차-)
  - [1. Spring Security 구현](#1-spring-security-구현)
    - [1.1 기본 보안 설정](#11-기본-보안-설정)
    - [1.2 JWT 인증 구현 예시](#12-jwt-인증-구현-예시)
  - [2. 캐싱 전략](#2-캐싱-전략)
    - [2.1 다중 캐시 관리](#21-다중-캐시-관리)
    - [2.2 실제 캐시 사용 예시](#22-실제-캐시-사용-예시)
  - [3. 성능 최적화](#3-성능-최적화)
    - [3.1 데이터베이스 최적화](#31-데이터베이스-최적화)
    - [3.2 Actuator 모니터링 설정](#32-actuator-모니터링-설정)
  - [4. 테스트 전략](#4-테스트-전략)
    - [4.1 계층별 테스트](#41-계층별-테스트)
    - [4.2 통합 테스트](#42-통합-테스트)
  - [5. 배포 전략](#5-배포-전략)
    - [5.1 Docker 배포](#51-docker-배포)
    - [5.2 운영 환경 설정](#52-운영-환경-설정)
  - [6. 성능 튜닝 체크리스트](#6-성능-튜닝-체크리스트)
  - [🔑 Key Points](#-key-points)

## 1. Spring Security 구현
---------------------------------------------------

### 1.1 기본 보안 설정

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/public/**").permitAll()
                .antMatchers("/api/**").authenticated()
            .and()
                .formLogin()
                .loginPage("/login")
                .permitAll()
            .and()
                .logout()
                .logoutSuccessUrl("/");
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
            .withUser("admin")
            .password(passwordEncoder().encode("adminPass"))
            .roles("ADMIN");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

> 💡 **Security Best Practices**
> - HTTPS 사용 필수
> - 비밀번호 암호화 저장
> - JWT 토큰 사용시 만료 시간 설정
> - Role 기반 접근 제어 구현

### 1.2 JWT 인증 구현 예시

```java
@Service
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String secretKey;
    
    private long validityInMilliseconds = 3600000; // 1h

    public String createToken(String username, List<String> roles) {
        Claims claims = Jwts.claims().setSubject(username);
        claims.put("roles", roles);

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(now)
            .setExpiration(validity)
            .signWith(SignatureAlgorithm.HS256, secretKey)
            .compact();
    }
}
```

## 2. 캐싱 전략
---------------------------------------------------

### 2.1 다중 캐시 관리

```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        
        // 여러 캐시 설정
        GuavaCache usersCache = new GuavaCache("users", 
            CacheBuilder.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .build());
                
        GuavaCache productsCache = new GuavaCache("products",
            CacheBuilder.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .build());
                
        cacheManager.setCaches(Arrays.asList(usersCache, productsCache));
        return cacheManager;
    }
}
```

### 2.2 실제 캐시 사용 예시

```java
@Service
public class ProductService {
    
    @Cacheable(value = "products", key = "#id")
    public Product getProduct(Long id) {
        // 실제 DB 조회 로직
        return productRepository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));
    }
    
    @CacheEvict(value = "products", key = "#id")
    public void updateProduct(Long id, Product product) {
        // 업데이트 로직
    }
}
```

## 3. 성능 최적화
---------------------------------------------------

### 3.1 데이터베이스 최적화

```properties
# application.properties

# HikariCP 설정
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.max-lifetime=1200000

# JPA 최적화
spring.jpa.properties.hibernate.jdbc.batch_size=50
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
```

### 3.2 Actuator 모니터링 설정

```properties
# Actuator 설정
management.endpoints.web.exposure.include=health,metrics,prometheus
management.endpoint.health.show-details=always
management.metrics.tags.application=${spring.application.name}
```

> 📊 **모니터링 지표**
> - CPU 사용량
> - 메모리 사용량
> - 스레드 상태
> - HTTP 요청 처리 시간
> - 데이터베이스 커넥션 풀 상태

## 4. 테스트 전략
---------------------------------------------------

### 4.1 계층별 테스트

```java
@SpringBootTest
class UserServiceTest {
    
    @Autowired
    private UserService userService;
    
    @MockBean
    private UserRepository userRepository;
    
    @Test
    void createUser_ValidInput_Success() {
        // Given
        UserDto userDto = new UserDto("test@email.com", "password");
        User user = new User(1L, "test@email.com", "encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(user);
        
        // When
        User result = userService.createUser(userDto);
        
        // Then
        assertNotNull(result);
        assertEquals(user.getId(), result.getId());
    }
}
```

### 4.2 통합 테스트

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class UserControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void createUser_ValidInput_Returns201() {
        // Given
        UserDto userDto = new UserDto("test@email.com", "password");
        
        // When
        ResponseEntity<User> response = restTemplate.postForEntity(
            "/api/users",
            userDto,
            User.class
        );
        
        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
    }
}
```

## 5. 배포 전략
---------------------------------------------------

### 5.1 Docker 배포

```dockerfile
# Dockerfile
FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 5.2 운영 환경 설정

```yaml
# application-prod.yml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST}:3306/${DB_NAME}
    username: ${DB_USER}
    password: ${DB_PASS}
  
  redis:
    host: ${REDIS_HOST}
    port: 6379
    
logging:
  level:
    root: INFO
    org.springframework.web: WARN
    com.myapp: INFO
```

## 6. 성능 튜닝 체크리스트
---------------------------------------------------

✅ **메모리 최적화**
- JVM 힙 메모리 설정
- GC 튜닝
- 메모리 누수 모니터링

✅ **데이터베이스 최적화**
- 인덱스 설계
- 쿼리 최적화
- 커넥션 풀 설정

✅ **캐시 전략**
- 적절한 캐시 레벨 선택
- 캐시 만료 정책 설정
- 분산 캐시 고려

## 🔑 Key Points
---------------------------------------------------

> **주요 포인트**
> 1. 보안은 애플리케이션의 기본
> 2. 캐싱은 성능 향상의 핵심
> 3. 테스트는 품질 보증의 기본
> 4. 모니터링은 운영의 필수 요소
> 5. 배포 자동화로 운영 효율성 향상