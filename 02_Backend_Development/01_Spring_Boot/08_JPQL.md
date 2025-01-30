# 📚 JPQL(Java Persistence Query Language)

## 목차📑
- [📚 JPQL(Java Persistence Query Language)](#-jpqljava-persistence-query-language)
  - [목차📑](#목차)
  - [1. JPQL 개요](#1-jpql-개요)
    - [1.1 정의와 특징](#11-정의와-특징)
    - [1.2 SQL과의 차이점](#12-sql과의-차이점)
  - [2. 기본 문법](#2-기본-문법)
    - [2.1 기본 **SELECT**문](#21-기본-select문)
    - [2.2 파라미터 바인딩](#22-파라미터-바인딩)
  - [3. 주요 기능](#3-주요-기능)
    - [3.1 집계 함수](#31-집계-함수)
    - [3.2 그룹화와 정렬](#32-그룹화와-정렬)
    - [페이징 처리](#페이징-처리)
  - [4. 고급 쿼리](#4-고급-쿼리)
    - [4.1 JOIN](#41-join)
    - [4.2 서브쿼리](#42-서브쿼리)
    - [4.3 **CASE**문](#43-case문)
  - [5. 성능 최적화](#5-성능-최적화)
    - [5.1 벌크 연산](#51-벌크-연산)
    - [5.2 **Fetch Join** 최적화](#52-fetch-join-최적화)
    - [5.3 **DTO** 직접 조회](#53-dto-직접-조회)
  - [6. 🔑 Key Points](#6--key-points)

## 1. JPQL 개요
### 1.1 정의와 특징
- 객체 지향 쿼리 언어
- 테이블이 아닌 엔티티 객체를 대상으로 쿼리
- SQL과 유사한 문법
  
### 1.2 SQL과의 차이점
- **JPQL**: 엔티티 객체를 대상으로 쿼리
- **SQL**: 데이터베이스 테이블을 대상으로 쿼리

## 2. 기본 문법
### 2.1 기본 **SELECT**문
```java
@Query("SELECT u FROM User u WHERE u.username = :username")
User findByUsername(@Param("username") String username);
```

### 2.2 파라미터 바인딩
```java
// 이름 기반(:)
@Query("SELECT u FROM User u WHERE u.username = :username AND u.age > :age")
List<User> findByUsernameAndAge(
    @Param("usernmae") String username,
    @Param("age") int age
);

// 위치 기반(?)
@Query("SELECT u FROM User u WHERE u.username = ?1 AND u.age > ?2")
List<User> findByUsernameAndAge(String username, int age);
```

## 3. 주요 기능
### 3.1 집계 함수
```java
// COUNT
@Query("SELECT COUNT(u) FROM User u")
long getUserCount();

// AVG, SUM
@Query("SELECT AVG(u.age) FROM User u")
double getAverageAge();
```

### 3.2 그룹화와 정렬
```java
@Query("SELECT u.age, COUNT(u) FROM User u GROUP BY u.age Having u.age >= :age")
List<Object[]>getUserCountByAge(@Param("age") int age);

@Query("SELECT u FROM User u OREDER BY u.username ASC, u.age DESC")
List<User> findALLOrderByUsernameAscAgeDesc();
```

### 페이징 처리
```java
@Query("SELECT u FROM User u WHERE u.age > :age")
Page<User> findByAge(@Param("age") int age, Pageable pageable);
```

## 4. 고급 쿼리
### 4.1 JOIN
```java
// Inner Join
@Query("SELECT o FROM Order o JOIN o.user u WHERE u.username = :username")
List<Order> findOrdersByUsername(@Param("username") String username);

// Left Join
@Query("SELECT u FROM User u LEFT JOIN u.orders o")
List<User> findAllWithOrders();

// Fetch Join
@Query("SELECT u FROM User u LEFT JOIN FETCH u.orders")
List<User> findAllWithOrdersFetch();
```

### 4.2 서브쿼리
```java
@Query("SELECT u FROM User u " +
        "WHERE u.age > (SELECT AVG(u2.age) FROM User u2)")
List<User> findUsersOlderThanAverage();
```

### 4.3 **CASE**문
```java
@Query("SELECT u.username, " +
        "CASE WHEN u.age >= 20 THEN '성인' " +
        "   ELSE '미성년자' END " +
        "FROM User u")
List<Object[]> getUserAgeStatus();
```

## 5. 성능 최적화
### 5.1 벌크 연산
```java
@Modifying // 데이터 변경 쿼리임을 나타냄
@Query("UPDATE User u SET u.status = :status " +
        "WHERE u.lastLoginDate < :date")
int updateUserStatus(
    @Param("status") String status,
    @Param("date") LocalDateTime date
);
```

### 5.2 **Fetch Join** 최적화
```java
// N+1 문제 해결(연관된 엔티티를 한 번의 쿼리로 가져오기)
@Query("SELECT DISTINCT u FROM User u " +
        "LEFT JOIN FETCH u.orders " +
        "LEFT JOIN FETCH u.address")
List<User> findAllWithOrdersAndAddress();
```

### 5.3 **DTO** 직접 조회
```java
@Query("SELECT new com.example.UserDTO(u.id, u.username, u.age) " +
        "FROM User u WHERE u.age > :age")
List<UserDTO> findUserDTOsByAge(@Param("age") int age);
```

## 6. 🔑 Key Points
> 핵심 포인트
> - 엔티티 객체 기반 쿼리 작성
> - 적절한 파라미터 바인딩 사용
> - N+1 문제는 **Fetch Join**으로 해결
> - 성능 최적화가 필요한 경우 **DTO** 직접 조회
> - 대량 데이터 처리는 벌크 연산 활용
> - 동적 쿼리가 필요한 경우 **QueryDSL** 고려
> - **Named Query** 활용으로 재사용성 향상