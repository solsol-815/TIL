# Spring Boot 소개 (Introduction)

## 목차 📑
- [Spring Boot 소개 (Introduction)](#spring-boot-소개-introduction)
  - [목차 📑](#목차-)
  - [1. Spring Boot 개요](#1-spring-boot-개요)
    - [1.1 핵심 특징](#11-핵심-특징)
  - [2. Spring Framework vs Spring Boot](#2-spring-framework-vs-spring-boot)
    - [2.1 아키텍처 비교](#21-아키텍처-비교)
    - [2.2 코드 비교](#22-코드-비교)
  - [3. 시작하기 (Getting Started)](#3-시작하기-getting-started)
    - [3.1 개발 환경 설정](#31-개발-환경-설정)
    - [3.2 기본 설정](#32-기본-설정)
  - [4. 실전 적용 및 문제 해결](#4-실전-적용-및-문제-해결)
    - [4.1 자주 발생하는 문제와 해결방안](#41-자주-발생하는-문제와-해결방안)
    - [4.2 성능 최적화](#42-성능-최적화)
  - [5. 실습 예제 (Try it yourself)](#5-실습-예제-try-it-yourself)
    - [5.1 간단한 REST API 만들기](#51-간단한-rest-api-만들기)
    - [5.2 JUnit 테스트 작성](#52-junit-테스트-작성)
  - [6. Best Practices(모범 사례)](#6-best-practices모범-사례)
  - [7. 🔑 Key Points](#7--key-points)

## 1. Spring Boot 개요
---------------------------------------------------

Spring Boot는 Spring Framework를 기반으로 실제 동작 가능한 독립형 애플리케이션을 빠르게 작성할 수 있도록 도와주는 도구입니다.

### 1.1 핵심 특징
1. **자동 구성 (Auto Configuration)**
   - 프로젝트 의존성 기반 자동 설정
   - 복잡한 설정 없이 즉시 시작 가능
   - 개발자의 설정 부담 최소화

2. **독립적 실행**
   - 내장 서버(Tomcat, Jetty, Undertow) 포함
   - 별도의 웹 서버 설치 불필요
   - jar 파일로 간단히 실행 가능

> 💡 **Quick Start**
```bash
# Spring Boot 애플리케이션 실행
java -jar myapplication.jar

# 프로파일 설정 실행
java -jar -Dspring.profiles.active=prod myapplication.jar
```

## 2. Spring Framework vs Spring Boot
---------------------------------------------------

### 2.1 아키텍처 비교

| 구분 | Spring Framework | Spring Boot |
|------|-----------------|-------------|
| 설정 | 수동, XML 기반 | 자동, Java/Properties 기반 |
| 서버 | 외부 WAS 필요 | 내장 서버 |
| 의존성 | 수동 관리 | 자동 관리 (Starter) |
| 개발 속도 | 상대적으로 느림 | 빠름 |
| 유연성 | 높음 | 제한적 |

### 2.2 코드 비교

**Spring Framework (Traditional)**:
```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    @Bean
    public ViewResolver viewResolver() {
        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/views/");
        resolver.setSuffix(".jsp");
        return resolver;
    }
}
```

**Spring Boot (Simplified)**:
```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

## 3. 시작하기 (Getting Started)
---------------------------------------------------

### 3.1 개발 환경 설정
```xml
<!-- Maven pom.xml -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.0</version>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

### 3.2 기본 설정
```properties
# application.properties
# 서버 설정
server.port=8080
server.servlet.context-path=/api

# 데이터베이스 설정
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=password
```

## 4. 실전 적용 및 문제 해결
---------------------------------------------------

### 4.1 자주 발생하는 문제와 해결방안

1. **포트 충돌**
```properties
# 포트 변경
server.port=8081
```

2. **데이터베이스 연결 오류**
```properties
# SSL 설정 추가
spring.datasource.url=jdbc:mysql://localhost:3306/mydb?useSSL=false
```

3. **정적 리소스 처리**
```properties
# 정적 리소스 경로 설정
spring.mvc.static-path-pattern=/resources/**
```

### 4.2 성능 최적화
```yaml
# application.yml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        jdbc:
          batch_size: 50
  cache:
    type: caffeine
```

## 5. 실습 예제 (Try it yourself)
---------------------------------------------------

### 5.1 간단한 REST API 만들기
```java
@RestController
@RequestMapping("/api")
public class HelloController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Hello Spring Boot!";
    }
    
    @GetMapping("/info")
    public Map<String, String> getInfo() {
        return Map.of(
            "framework", "Spring Boot",
            "version", "2.7.0",
            "status", "running"
        );
    }
}
```

### 5.2 JUnit 테스트 작성
```java
@SpringBootTest
class HelloControllerTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void helloTest() {
        String response = restTemplate.getForObject("/api/hello", String.class);
        assertEquals("Hello Spring Boot!", response);
    }
}
```

## 6. Best Practices(모범 사례)
---------------------------------------------------

1. **프로파일 기반 설정**
```properties
# application-dev.properties
logging.level.root=DEBUG

# application-prod.properties
logging.level.root=ERROR
```

2. **효율적인 의존성 관리**
```xml
<!-- 필요한 starter만 추가 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

3. **액추에이터 활용**
```properties
# 운영 모니터링 설정
management.endpoints.web.exposure.include=health,metrics,info
```

## 7. 🔑 Key Points
---------------------------------------------------

> **주요 포인트**
> - Spring Boot는 Spring Framework의 확장이며 대체제가 아님
> - 자동 구성과 내장 서버로 빠른 개발 가능
> - 상황에 맞는 적절한 설정과 최적화 필요
> - 실제 문제 해결 능력이 중요