# Spring Boot 기본 개념 (Basic Concepts)

## 목차 📑
- [Spring Boot 기본 개념 (Basic Concepts)](#spring-boot-기본-개념-basic-concepts)
  - [목차 📑](#목차-)
  - [1. 개요](#1-개요)
  - [2. Spring Boot 주요 구성 요소](#2-spring-boot-주요-구성-요소)
    - [2.1 Starter](#21-starter)
    - [2.2 Auto Configuration (자동 구성)](#22-auto-configuration-자동-구성)
    - [2.3 SpringApplication](#23-springapplication)
  - [3. Spring Boot 프로젝트 구조](#3-spring-boot-프로젝트-구조)
  - [4. 핵심 애노테이션과 기능](#4-핵심-애노테이션과-기능)
    - [4.1 주요 애노테이션](#41-주요-애노테이션)
    - [4.2 의존성 주입 예시](#42-의존성-주입-예시)
  - [5. 자주 마주치는 문제점과 해결 방법](#5-자주-마주치는-문제점과-해결-방법)
    - [5.1 데이터베이스 연결 문제](#51-데이터베이스-연결-문제)
    - [5.2 빈 순환 참조 문제](#52-빈-순환-참조-문제)
    - [5.3 포트 충돌 문제](#53-포트-충돌-문제)
  - [6. 개발 시 Best Practices](#6-개발-시-best-practices)
  - [7. 🔑 Key Points](#7--key-points)


## 1. 개요
---------------------------------------------------
Spring Boot의 핵심 개념은 프로젝트 개발에서 생산성을 높이고, Spring Framework의 복잡한 설정을 최소화하는 데 중점을 둡니다.

> 💡 **Quick Summary**
> - 자동 설정을 통한 빠른 개발 환경 구축
> - 내장 서버를 통한 독립적인 실행
> - 의존성 관리 자동화
> - 복잡한 XML 설정 제거

## 2. Spring Boot 주요 구성 요소
---------------------------------------------------
### 2.1 Starter
* Spring Boot 프로젝트의 핵심 구성 요소로, 필요한 의존성을 손쉽게 추가할 수 있도록 도와줍니다.
* 예: `spring-boot-starter-web`, `spring-boot-starter-data-jpa` 등

**예시 코드:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### 2.2 Auto Configuration (자동 구성)
* Spring Boot는 의존성에 기반해 자동으로 설정을 수행합니다.
* 개발자는 복잡한 XML 설정 없이 애플리케이션을 실행할 수 있습니다.

**예시 코드:**
```properties
# application.properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=1234
```

### 2.3 SpringApplication
* Spring Boot 애플리케이션의 시작점을 정의하는 클래스입니다.
* `SpringApplication.run()` 메서드를 통해 애플리케이션을 실행합니다.

**예시 코드:**
```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

> 📌 **주요 기능 비교표**
> 
> | 기능 | 장점 | 단점 |
> |------|------|------|
> | Starter | - 의존성 자동 관리<br>- 버전 충돌 방지 | - 불필요한 의존성 포함 가능 |
> | Auto Configuration | - 빠른 개발 환경 구축<br>- 설정 간소화 | - 세부 설정 어려움<br>- 동작 원리 파악 어려움 |
> | 내장 서버 | - 독립적인 실행<br>- 배포 용이 | - 서버 커스터마이징 제한 |

## 3. Spring Boot 프로젝트 구조
---------------------------------------------------
```bash
src/
├── main/
│   ├── java/                    # Java 코드 디렉터리
│   │   └── com.example.demo/    # 애플리케이션 패키지
│   │       ├── controller/      # 컨트롤러 계층
│   │       ├── service/         # 서비스 계층
│   │       └── repository/      # 리포지토리 계층
│   └── resources/              # 리소스 파일 디렉터리
│       ├── application.properties # 설정 파일
│       └── static/             # 정적 리소스 (HTML, CSS, JS)
└── test/                      # 테스트 코드
```

## 4. 핵심 애노테이션과 기능
---------------------------------------------------
### 4.1 주요 애노테이션
```java
@SpringBootApplication  // 스프링 부트 시작점
@RestController        // REST API 컨트롤러
@Service              // 비즈니스 로직 처리
@Repository           // 데이터 접근 계층
```

### 4.2 의존성 주입 예시
```java
@Service
public class UserService {
    private final UserRepository userRepository;
    
    // 생성자 주입
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

## 5. 자주 마주치는 문제점과 해결 방법
---------------------------------------------------
### 5.1 데이터베이스 연결 문제
**문제:** 데이터베이스 연결 실패
```properties
# 해결방법: application.properties에서 설정 확인
spring.datasource.url=jdbc:mysql://localhost:3306/mydb?serverTimezone=UTC
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### 5.2 빈 순환 참조 문제
**문제:** 서로 참조하는 빈으로 인한 순환 참조
```java
// 해결방법: @Lazy 어노테이션 사용
@Service
public class ServiceA {
    private final ServiceB serviceB;
    
    public ServiceA(@Lazy ServiceB serviceB) {
        this.serviceB = serviceB;
    }
}
```

### 5.3 포트 충돌 문제
**문제:** 서버 시작 시 포트 충돌
```properties
# 해결방법: 다른 포트 지정
server.port=8081
```

## 6. 개발 시 Best Practices
---------------------------------------------------
1. **계층별 명확한 책임 분리**
   - Controller: 요청/응답 처리
   - Service: 비즈니스 로직
   - Repository: 데이터 접근

2. **적절한 예외 처리**
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                           .body("Error occurred: " + e.getMessage());
    }
}
```

3. **프로파일 활용**
```properties
# application-dev.properties
spring.jpa.show-sql=true

# application-prod.properties
spring.jpa.show-sql=false
```

## 7. 🔑 Key Points
---------------------------------------------------
- Spring Boot는 자동 구성과 생산성 향상에 중점을 둡니다
- 기본 설정만으로도 빠른 개발이 가능하며, 필요에 따라 세부 설정이 가능합니다
- 실제 개발 시 자주 발생하는 문제들에 대한 해결방법을 숙지하면 도움이 됩니다

> **주요 포인트**
> 1. 자동 구성의 원리 이해
> 2. 적절한 애노테이션 사용
> 3. 계층별 역할 구분
> 4. 문제 해결 능력 향상
