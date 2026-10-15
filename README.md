# Personal Portfolio Website

순수 HTML, CSS, JavaScript로 만든 이지영의 반응형 포트폴리오입니다. 사용자 이벤트를 받아 상태를 변경하고 DOM을 업데이트하는 흐름과 비동기 API 처리를 직접 구현했습니다. 외부 프레임워크나 UI 라이브러리는 사용하지 않았습니다.

- [배포 사이트 — GitHub Pages](https://l-jy16.github.io/aboutme/)
- [GitHub 저장소](https://github.com/L-jy16/aboutme)
- 구현 범위: PDF의 기본 과제. 프로젝트 필터링·타이핑 효과·실제 이메일 전송·시스템 테마 감지 등 보너스는 구현하지 않았습니다.

## 평가 항목별 구현 근거

아래 표의 번호는 전달받은 15개 평가 항목에 대응합니다. 구현 근거는 현재 소스 기준이며, 브라우저 실행 검증과는 구분합니다.

| 번호 | 평가 내용 | 구현 근거와 설명 |
| --- | --- | --- |
| 1 | 모바일 퍼스트·반응형 | [style.css](css/style.css)의 기본 모바일 스타일과 `@media (min-width: 768px)`, `@media (min-width: 1024px)`. 화면별 변경 사항은 아래 표 참고 |
| 2 | 테마 저장·복원 | [main.js](js/main.js)의 `savedTheme`, `updateThemeButton`. 저장값이 없으면 밝은 테마, 있으면 저장값 적용 |
| 3 | 인터랙티브 UI | `classList.toggle('active')`, `window.scrollTo`, `IntersectionObserver`. 스크롤 기준은 60px·300px, 애니메이션 threshold는 0.2 |
| 4 | API 상태 처리 | `loadProjects`에서 로딩·성공·빈 목록·실패를 분기. 실패 UI는 있으나 재시도 연결에 알려진 오류가 있음 |
| 5 | 폼 유효성 검사 | `validateEmail`, `clearErrors`, submit/input 핸들러. 필수값·이메일 검사 및 필드별 오류 표시 |
| 6 | 파일 분리·배포 | HTML에서 외부 CSS와 `defer` JS 연결. 자원 경로는 `./css/`, `./js/`, `./images/` 상대 경로 사용. GitHub Pages 배포 완료 |
| 7 | 시맨틱 구조 | [index.html](index.html)의 header/nav/main/section/footer와 동적 카드의 article. 프로필 alt, label의 for-id 연결 |
| 8 | CSS 변수 | `:root`의 색상·간격·헤더 높이·최대 너비, `[data-theme="dark"]`의 테마 색상 재정의. 사용 범위와 한계는 아래 설명 참고 |
| 9 | 이벤트 처리·재사용 | click/scroll/submit/input을 `addEventListener`로 연결. `loadProjects`, `updateThemeButton`, `validateEmail`, `clearErrors`를 명명된 함수로 분리 |
| 10 | 이벤트→상태→렌더링 | 테마·메뉴·API·폼의 상태 흐름을 아래 표에 정리. 상태는 dataset·class·지역 변수로 표현 |
| 11 | 비동기·예외 처리 | `fetch` + `async/await`, `response.ok` 검사, `try/catch`. 수동 재시도 버튼을 생성하며 자동 재시도·타임아웃은 없음 |
| 12 | 배열 메서드·ES6+ | 저장소는 `map`으로 카드 변환, 메뉴 링크·관찰 대상·Observer entries는 `forEach`로 순회. 구조분해·화살표 함수·템플릿 리터럴 사용 |
| 13 | Flex/Grid 선택 이유 | 내비게이션과 카드 내부의 한 방향 정렬은 Flex, 여러 프로젝트 카드의 행·열 배치는 Grid. 상세 이유는 아래 설명 참고 |
| 14 | 상태 관리 패턴 | 전역 `STATE` 객체 없이 dataset·class·지역 변수와 DOM으로 상태 표현. 현재 상태 표현 방식과 전환을 아래 표에 명시 |
| 15 | 접근성 | `lang="ko"`, viewport, label/alt, 버튼 aria-label, 메뉴 aria-expanded, 동적 안내 aria-live. 키보드·스크린리더 실기 검증은 미실시 |

### 평가 항목 12·14에 관한 요구사항 해석

PDF의 ES6+ 요구사항에서 `map`, `forEach`를 사용하며, 특정 프로젝트만 표시하는 `filter`는 **선택**으로 명시되어 있습니다. 현재 코드에는 `navLinks.forEach`, `entries.forEach`, `revealElements.forEach`가 있습니다. 따라서 forEach가 누락된 구현은 아니며, 보너스인 프로젝트 필터링은 추가하지 않았습니다.

PDF의 상태 관리 요구사항은 세 가지 이상의 **이벤트 → 상태 변경 → 화면 업데이트** 흐름입니다. 전역 `STATE` 객체를 반드시 만들라는 조건은 없습니다. 현재 구현은 아래처럼 상태를 표현하며, 단일 상태 객체를 사용한다고 주장하지 않습니다. 별도의 평가 기준에서 `filter`나 전역 `STATE`를 필수로 지정한다면 현재 구현은 그 추가 기준을 충족하지 않습니다.

## 화면 구조와 레이아웃 설계

Hero(인사말·CTA), About(자기소개·프로필), Skills(기술 목록), Projects(GitHub 저장소 카드), Contact(문의 폼), Footer(저작권·GitHub 링크)로 구성합니다. 내비게이션 앵커 링크로 각 주요 콘텐츠에 이동하고 CSS `scroll-behavior: smooth`로 부드러운 이동을 적용합니다.

시맨틱 태그는 콘텐츠 역할을 나타내기 위해 사용했습니다. `nav`는 이동 링크, `main`은 본문, `section`은 주제별 영역, `article`은 독립적인 저장소 카드입니다. 네이티브 시맨틱 태그에 같은 의미의 `role`을 중복해서 추가하지 않았습니다.

### Flexbox와 Grid 선택 이유

- **내비게이션 — Flexbox:** 로고·메뉴·테마 버튼을 가로 방향으로 정렬하고 `align-items`와 `justify-content`로 간격과 정렬을 제어합니다.
- **About·버튼·Footer — Flexbox:** 모바일에서는 세로로 쌓고, 넓은 화면에서는 `flex-direction: row`로 전환합니다.
- **Projects — Grid:** `repeat(auto-fit, minmax(250px, 1fr))`로 컨테이너 너비에 맞춰 열 수를 자동 조절합니다. 프로젝트 개수가 달라져도 일정한 최소 카드 너비를 유지합니다.
- **카드 내부 — Flexbox:** 세로 배치와 설명 영역의 `flex: 1`로 내용 길이가 달라도 링크 배치를 정리합니다.

레이아웃에 CSS를 사용하므로 HTML의 읽기 순서를 유지합니다. 다만 이 설계 설명 자체가 키보드·스크린리더 접근성 검증을 대신하지는 않습니다.

### 반응형 동작

| 화면 너비 | 적용 규칙 | 코드에서 확인할 수 있는 변화 |
| --- | --- | --- |
| 768px 미만 | 기본 모바일 스타일 | 메뉴는 기본 숨김, 햄버거 표시. Hero 버튼·About·Footer 세로 배치 |
| 768px 이상, 1024px 미만 | 태블릿 미디어쿼리 | Hero 버튼·About·Footer 가로 배치. 햄버거 메뉴 유지 |
| 1024px 이상 | 데스크톱 미디어쿼리 | 햄버거 숨김, 내비게이션 메뉴 가로 표시. 제목 크기와 섹션 여백 확대 |

프로젝트 카드는 별도 기기 구분 없이 Grid의 가용 너비에 따라 열 수가 바뀝니다. 위 표는 코드 분석 결과이며 모든 너비에서의 브라우저 검증 완료를 뜻하지 않습니다.

## 주요 인터랙션과 상태 흐름

| 기능 | 이벤트·조건 | 상태 표현 | 화면 업데이트 |
| --- | --- | --- | --- |
| 메뉴 | 햄버거 클릭 | 메뉴의 `active` 클래스 | 메뉴 표시/숨김, 버튼 문자와 `aria-expanded` 갱신 |
| 메뉴 닫기 | 메뉴 링크 클릭 | `active` 제거 | 메뉴 닫기, 버튼을 ☰로 복원 |
| 테마 | 테마 버튼 클릭 | `documentElement.dataset.theme`와 localStorage | CSS 변수 변경, 버튼 Light/Dark 갱신 |
| 헤더 | 스크롤 60px 이상 | `scrolled` 클래스 | 헤더 그림자 추가 |
| 맨 위로 | 스크롤 300px 이상 | 버튼의 `visible` 클래스 | 버튼 표시. 클릭하면 top: 0으로 부드럽게 이동 |
| 등장 애니메이션 | IntersectionObserver threshold 0.2 | 섹션의 `visible` 클래스 | opacity·translateY 전환 |
| API | 페이지 로드·재시도 | 요청 진행 단계와 응답 결과 | 로딩 안내 → 카드·빈 목록 안내·오류 안내 중 하나 |
| 폼 | 제출 | 지역 변수 `isValid` | 필드별 오류 또는 성공 메시지 표시 |
| 입력 수정 | input | 해당 필드의 오류 텍스트 초기화 | 오류·기존 성공 메시지 숨김 |

### 초기 테마 결정

1. `localStorage.getItem("theme")`으로 이전 선택을 읽습니다.
2. 저장값이 있으면 `data-theme`에 적용합니다.
3. 저장값이 없으면 `data-theme`를 설정하지 않으므로 `:root`의 **밝은 테마**가 적용됩니다.
4. 현재 테마가 dark이면 버튼에 Light, 그 외에는 Dark를 표시합니다.
5. 클릭 시 다음 테마를 dataset과 localStorage에 저장합니다. 새로고침하면 1번부터 복원합니다.

시스템 테마 감지는 보너스 범위여서 구현하지 않았습니다.

### 프로젝트 API 상태 모델

별도의 상태 객체를 생성하지 않고 `loadProjects`의 실행 흐름에서 상태를 구분합니다.

```text
loadProjects 호출
  → 로딩 안내 표시 + 기존 카드 비우기
  → fetch 요청
      → HTTP 성공 + 목록 있음: map → HTML 생성 → 카드 표시
      → HTTP 성공 + 목록 없음: 빈 목록 안내
      → HTTP 실패 또는 요청 예외: catch → 오류 안내 + 재시도 버튼 생성
```

- 엔드포인트: `https://api.github.com/users/L-jy16/repos`
- 카드 데이터: `name`, `description`, `html_url`, `language`, `stargazers_count`를 구조분해 할당합니다.
- 설명·언어가 null이면 `??`로 대체 문구를 표시합니다.
- 로딩 문구: “프로젝트를 불러오는 중...”
- 빈 목록 문구: “표시할 프로젝트가 없습니다.”
- 오류 문구: “프로젝트를 불러올 수 없습니다.”와 “다시 시도” 버튼
- HTTP 오류는 상태 코드를 포함한 Error를 만들고 콘솔에 기록합니다. 사용자 문구는 오류 유형별로 구분하지 않습니다.
- 자동 재시도와 요청 타임아웃은 구현하지 않았습니다. 수동 재시도 연결에는 아래에 적은 오류가 있습니다.

### 폼 검증과 접근성 범위

`novalidate`로 브라우저 기본 검증 대신 JavaScript 검증을 사용하고 `event.preventDefault()`로 기본 제출을 막습니다. `trim()`으로 공백을 제거한 후 이름·이메일·메시지의 빈값과 이메일 형식을 확인합니다. `clearErrors`로 이전 안내를 지운 뒤 필드 가까이에 오류를 표시하며, 입력 수정 시 해당 오류를 지웁니다.

각 필드는 label과 for-id로 연결되어 있습니다. 성공 안내와 프로젝트 상태 영역에는 `aria-live="polite"`, 메뉴 버튼에는 `aria-expanded`가 있습니다. 오류 필드로 자동 포커스 이동, `aria-invalid`, 오류 문구와의 `aria-describedby` 연결은 구현하지 않았습니다. 실제 이메일 전송 없이 검증 결과만 표시합니다.

## CSS 변수와 유지보수

| 변수 그룹 | 대표 변수 | 현재 사용 방식 |
| --- | --- | --- |
| 배경·텍스트 | `--background-color`, `--text-color`, `--sub-text-color` | body·헤더·보조 설명의 색상 |
| 표면·테두리 | `--surface-color`, `--card-color`, `--border-color` | 기술 목록·카드·입력 필드·Footer |
| 강조·상태 | `--primary-color`, `--primary-hover-color`, `--error-color`, `--success-color` | 버튼·링크·프로필 테두리·검증 안내 |
| 레이아웃 | `--header-height`, `--max-width` | 헤더·모바일 메뉴 위치·콘텐츠 최대 너비 |
| 간격 | `--spacing-small`, `--spacing-medium`, `--spacing-large` | 선언되어 있으나 현재 실제 스타일에서는 참조하지 않음 |

현재 사용 예:

```css
body {
  background-color: var(--background-color);
  color: var(--text-color);
}
```

`[data-theme="dark"]`에서 배경·표면·텍스트·테두리 변수를 재정의하여 같은 컴포넌트 스타일에 다크 테마를 적용합니다. 공통 색상을 바꿀 때는 변수 값을 수정하면 됩니다. 폰트는 현재 `font-family`에 직접 지정되어 있어, PDF의 폰트 변수 정의 요구는 아직 반영되지 않았습니다.

## 확인된 내용과 남은 검증

### 확인된 자료·실행 결과

- HTML/CSS/JS의 파일 연결, 미디어쿼리, 이벤트·상태 분기는 소스를 확인했습니다.
- 기존 데스크톱·모바일 다크 모드 캡처는 아래에 첨부했습니다. 캡처만으로 모든 화면과 인터랙션의 정상 동작을 증명하지는 않습니다.
- DOM 대역을 사용한 JavaScript 실행 검사에서 HTTP 403 실패 분기와 정상 폼 제출 분기의 오류를 재현했습니다. 실제 브라우저·배포본 전체 테스트는 아닙니다.
- GitHub Pages 배포는 완료했습니다. 현재 로컬 파일과 배포본의 동일 여부 및 배포본 전체 동작은 별도 확인이 필요합니다.

### 알려진 구현 문제

1. `main.js`의 API catch 내부에 남은 `ㄴ;`이 `ReferenceError`를 발생시킵니다. 오류 메시지와 버튼은 생성되지만 클릭 핸들러 연결 전에 중단되어 재시도가 동작하지 않습니다.
2. 폼 정상 제출 분기의 `ㄴ;`도 `ReferenceError`를 발생시킵니다. 성공 메시지는 표시되지만 이후 `contactForm.reset()`은 실행되지 않습니다.
3. 60px 이상 스크롤 시 헤더는 그림자만 바뀝니다. PDF에서 요구하는 배경색 변경은 반영되지 않았습니다.
4. CSS 폰트 변수는 없고, 간격 변수는 선언만 되어 있습니다.

위 문제는 문서 수정으로 해결되는 사항이 아니며 현재 코드의 한계로 명시합니다.

### 브라우저 검증 체크리스트 — 아직 완료 처리하지 않은 항목

아래는 평가자가 재현할 수 있는 절차입니다. 체크되지 않은 항목은 통과 결과를 기록한 것이 아닙니다.

- [ ] Chrome에서 375px, 767px, 768px, 1023px, 1024px, 1440px 너비로 확인: 가로 넘침·텍스트 겹침·메뉴 전환·카드 배치 확인
- [ ] 모바일 메뉴 열기 → 다시 클릭해서 닫기 → 링크를 눌러 이동하며 닫히는지 확인
- [ ] 테마 저장값 제거 후 밝은 테마 시작 → 다크 전환 → 새로고침 유지 확인
- [ ] 스크롤 59/60px에서 헤더 변화, 299/300px에서 맨 위로 버튼 표시 조건 확인
- [ ] 내비게이션 앵커와 맨 위로 버튼의 부드러운 이동 확인
- [ ] 섹션 스크롤 시 등장 애니메이션 확인
- [ ] API 정상 응답·빈 배열·403·네트워크 실패를 각각 재현하여 안내와 카드 확인
- [ ] 알려진 오류 수정 후 API 실패 → 재시도 → 성공 흐름 확인
- [ ] 빈 폼·잘못된 이메일·정상 입력 제출 및 입력 수정 시 오류 해제 확인
- [ ] 알려진 오류 수정 후 정상 제출 시 폼 초기화 확인
- [ ] Tab/Shift+Tab 이동 순서, 포커스 표시, Enter/Space 버튼 조작 확인
- [ ] 스크린리더로 label·메뉴 펼침 상태·동적 안내 읽기 확인
- [ ] GitHub Pages에서 CSS·JS·프로필 이미지·스크린샷 경로와 콘솔 오류 확인

## 사용 기술과 파일 구조

HTML5, CSS3, JavaScript ES6+, GitHub REST API, localStorage, Intersection Observer, GitHub Pages를 사용합니다. 별도 패키지 설치나 빌드 과정은 없습니다.

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

HTML의 자원 경로를 `./` 기준으로 지정하여 GitHub Pages의 `/aboutme/` 하위 경로에서 같은 폴더 구조를 참조합니다. API 요청만 외부 HTTPS 주소를 사용합니다. 실행 시 인터넷 연결이 필요합니다.

## 로컬 실행

1. 프로젝트를 내려받아 VS Code에서 폴더를 엽니다.
2. Live Server 확장 프로그램을 설치합니다.
3. `index.html`에서 **Open with Live Server**를 선택합니다.
4. Chrome 개발자 도구의 반응형 화면과 Console/Network에서 위 체크리스트를 확인합니다.

## 스크린샷

### 데스크톱

기존 데스크톱 화면 캡처입니다. 정확한 뷰포트 너비는 기록되어 있지 않습니다.

![데스크톱 화면의 포트폴리오](./images/desktop.png)

### 모바일 · 다크 모드

기존 모바일 다크 모드 캡처입니다. 햄버거 버튼과 Light 전환 버튼을 확인할 수 있습니다. 메뉴가 펼쳐진 상태나 테마 저장·복원 과정을 보여주는 캡처는 아닙니다.

![모바일 화면의 다크 모드 포트폴리오](./images/mobile.png)
