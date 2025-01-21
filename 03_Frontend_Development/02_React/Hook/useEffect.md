# useEffect Hook 가이드

## 목차 📑
- [useEffect Hook 가이드](#useeffect-hook-가이드)
  - [목차 📑](#목차-)
  - [1. useEffect 개요](#1-useeffect-개요)
    - [1.1 useEffect란?](#11-useeffect란)
    - [1.2 Side Effect란?](#12-side-effect란)
  - [2. useEffect 구조](#2-useeffect-구조)
    - [2.1 기본 문법](#21-기본-문법)
    - [2.2 의존성 배열](#22-의존성-배열)
  - [3. Effect와 Cleanup](#3-effect와-cleanup)
    - [3.1 Effect 실행 시점](#31-effect-실행-시점)
    - [3.2 Cleanup 실행 시점](#32-cleanup-실행-시점)
    - [3.3 동작 방식](#33-동작-방식)
  - [4. 실전 활용 예제](#4-실전-활용-예제)
    - [4.1 API 데이터 가져오기](#41-api-데이터-가져오기)
    - [4.2 이벤트 리스너](#42-이벤트-리스너)
    - [4.3 무한 루프 방지](#43-무한-루프-방지)
  - [5. Best Practices](#5-best-practices)
  - [6. 🔑 Key Points](#6--key-points)

## 1. useEffect 개요

### 1.1 useEffect란?
React의 함수형 컴포넌트에서 side effect를 처리하기 위한 Hook입니다. 컴포넌트가 렌더링된 이후 특정 작업을 수행할 수 있게 해줍니다. useEffect는 React 애플리케이션에서 부수 효과를 관리하는 핵심입니다.

### 1.2 Side Effect란?
컴포넌트의 주요 기능(렌더링) 외에 발생하는 모든 부수적인 작업을 말합니다:
- API 호출
- 이벤트 리스너 등록/해제
- DOM 직접 조작
- 타이머 설정/해제

## 2. useEffect 구조

### 2.1 기본 문법
```javascript
useEffect(() => {
    // effect 로직
    return () => {
        // cleanup 로직
    };
}, [dependencies]);
```

### 2.2 의존성 배열
```javascript
// 1. 빈 배열: 마운트, 언마운트 시에만 실행
useEffect(() => {
    console.log('컴포넌트 마운트');
}, []);

// 2. 배열 생략: 매 렌더링마다 실행
useEffect(() => {
    console.log('매 렌더링마다 실행');
});

// 3. 의존성 포함: 특정 값 변경 시 실행
useEffect(() => {
    console.log(`count 변경: ${count}`);
}, [count]);
```

## 3. Effect와 Cleanup

### 3.1 Effect 실행 시점
- 컴포넌트 마운트(처음 나타날 때)
- 의존성 배열의 값이 변경될 때
- 의존성 배열이 없는 경우 매 렌더링 시

### 3.2 Cleanup 실행 시점
- 컴포넌트 언마운트(사라질 때)
- 다음 effect 실행 전
- 의존성이 변경되어 effect가 재실행되기 전

### 3.3 동작 방식
```javascript
// 타이머 예제
useEffect(() => {
    const timer = setInterval(() => {
        console.log('1초마다 실행');
    }, 1000);

    // cleanup: 타이머 정리
    return () => {
        clearInterval(timer);
    };
}, []);
```

## 4. 실전 활용 예제

### 4.1 API 데이터 가져오기
```javascript
useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setData(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchData();
}, [url]);
```

### 4.2 이벤트 리스너
```javascript
useEffect(() => {
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);
```

### 4.3 무한 루프 방지
```javascript
// ❌ 잘못된 사용
useEffect(() => {
    setCount(count + 1);  // 무한 루프 발생
}, [count]);

// ✅ 올바른 사용
useEffect(() => {
    setCount(prevCount => prevCount + 1);
}, []); // 의존성 배열이 비어있음
```

## 5. Best Practices

1. **의존성 배열 관리**
   - 필요한 의존성만 포함
   - 불필요한 재실행 방지

2. **Cleanup 함수 활용**
   - 메모리 누수 방지
   - 리소스 해제

3. **에러 처리**
```javascript
useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setData(data);
        } catch (error) {
            setError(error);
        }
    };
    fetchData();
}, [url]);
```

1. **불필요한 렌더링 방지**
```javascript
const handler = useCallback(() => {
    console.log(data);
}, [data]);

useEffect(() => {
    // 핸들러 사용
}, [handler]);
```

## 6. 🔑 Key Points

> **주요 포인트**
> - Effect는 렌더링 이후 실행됨
> - Cleanup은 컴포넌트 정리 시 필수
> - 의존성 배열로 실행 시점 제어
> - 비동기 작업은 내부 함수로 처리
> - 무한 루프 주의
> - 적절한 에러 처리 구현