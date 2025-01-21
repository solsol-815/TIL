# JWT (JSON Web Token)

## 목차 📑
- [JWT (JSON Web Token)](#jwt-json-web-token)
  - [목차 📑](#목차-)
  - [1. JWT 개요](#1-jwt-개요)
    - [1.1 핵심 특징](#11-핵심-특징)
  - [2. JWT 구조와 구성요소](#2-jwt-구조와-구성요소)
    - [2.1 Header (헤더)](#21-header-헤더)
    - [2.2 Payload (페이로드)](#22-payload-페이로드)
    - [2.3 Signature (서명)](#23-signature-서명)
  - [3. JWT 인증 프로세스](#3-jwt-인증-프로세스)
    - [3.1 기본 인증 흐름](#31-기본-인증-흐름)
  - [4. JWT 장단점 분석](#4-jwt-장단점-분석)
    - [4.1 장점](#41-장점)
    - [4.2 단점과 보완책](#42-단점과-보완책)
  - [5. 보안 고려사항](#5-보안-고려사항)
  - [6. Best Practices](#6-best-practices)
  - [7. 🔑 Key Points](#7--key-points)

## 1. JWT 개요
JWT(JSON Web Token)는 당사자 간에 정보를 JSON 객체로 안전하게 전송하기 위한 간결하고 독립적인 방식을 정의하는 개방형 표준(RFC 7519)입니다.

### 1.1 핵심 특징
1. **Self-contained**
   - 필요한 모든 정보를 자체적으로 포함
   - 별도의 조회 없이 토큰 자체로 정보 검증 가능

2. **Claim 기반**
   - 사용자 정보와 권한 등을 포함하는 Claim 방식
   - Base64로 인코딩된 JSON 형태로 저장

## 2. JWT 구조와 구성요소

### 2.1 Header (헤더)
```json
{
    "alg": "HS256",
    "typ": "JWT"
}
```
- 토큰 유형과 서명 알고리즘 정보 포함
- Base64로 인코딩됨

### 2.2 Payload (페이로드)
```json
{
    "sub": "12345678",
    "name": "John Doe",
    "iat": 1516239022
}
```
- 실제 전송할 데이터 (Claims)
- 사용자 정보, 권한 등 포함
- Base64로 인코딩됨

### 2.3 Signature (서명)
```javascript
HMACSHA256(
    base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
    secret
)
```
- 토큰의 무결성 검증
- 비밀키를 사용한 해시값 생성

## 3. JWT 인증 프로세스
---------------------------------------------------

### 3.1 기본 인증 흐름
1. 클라이언트가 로그인 정보 제출
2. 서버는 정보 검증 후 JWT 생성
3. 클라이언트는 JWT를 저장하고 요청 시 함께 전송
4. 서버는 JWT 검증 후 요청 처리

## 4. JWT 장단점 분석

### 4.1 장점
1. **서버 확장성**
   - 서버 부하 감소
   - 분산/클라우드 환경에 적합

2. **인증 저장소 불필요**
   - 별도의 세션 저장소 불필요
   - 인증 서버와 DB 의존도 감소

3. **OAuth 호환**
   - Auth0 등과 연동 가능
   - 소셜 로그인 구현 용이

### 4.2 단점과 보완책
1. **보안 위험**
   - 토큰 탈취 위험 존재
   - 중요 정보 포함 제한 필요

2. **토큰 길이**
   - 데이터 증가에 따른 길이 증가
   - 네트워크 대역폭 고려 필요

3. **토큰 관리**
   - 발급된 토큰 수정/폐기 어려움
   - Access Token + Refresh Token 방식으로 보완

## 5. 보안 고려사항
```java
// JWT 생성 예시
public String createToken(String username) {
    return JWT.create()
        .withSubject(username)
        .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .sign(Algorithm.HMAC512(SECRET.getBytes()));
}
```

## 6. Best Practices
1. **토큰 저장**
   - HttpOnly 쿠키 사용
   - XSS 공격 방지

2. **만료 시간 설정**
   - 적절한 토큰 만료 시간 설정
   - Refresh Token 활용

3. **페이로드 최소화**
   - 필요한 정보만 포함
   - 민감 정보 제외

## 7. 🔑 Key Points

> **핵심 포인트**
> - JWT는 Self-contained 방식의 토큰 기반 인증
> - Header, Payload, Signature 3부분으로 구성
> - Base64 인코딩은 암호화가 아님을 주의
> - 토큰 관리와 보안에 대한 고려 필수
> - Access Token과 Refresh Token 활용 권장