# QueryDSL

## 📑 목차
- [QueryDSL](#querydsl)
  - [📑 목차](#-목차)
  - [1. QueryDSL 개요](#1-querydsl-개요)
    - [1.1 주요 특징](#11-주요-특징)
    - [1.2 기존 방식과 비교](#12-기존-방식과-비교)
  - [2. 설정 방법](#2-설정-방법)
    - [2.1 **Gradle** 설정](#21-gradle-설정)
  - [2.2 **Config** 설정](#22-config-설정)
  - [3. 리포지토리 구조](#3-리포지토리-구조)
  - [4. 기본 문법과 활용](#4-기본-문법과-활용)
    - [4.1 동적 쿼리 작성](#41-동적-쿼리-작성)
    - [4.2 복합 정렬 처리](#42-복합-정렬-처리)
    - [4.3 페이징 최적화](#43-페이징-최적화)
  - [5. 성능 최적화](#5-성능-최적화)
    - [5.1 N+1 문제 해결](#51-n1-문제-해결)
    - [5.2 서브쿼리 최적화](#52-서브쿼리-최적화)
    - [5.3 벌크 연산과 영속선 컨텍스트](#53-벌크-연산과-영속선-컨텍스트)
    - [6. 테스트 작성과 주의사항](#6-테스트-작성과-주의사항)
  - [6.2 버전별 주의사항](#62-버전별-주의사항)
  - [7. 🔑 Key Points](#7--key-points)

## 1. QueryDSL 개요
### 1.1 주요 특징
- 타입 안정성 (컴파일 시점 오류 검증)
- 동적 쿼리 작성의 복잡성 해결
- JPQL의 문자열 기반 쿼리의 한계 극복
- IDE의 자동 완성 지원으로 생산성 향상
- JPA와의 완벽한 호환성

### 1.2 기존 방식과 비교
```java
// JPQL 방식
@Query("SELECT u FROM User u WHERE u.username = :username AND u.age > :age")
List<User> findUser(@Param("username") String username, @Param("age") int age);

// QueryDSL 방식
public List<User> findUser(String username, Integer age) {
    return queryFactory
        .selectFrom(user)
        .where(
            usernameEq(username),
            ageGt(age)
        )
        .fetch();
}
```

## 2. 설정 방법
### 2.1 **Gradle** 설정
```gradle
plugins {
    id 'com.ewerk.gradle.plugins.querydsl' version '1.0.10'
}

dependencies {
    implementation 'com.querydsl:querydsl-jpa:5.0.0'
    annotationProcessor 'com.querydsl:querydsl-apt:5.0.0:jpa'
    implementation 'com.querydsl:querydsl-sql:5.0.0'
}

def querydslDir = '$buildDir/generated/querydsl'
querydsl {
    jpa = true
    querydslSourcesDir = querydslDir
}
```

## 2.2 **Config** 설정
```java
@Configuration
public class QuerydslConfig {

    @PersistenceContext
    private EntityManage entityManager;

    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        // 스레드 세이프한 EntityManager 주입
        return new JPAQueryFactory(entityManager);
    }
}
```

## 3. 리포지토리 구조
```java
// 커스텀 인터페이스 - QueryDSL 전용 메서드 정의
public interface UserRepositoryCustom {
    List<User> findByUserTest();
}

// 구현체 - 실제 QueryDSL 로직 구현
@RequiredArgsConstructor
public class UserRepositoryCustomImpl implements UserRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<User> findByUserTest() {
        return queryFactory
            .selectFrom(user)
            .where(user.userId.eq("testId"))
            .fetch();
    }
}

// JPA 리포지토리와 통합 - 기본 JPA + QueryDSL 커스텀 기능 통합
@Repository
public interface UserRepository extends JpaRepository<User, Long>, UserRepositoryCustom {
}
```
📝
- 인터페이스 명명 규칙: `{엔티티}RepositoryCustom`
- 구현체 명명 규칙: `{엔티티}RepositoryCustomImpl`
- `@RequiredArgsConstructor`로 `queryFactory` 생성자 주입
- `JpaRepository`와 커스텀 인터페이스를 동시에 상속하여 기능 통합

## 4. 기본 문법과 활용
### 4.1 동적 쿼리 작성
```java
public List<User> findByConditions(UserSearchCondition condition) {
    return queryFactory
        .selectFrom(user)
        .where(
            usernameEq(condition.getUsername()),
            ageGoe(condition.getAgeGoe()),
            ageLoe(condition.getAgeLoe())
        )
        .fetch();
}

// null 안전한 조건 처리
private BooleanExpression usernameEq(String username) {
    return hasText(username) ? user.username.eq(username) : null;
}
```
📝
BooleanExpression이 null을 반환하면 where절에서 자동으로 무시. 이를 활용하여 동적 쿼리를 안전하게 구상할 수 있음.

### 4.2 복합 정렬 처리
```java
public List<User> findUsersWithDynamicSort(List<Sort.Order> orders) {
    List<OrderSpcifier<?>> orderSpecifiers = orders.stream()
        .map(this::createOrderSpecifier)
        .collect(Collectors.toList());

    return queryFactory
        .selectFrom(user)
        .orderBy(orderSpecifiers.toArray(new OrderSpecifier[0]))
        .fetch();
}

private OrderSpecifier<?> createOrderSpecifier(Sort.Order order) {
    PathBuilder<Object> pathBuilder =
        new PathBuilder<>(user.getType(), user.getMetadata());

    return new OrderSpecifier(
        order.isAscending() ? Order.ASC : Order.DESC,
        pathBuilder.get(order.getProperty())
    );
}
```
📝
`OrderSpecifier`: QueryDSL에서 **OrderSpecifier**는 정렬 조건을 정의하는 객체로, 정렬 필드와 방향을 설정할 수 있음.
`PathBuilder`: 필드 이름을 기준으로 **Path** 객체를 생성하여 동적으로 정렬 기준을 생성. 이를 통해 런타임에 다양한 필드로 정렬이 가능함.
`isAscending()`: **Sort.Order** 객체에서 제공되는 메서드로, 정렬 방향이 오름차순인지 내린차순인지 확인하는 역할을 함.

### 4.3 페이징 최적화
```java
private log getTotalCount(UserSearchCondition condition) {
    return queryFactory
        .select(user.count())
        .from(user)
        .where(
            usenameEq(condtion.getUsername()),
            ageGoe(condition.getAgeGoe())
        )
        .fetchOne();
}

public Page<UserDto> searchPageOptimized(UserSearchCondition condition, Pageable pageable) {
    List<UserDto> content = queryFactory
        .select(new QUserDto(
            user.id,
            user.username,
            user,age
        ))
        .from(user)
        .where(
            usernameEq(condition.getUsername()),
            ageGoe(condition.getAgeGoe())
        )
        .offset(pageable.getOffset())   // 시작위치
        .limit(pageable.getPageSize())  // 페이지 크기k
        .fetch();

    // 최적화된 카운트 쿼리
    long total = content.size() < pageable.getPageSize() ?
        content.size() : // 마지막 페이지인 경우 카운트 쿼리 생략
        getTotalCount(condition); // 카운트 쿼리를 실행하여 총 데이터 개수를 조회

    return new PageImpl<>(content, pageable, total);
}
```
📝
결과 크기가 요청한 페이지 크기보다 작은 경우, 불필요한 카운트 쿼리를 실행하지 않아 성능이 향상된다.

## 5. 성능 최적화
### 5.1 N+1 문제 해결
```java
public List<Order> findOrdersOptimized() {
    return queryFactory
        .selectFrom(order)
        .join(order.member, member).fetchJoin()
        .join(order.delivery, delivery).fetchJoin()
        .join(order.orderItems, orderItem).fetchJoin()
        .distinct() // 중복 제거
        .fetch();
}
```
📝
- `fetchJoin()`은 연관된 엔티티를 한 번의 쿼리로 함께 조회
- 일대다 관계에서는 데이터 중복이 발생할 수 있어 `distinct()` 사용
- 일반 `join()`은 연관 엔티티를 프록시로 조회하지만, `fetchJoin()`은 실제 엔티티를 조회
- **주의사항**: 둘 이상의 컬렉션은 한 번에 페치 조인할 수 없음

### 5.2 서브쿼리 최적화
```java
public List<User> findUsersWithSubquery() {
    QUser userSub = newQUser("userSub");

    retur queryFactory
        .selectFrom(user)
        .where(user.age.gt(
            JPAExpressions
                .select(userSub.age.avg())
                .from(userSub)
        ))
        .fetch();
}
```
📝
- 서브쿼리에서는 별도의 Q타입 인스턴스를 생성하여 사용
- `JPAExpressions`를 사용하여 서브쿼리 작성
- 서브쿼리는 where,select,having 절에서 사용 가능
- **주의사항**: from절의 서브쿼리(인라인 뷰)는 지원하지 않음
- 가능한 경우 조인으로 해결하는 것이 성능상 유리

### 5.3 벌크 연산과 영속선 컨텍스트
```java
@Transactional
public void bulkUpdateWithContextClear() {
    // 벌크 연산 수행
    long count = queryFactory
        .update(user)
        .set(user.status, "INACTIVE")
        .where(user.lastLoginDate.before(LocalDateTime.now().minusYears(1)))
        .execute();

    // 영속성 컨텍스트 초기화
    entityManager.flush();  // 변경사항을 DB에 반영
    entityManager.clear();  // 영속성 컨텍스트 초기화
}
```
📝
- `flush()`: 현재 영속성 컨텍스트의 변경사항을 DB에 반영함.
- `clear()`: 영속성 컨텍스트를 초기화하여 벌크 연산 후의 DB 상태와 동기화함.
- 이 과정을 통해 벌크 연산 후 발생할 수 있는 데이터 불일치를 방지함.

### 6. 테스트 작성과 주의사항
```java
@DataJpaTest
class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JPAQueryFactory queryFactory;

    @Test
    void dynamicQueryTest() {
        // given
        UserSearchCondition condition = new UserSearchCondition();
        condition.setUsername("user1");
        condition.setAgeGoe(20);

        // when
        List<User> result = userRepository.findByConditions(condition);

        // then
        assertThat(result)
            .extracting("username") // username을 추출
            .contains("user1")  // "user1"이 포함 검증
    }
}
```
📝
- `@DataJpaTest`는 JPA 관련 컴포넌트만 테스트하므로 테스트 실행 속도가 빠르고, 기본적으로 각 테스트 메서드에 `@Transactional`이 적용되어 테스트 격리를 보장함.

## 6.2 버전별 주의사항

- **QueryDSL 5.0.0 이상**: Q클래스 생성 경로 변경
- **JPA 2.2 이상**: fetch join과 pagination 함께 사용 시 주의
- **Spring Boot 2.5.0 이상**: Gradle 설정 방식 변경 

## 7. 🔑 Key Points

> 핵심정리
> - 동적 쿼리는 BooleanExpression 활용하여 null 안정성 확보
> - 대량 데이터는 벌크 연산 + 컨텍스트 초기화로 성능 확보
> - 페이징 시 불필요한 카운트 쿼리 제거로 성능 최적화
> - N+1은 fetch join으로 해결
> - 복잡한 정렬은 OrderSpecifier 활용하여 동적 처리
> - 테스트 코드 작성 필수