<!-- @format -->

# Personal Portfolio Website

순수 HTML, CSS, JavaScript를 사용하여 제작한
반응형 개인 포트폴리오 웹사이트입니다.

React 등의 프레임워크를 사용하지 않고
DOM 조작, 이벤트 처리, 상태 변경,
비동기 API 통신을 직접 구현했습니다.

- [배포 사이트](https://l-jy16.github.io/aboutme/)
- [GitHub 저장소](https://github.com/L-jy16/aboutme)

## 프로젝트 목표

이번 프로젝트에서는 다음과 같은
JavaScript의 기본적인 동작 흐름을 이해하는 것을
목표로 했습니다.

사용자 이벤트
→ 상태 변경
→ DOM 업데이트
→ 화면 변경

## 사용 기술

- HTML5
- CSS3
- JavaScript ES6+
- GitHub REST API
- LocalStorage
- Intersection Observer
- GitHub Pages

## 주요 기능

### 반응형 웹

모바일 퍼스트 방식으로 구현했습니다.

브레이크포인트:

- Mobile: 기본
- Tablet: 768px 이상
- Desktop: 1024px 이상

### 모바일 햄버거 메뉴

모바일 화면에서 햄버거 버튼을 클릭하면
Navigation 메뉴가 표시됩니다.

classList.toggle()을 이용하여
active 클래스를 변경합니다.

### 다크 모드

다크 모드 버튼을 클릭하면
페이지의 테마가 변경됩니다.

변경된 테마는 LocalStorage에 저장되어
페이지를 새로고침해도 유지됩니다.

### Scroll Top

페이지를 300px 이상 스크롤하면
Scroll Top 버튼이 표시됩니다.

버튼을 클릭하면 페이지 맨 위로
부드럽게 이동합니다.

네비게이션 메뉴의 앵커 링크를 클릭할 때도 해당 섹션으로 부드럽게 이동합니다.

### Navigation 스타일 변경

60px 이상 스크롤하면
Header에 그림자가 추가됩니다.

### Scroll Animation

Intersection Observer API를 이용하여
화면에 섹션이 나타날 때
애니메이션이 실행됩니다.

threshold:

0.2

### GitHub API

GitHub REST API를 사용하여
본인의 Repository 정보를 가져옵니다.

Endpoint:

https://api.github.com/users/L-jy16/repos

다음 상태를 처리합니다.

- Loading
- Success
- Empty
- Error

API 요청 실패 시
에러 메시지와 다시 시도 버튼을 표시합니다.

### Contact Form

다음 항목을 검사합니다.

- 이름 필수 입력
- 이메일 필수 입력
- 이메일 형식 검사
- 메시지 필수 입력

잘못된 입력값이 존재하면
해당 입력창 아래에 에러 메시지를 표시합니다.

정상적인 입력이면
성공 메시지를 표시합니다.

## 폴더 구조

```text
aboutme/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── images/
│   ├── me.png
│   ├── desktop.png
│   └── mobile.png
└── README.md
```

## 실행 방법

1. 프로젝트를 내려받아 VS Code에서 폴더를 엽니다.
2. VS Code에 Live Server 확장 프로그램을 설치합니다.
3. `index.html`을 마우스 오른쪽 버튼으로 클릭하고 **Open with Live Server**를 선택합니다.

GitHub 저장소 목록을 불러오려면 인터넷 연결이 필요합니다.

## 배포

GitHub Pages로 배포했습니다.

- 배포 URL: [https://l-jy16.github.io/aboutme/](https://l-jy16.github.io/aboutme/)
- 저장소 URL: [https://github.com/L-jy16/aboutme](https://github.com/L-jy16/aboutme)

## Screenshots

### Desktop

![데스크톱 화면의 포트폴리오](./images/desktop.png)

### Mobile / Dark Mode

모바일 화면에서 다크 모드를 적용한 모습입니다.

![모바일 화면의 다크 모드 포트폴리오](./images/mobile.png)
