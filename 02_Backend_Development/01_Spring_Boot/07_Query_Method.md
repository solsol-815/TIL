# Query Method

## 목차📑
- [Query Method](#query-method)
  - [목차📑](#목차)
  - [1. Query Method 개요](#1-query-method-개요)
    - [1.1 정의와 특징](#11-정의와-특징)
    - [1.2 장점](#12-장점)
  - [2. 메서드 명명 규칙](#2-메서드-명명-규칙)
    - [2.1 기본 구조](#21-기본-구조)
    - [2.2 주요 접두어](#22-주요-접두어)
  - [3. 조건자 키워드](#3-조건자-키워드)
    - [3.1 비교 연산](#31-비교-연산)
    - [3.2 논리 연산](#32-논리-연산)
    - [3.3 패턴 매칭](#33-패턴-매칭)
    - [3.4 Null 처리](#34-null-처리)
  - [4. 반환 타입](#4-반환-타입)
    - [4.1 컬렉션](#41-컬렉션)
    - [4.2 단일 결과](#42-단일-결과)
  - [5. 정렬과 페이징](#5-정렬과-페이징)
    - [5.1 정렬](#51-정렬)
    - [5.2 페이징](#52-페이징)
  - [6. 🔑 KeyPoints](#6--keypoints)

## 1. Query Method 개요
### 1.1 정의와 특징
메소드 이름만으로 JPA 쿼리를 생성하는 기능이다.
``` java
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByEmailAndName(String email, String name);
}
```
### 1.2 장점
- SQL 작성 없이 쿼리 생성
- 메서드 이름만으로 의도 파악 가능
- 컴파일 시점 오류 검증

## 2. 메서드 명명 규칙
### 2.1 기본 구조
``` java
find + [도메인] + By + [속성] + [조건자] + [정렬조건]
```
### 2.2 주요 접두어
``` java
// 조회
List<User> findByUsername(String username);
Optional<User> getByEmail(String email);

// 존재 여부
boolean existsByEmail(String email);

//  개수 조회
long countByAge(int age);

// 삭제
void deleteByUsername(String username);
```

## 3. 조건자 키워드
### 3.1 비교 연산
``` java
// 같음
User findByUsername(String username);

// 같지 않음
List<User> findByUsernameNot(String username);

// ~보다 큼/ 작음
List<User> findByAgeGreaterThan(int age);
List<User> findByLessThanEqual(int age);

// Between
List<User> findByAgeBetween(int starAge, int endAge);
```

### 3.2 논리 연산
``` java
// AND
List<User> findByEmailAndUsername(String email, String username);

// OR
List<User> findByEmailOrUsername(String email, String username);
```

### 3.3 패턴 매칭
``` java
// Like
List<User> findByNameLike(String pattern);

// Starts/Ends with
List<User> findByNameStartingWith(String prefix);
List<User> findByNameEndingWith(String suffix);

// Containing
List<User> findByEmailContaining(String keyword);
```

### 3.4 Null 처리
``` java
// NULL 체크
List<User> findByDeletedDateIsNull();
List<User> findByDeltetedDateIsNotNull();
```

## 4. 반환 타입
### 4.1 컬렉션
``` java
// 리스트
List<User> findByAge(int age);

// Set
Set<User> findByUsername(String username);

// Stream
Stream<User> findByEmailContaining(String keyword);
```

### 4.2 단일 결과
``` java
// Optional
Optional<User> findByEmail(String email);

// 엔티티
User getByUsername(String username);
```

## 5. 정렬과 페이징
### 5.1 정렬
``` java
//  메서드 이름으로 정렬
List<User> findByAgeOrderByUsernameDesc(int age);

// Sort 파라미터
List<User> findByAge(int age, Sort sort);

// 여러 정렬 조건
Sort sort = sort.by(
    Sort.Order.desc("createdAt"),
    Sort.Order.asc("username")
);
```

### 5.2 페이징
``` java
// Pageable 사용
Page<User> findByAge(int age, Pageable pageable);

// 페이지 요청
PageRequest pageRequest = PageRequest.of(0, 10, Sort.by("username).descending());
Page<User> userPage = userRepository.findByAge(20, pageRequest);

// 페이지 정보 활용
long totalElements = userPage.getTotalElements();   // 전체 건수
int totalPages = userPage.getTotalPages();  // 젠체 페이지 건수
List<User> users = userPage.getContent();   // 현재 페이지 데이터
```

## 6. 🔑 KeyPoints
핵심 사항
- 메서드 이름으로 쿼리 생성 규칙 준수
- 적절한 반환 타입 선택
- 페이징과 정렬 활용
- 동적 쿼리가 필요한 경우 QueryDSL 고려
- 복잡한 쿼리는 @Query 사용
- 성능 고려시 fetch join 활용