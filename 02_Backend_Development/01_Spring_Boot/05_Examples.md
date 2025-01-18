# Spring Boot 실전 예제

## 목차 📑
- [Spring Boot 실전 예제](#spring-boot-실전-예제)
  - [목차 📑](#목차-)
  - [1. 기본 애플리케이션 구조 이해하기](#1-기본-애플리케이션-구조-이해하기)
    - [1.1 핵심 구성요소](#11-핵심-구성요소)
    - [1.2 REST API 구현](#12-rest-api-구현)
  - [2. 데이터베이스 연동](#2-데이터베이스-연동)
    - [2.1 JPA 활용](#21-jpa-활용)
    - [2.2 Repository 패턴](#22-repository-패턴)
  - [3. Security 구현](#3-security-구현)
    - [3.1 인증/인가 설정](#31-인증인가-설정)
  - [4. 외부 API 연동](#4-외부-api-연동)
    - [4.1 RestTemplate 활용](#41-resttemplate-활용)
  - [5. 파일 처리](#5-파일-처리)
    - [5.1 업로드 구현](#51-업로드-구현)
  - [6. 오늘 배운 점](#6-오늘-배운-점)

## 1. 기본 애플리케이션 구조 이해하기

### 1.1 핵심 구성요소
오늘 배운 중요한 점은 Spring Boot 애플리케이션의 시작점인 `@SpringBootApplication`의 실제 동작 방식입니다.

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

🔍 **주요 인사이트**:
- `@SpringBootApplication`은 세 가지 주요 애노테이션을 포함합니다:
  - `@Configuration`
  - `@EnableAutoConfiguration`
  - `@ComponentScan`
- 이를 통해 자동 설정과 컴포넌트 스캔이 한번에 이루어짐을 배웠습니다.

### 1.2 REST API 구현
REST API 구현 시 `@RestController`를 사용하는 실제 사례를 학습했습니다.

```java
@RestController
public class HelloController {
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, Spring Boot!";
    }
}
```

💡 **배운 점**:
- `@RestController`는 `@Controller`와 `@ResponseBody`를 합친 것
- HTTP 메서드별 애노테이션의 실제 활용 방법
- REST API 설계 시 고려사항

## 2. 데이터베이스 연동

### 2.1 JPA 활용
JPA를 사용한 데이터베이스 연동에서 가장 중요한 설정들을 배웠습니다.

```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.hibernate.ddl-auto=update
```

⚠️ **주의사항**:
- `ddl-auto=update`는 개발 환경에서만 사용
- 운영 환경에서는 `validate` 사용 권장
- 데이터베이스 연결 풀 설정의 중요성

### 2.2 Repository 패턴
JPA Repository를 활용한 데이터 접근 계층 구현 방법을 학습했습니다.

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    @Query("SELECT u FROM User u WHERE u.active = true")
    List<User> findActiveUsers();
}
```

🌟 **실용적인 팁**:
- 메서드 이름으로 쿼리 생성 규칙 활용
- `@Query` 애노테이션으로 복잡한 쿼리 처리
- Optional을 활용한 null 처리의 안전성

## 3. Security 구현

### 3.1 인증/인가 설정
실제 프로젝트에서 많이 사용되는 Security 설정 방법을 배웠습니다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/api/public/**").permitAll()
                .antMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            .and()
                .formLogin()
                .loginProcessingUrl("/api/login");
    }
}
```

🔑 **Key Points**:
- URL 기반의 권한 설정 방법
- CSRF 보안과 예외 처리
- 로그인 프로세스 커스터마이징

## 4. 외부 API 연동

### 4.1 RestTemplate 활용
외부 API 호출 시 효율적인 RestTemplate 사용법을 학습했습니다.

```java
@Component
@RequiredArgsConstructor
public class ExternalApiClient {
    private final RestTemplate restTemplate;

    public UserResponse getUser(Long id) {
        return restTemplate.getForObject(
            "https://api.example.com/users/{id}",
            UserResponse.class,
            id
        );
    }
}
```

📍 **실무 적용 팁**:
- 타임아웃 설정의 중요성
- 에러 핸들링 전략
- API 응답 캐싱 고려사항

## 5. 파일 처리

### 5.1 업로드 구현
대용량 파일 업로드 처리 방법을 배웠습니다.

```java
@PostMapping("/upload")
public ResponseEntity<String> uploadFile(
    @RequestParam("file") MultipartFile file) {
    
    if (file.isEmpty()) {
        return ResponseEntity.badRequest().body("File is empty");
    }

    try {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        Path path = Paths.get(uploadDir + fileName);
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        return ResponseEntity.ok("File uploaded successfully");
    } catch (IOException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                           .body("Failed to upload file");
    }
}
```

🔍 **중요 학습 사항**:
- 파일 이름 보안 처리
- 업로드 크기 제한 설정
- 예외 처리의 중요성

## 6. 오늘 배운 점
1. Spring Boot의 다양한 기능들이 실제 프로젝트에서 어떻게 활용되는지 이해했습니다.
2. 각 기능별 보안 고려사항과 최적화 방법을 배웠습니다.
3. 실제 개발 시 발생할 수 있는 문제들과 해결 방법을 익혔습니다.

🎯 **앞으로 학습할 내용**:
- 비동기 처리 방법
- 테스트 코드 작성
- 성능 모니터링과 최적화