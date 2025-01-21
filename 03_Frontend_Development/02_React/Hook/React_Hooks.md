# React Hooks 가이드

## 목차 📑
- [React Hooks 가이드](#react-hooks-가이드)
  - [목차 📑](#목차-)
  - [1. Hooks 개요](#1-hooks-개요)
    - [1.1 Hook이란?](#11-hook이란)
    - [1.2 Hook의 특징](#12-hook의-특징)
  - [2. 기본 Hooks](#2-기본-hooks)
    - [2.1 useState](#21-usestate)
    - [2.2 useEffect](#22-useeffect)
    - [2.3 useContext](#23-usecontext)
  - [3. 추가 Hooks](#3-추가-hooks)
    - [3.1 useReducer](#31-usereducer)
    - [3.2 useCallback](#32-usecallback)
    - [3.3 useMemo](#33-usememo)
    - [3.4 useRef](#34-useref)
  - [4. 실전 예제](#4-실전-예제)
  - [5. Best Practices](#5-best-practices)
  - [6. 🔑 Key Points](#6--key-points)

## 1. Hooks 개요
---------------------------------------------------

### 1.1 Hook이란?
React 16.8에서 도입된 특별한 함수로, 함수형 컴포넌트에서 React state와 생명주기 기능을 사용할 수 있게 해주는 기능입니다.

### 1.2 Hook의 특징
1. **함수형 컴포넌트 전용**
   - 클래스형 컴포넌트에서는 사용 불가
   - 컴포넌트 최상위에서만 호출 가능

2. **규칙**
   - 반복문, 조건문, 중첩된 함수 내에서 Hook 호출 불가
   - React 함수 컴포넌트 내에서만 Hook 호출 가능

## 2. 기본 Hooks
---------------------------------------------------

### 2.1 useState
상태 관리를 위한 가장 기본적인 Hook

```javascript
const [state, setState] = useState(initialState);

// 예시
const [count, setCount] = useState(0);
const [user, setUser] = useState({ name: '', age: 0 });
```

### 2.2 useEffect
사이드 이펙트 처리를 위한 Hook

```javascript
useEffect(() => {
    // 실행할 작업
    return () => {
        // 정리(cleanup) 작업
    };
}, [dependencies]);

// 예시
useEffect(() => {
    const subscription = dataSource.subscribe();
    return () => {
        subscription.unsubscribe();
    };
}, [dataSource]);
```

### 2.3 useContext
Context API를 통한 데이터 공유

```javascript
const value = useContext(MyContext);

// 예시
const theme = useContext(ThemeContext);
```

## 3. 추가 Hooks
---------------------------------------------------

### 3.1 useReducer
복잡한 상태 로직 관리

```javascript
const [state, dispatch] = useReducer(reducer, initialState);

// 예시
const [todos, dispatch] = useReducer(todosReducer, []);
```

### 3.2 useCallback
함수의 메모이제이션

```javascript
const memoizedCallback = useCallback(
    () => {
        doSomething(a, b);
    },
    [a, b],
);
```

### 3.3 useMemo
계산 결과의 메모이제이션

```javascript
const memoizedValue = useMemo(
    () => computeExpensiveValue(a, b),
    [a, b]
);
```

### 3.4 useRef
DOM 요소 참조 및 값 보존

```javascript
const inputRef = useRef(null);
```

## 4. 실전 예제
---------------------------------------------------

```javascript
function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');
    
    const addTodo = useCallback(() => {
        setTodos(prev => [...prev, input]);
        setInput('');
    }, [input]);
    
    useEffect(() => {
        console.log('Todos updated:', todos);
    }, [todos]);
    
    return (
        <div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
            />
            <button onClick={addTodo}>Add Todo</button>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>{todo}</li>
                ))}
            </ul>
        </div>
    );
}
```

## 5. Best Practices
---------------------------------------------------

1. **의존성 배열 관리**
   - 필요한 의존성만 포함
   - 불필요한 재렌더링 방지

2. **메모이제이션 활용**
   - 무거운 연산에 useMemo 사용
   - 콜백 함수에 useCallback 활용

3. **cleanup 함수 구현**
   - 메모리 누수 방지
   - 구독 해제, 이벤트 리스너 제거

## 6. 🔑 Key Points
---------------------------------------------------

> **핵심 포인트**
> - Hook은 함수형 컴포넌트에서만 사용
> - 조건부 실행 시 Hook 내부에서 처리
> - useEffect의 의존성 배열 신중히 관리
> - 성능 최적화를 위한 메모이제이션 활용
> - Cleanup 함수로 메모리 관리