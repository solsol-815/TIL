# 📝 S3 이미지 업로드 및 마크다운 URL 처리
📌 학습 내용:
React에서 **마크다운 에디터**와 **S3 이미지 업로드**기능을 사용하여, 게시글 작성 시 이미지 처리 방법을 학습하였음.

## 1. 🗄️ 컴포넌트 구조 설계
```js
// Container Component
function PostCreateContainer() {
    // 상태 관리 및 비지니스 로직 처리
    const handleSubmit = async (postData) => {/*...*/};
    const onImageUpload = async (file) => {/*...*/};
    return <PostCreate onSubmit={handleSubmit} onImageUpload={onImageUpload}/>;

    // Presentational Component
    const PostCreate = ({onSubmit, onImageUpload}) => {
        // UI 렌더링 및 사용자 입력 처리
        const [title, setTitle] = useState('');

        const haddleSubmit = (e) => {
        e.preventDefault();
        onSubmit({category, title, content});
        }

        return<from>{/*...*/}</form>
    };
}
```

## 2. 게시글 등록 & 첨부파일 처리
```js
const onSubmit = async (postData) => {
    const createPostData = {
            ...postData,
            userId: userInfo.id,
            createdAt: new Date().toISOString(),
    };

    // 1. 게시글 저장
    const response = await fetch('/posts', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringfy(createPostData)
    });
    const {id: postId} = await response.json();

    // 2. 이미지 URL을 첨부파일로 등록
    if (postData?.content?.includes('![')) {
        const imageUrls = extractImageUrls(postData.content);
        await Promise.all(imageUrls.map(url =>
            fetch(`/posts/${postId}/attachments`, {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringfy({url})
            })
        ));
    }
    navigate(`/posts/${postId}`);
};
```

## 3. 🗳️ 마크다운 이미지 URL 처리
```js
const extractImageUrls = (markdownContent) => {
    const urlRegex = /!\[.*?\]\((.*?)\)/g;
    const urls = [];
    let match;

    while ((match = urlRegex.exec(markdownContent)) !== null) {
            urls.push(match[1]);
    }
    return urls;
}
```

## 4. 🏙️  S3 이미지 업로드
``` js
const onImageUpload = async (file) => {
    const formData = new FromData();
    formData.append('file', file);

    // S3에 이미지 업로드하고 URL 받기
    const response = await fetch('/api/upload/s3', {
        method: 'POST'
        body: formData
    });

    const {fileURL} = await response.json();
    return fileURL; // 마크다운 에디터에 URL 전달
};
```

## 5. 🔑 Key Points
### 1. 컴포넌트 패턴
- Presentational/Container 패턴으로 관심사 분리(npm install prop-types 이용)
- UI와 비즈니스 로직의 명확한 구분
- 재사용성과 유지보수성 향상

### 2. 마크다운 에디터 활용
- @uiw/react-md-editor 라이브러리 활용(npm install @uiw/react-md-editor)
- 이미지 업로드 핸들러 연동
- 실시간 마크다운 프리뷰 구현

### 3. 비동기 처리
- FromData를 이용한 파일 업로드
- Promise.all을 통한 병렬 처리
- 순차적인 API 호출 처리

### 4. 상태 관리
- 폼 데이터 상태 관리
- 카테고리, 제목, 내용 분리
