# 📚 컴포넌트와 JSX

### 📌 학습 목표
- 컴포넌트의 기본 개념 이해
- JSX 문법의 특징과 활용법 습득
- 실제 프로필 카드 컴포넌트 구현

## 📑 목차
- [📚 컴포넌트와 JSX](#-컴포넌트와-jsx)
    - [📌 학습 목표](#-학습-목표)
  - [📑 목차](#-목차)
  - [1. 🖍️ 핵심 개념과 프로젝트 셋업](#1-️-핵심-개념과-프로젝트-셋업)
  - [2. 💻 실습: 프로필 카드 컴포넌트](#2--실습-프로필-카드-컴포넌트)
    - [컴포넌트](#컴포넌트)
    - [스타일링](#스타일링)
    - [컴포넌트 사용 예시](#컴포넌트-사용-예시)
  - [3. 📝 정리 및 보완](#3--정리-및-보완)
    - [1. JSX와 HTML의 주요 차이점](#1-jsx와-html의-주요-차이점)
    - [2. 컴포넌트 작성 시 주의사항](#2-컴포넌트-작성-시-주의사항)
    - [3. 자주 발생하는 오류와 해결방법](#3-자주-발생하는-오류와-해결방법)
  - [4. 🔑 Key Points](#4--key-points)

## 1. 🖍️ 핵심 개념과 프로젝트 셋업
0. 프로젝트 시작하기
    ```bash
    # React 프로젝트 생성
    npx create-react-app [프로젝트명]

    # 프로젝트 폴더 이동
    cd [프로젝트명]

    # 필요한 패키지 설치
    npm install [필요한 패키지명]
    # 자주 사용하는 패키지 설치
    npm install axios   # API 통신
    npm install react-router-dom  # 라우팅
    npm install styled-components # 스타일링

    # 개발 서버 실행
    npm start # CRA
    npm run dev # Next,js/Vite
    ```
1. 컴포넌트의 이해
   - React의 기본 구성 단위
   - 재사용 가능한 UI 조각
   - 함수형 컴포넌트 방식 사용
2. JSX의 특징
   - HTML과의 주요 차이점
     - className 사용 (class 대신)
     - camelCase 속성명 사용 (onClick, backgroundColor)
     - 중괄호로 JavaScript 표현식 삽입

## 2. 💻 실습: 프로필 카드 컴포넌트
### 컴포넌트
```jsx
// ProfileCard 컴포넌트는 이름, 역할, 이미지를 props로 받아 카드 형태로 표시함.
function ProfileCard({ name, role, imageUrl }) {
    // 기본 이미지 URL
    const defaultImage = "https://via.placeholder.com/150";

    return (
        <div className="profile-card">
            <img 
                src={imageUrl || defaultImage} 
                alt={name} 
                className="profile-image"
                onError={(e) => e.target.src = defaultImage}
            />
            <div className="profile-info">
                <h2>{name}</h2>
                <p>{role}</p>
            </div>
        </div>
    );
}
```
### 스타일링
```css
/* 프로필 카드의 스타일링 */
.profile-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    max-width: 300px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1)
}

.profile-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-bottom: 15px;
}
```
### 컴포넌트 사용 예시
```jsx
// App.js
import ProfileCard from './components/ProfileCard';

function App() {
    const users = [
        {
            name: "홍길동",
            role: "프론트엔드 개발자",
            imageUrl: "/images/profile1.jpg"
        },
        {
            name: "김철수",
            role: "백엔드 개발자",
            imageUrl: "/images/profile2.jpg"
        }
    ];

    return (
        <div className="app">
            {users.map(user => (
                <ProfileCard
                    key={user.name}
                    name={user.name}
                    role={user.role}
                    imageUrl={user.imageUrl}
                />
            ))}
        </div>
    );
}
```

## 3. 📝 정리 및 보완
### 1. JSX와 HTML의 주요 차이점
1. 모든 태그는 닫혀야 함(self-closing포함)
2. JavaScript 표현식은 중괄호로 감싸기
3. class 대신 className 사용
4. 예제:
    ```jsx
    // HTML
    <div class="container" onclick="handleClick()">

    // JSX
    <div className="container" onClick={handleClick}>
    ```
### 2. 컴포넌트 작성 시 주의사항
1. 반드시 하나의 부모 요소로 감싸기(div로 감싸거나, Fragment 사용)
    ```jsx
    // ❌ 잘못된 방식 (에러 발생)
    function Component() {
        return (
            <h1>제목</h1>
            <p>내용</p>
        );
    }

    // ✅ 올바른 방식 (div로 감싸기)
    function Component() {
        return (
            <div>
                <h1>제목</h1>
                <p>내용</p>
            </div>
        );
    }

    // ✅ Fragment 사용 (불필요한 div 없이 감싸기)
    function Component() {
        return (
            <>
                <h1>제목</h1>
                <p>내용</p>
            </>
        );
    }
    ```
    🔖 이유:
    - React가 VirtualDOM을 비교할 때 하나의 루트 요소가 필요
    - JSX는 결국 JavaScript 객체로 변환되는데, 함수는 하나의 객체만 반환 가능
2. Props는 읽기 전용으로 처리
   ```jsx
   // ❌ 잘못된 방식 - props 직접 수정
   function ProfileCard({ name, role }) {
        name = "새로운 이름";  // 에러 발생
        return (
            <div>
                <h2>{name}</h2>
                <p>{role}</p>
            </div>
        );
   }

   // ✅ 올바른 방식 - state 사용
   function ProfileCard({ name, role }) {
        const [userName, setUserName] = useState(name);

        return (
            <div>
                <h2>{userName}</h2>
                <p>{role}</p>
                <button onClick={() => setUserName("새로운 이름")}>
                    이름변경
                </button>
            </div>
        )
   }
   ```
   🔖 이유:
   - 데이터 흐름의 단방향성 유지
   - 예측 가능한 동작 보장
   - 컴포넌트 간 의존성 명확
   - 🔐 props 값을 변경하는 방법
     - 부모 컴포넌트에서 state로 관리
     - 자식 컴포넌트에서 state로 복사해서 사용
     - useState 등의 훅을 사용하여 관리 
3. 컴포넌트명은 대문자로 시작
### 3. 자주 발생하는 오류와 해결방법
1. JSX내 주석 작성:{/*주석내용*/}
2. 조건부 렌더링 시 삼항연산자 활용
    ```jsx
    function Component({ isLoggedIn }) {
        return (
            <div>
                {/* 삼항연산자 사용 */}
                {isLoggedIn ? <p>환영합니다</p> : <p>로그인해주세요</p>}

                {/* && 연산자 사용 */}
                {isLoggedIn && <p>로그인 상태입니다</p>}
            </div>
        )
    }
    ```
3. **key prop** 누락 시 **warning**
    ```jsx
    // ❌ 경고 발생
    function TodoList({ todos }) {
        return (
            <ul>
                {todos.map(todo => (
                    <li>{todo.text}</li>
                ))}
            </ul>
        );
    }

    // ✅ 올바른 방식
    function TodoList({ todos }) {
        return (
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>{todo.text}</li>
                ))}
            </ul>
        );
    }
    ```
    🔖 이유:
    - React가 리스트 항목의 변경사항을 효율적으로 파악하기 위해
    - 리렌더링 시 어떤 항목이 추가/제거/변경되었는지 식별하기 위해
    - 성능 최적화를 위해

## 4. 🔑 Key Points
1. 컴포넌트 분리 기준
   - 재사용 가능성이 있는지
   - 코드가 너무 길어지지 않았는지
   - 단일 책임 원칙을 지키는지
2. 성능 최적화 고려사항
   - 불필요한 리렌더링은 없는지
   - 큰 이미지는 최적화되었는지
   - key prop은 적절한지
3. 개발 도구 활용
   - React Developer Tools
   - Chrome DevTools
   - VS Code의 React 관련 확장 프로그램