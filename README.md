# 2026 드림유스 여름수련회 체크인 시스템

드림유스 여름수련회 현장 접수를 위한 참가자 체크인 웹앱입니다. 담당자가 참가자를 검색·조회하고, 입금 여부와 명찰 배부 상태를 실시간으로 관리할 수 있습니다.

## 주요 기능

- 담당자 로그인 (이름 + 접속 비밀번호)
- 참가자 목록 조회 및 이름/학년/부서 기준 검색·필터링 (입금 완료/미입금, 명찰 배부/미배부)
- 참가자 상세 정보 확인 및 정보 수정
- 신규 참가자 등록
- 명찰 배부 처리 및 배부 취소
- 입금·명찰 현황 통계 대시보드
- 1분 주기 자동 새로고침 (모달 사용 중에는 일시 정지)

## 기술 스택

- [React 19](https://react.dev/) + TypeScript
- [Vite](https://vite.dev/)
- 백엔드: Google Apps Script (Google Sheets 연동), `VITE_API_URL`로 연결

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 참고해 `.env` 파일을 만들고, Google Apps Script 웹앱 배포 URL을 입력합니다.

```bash
cp .env.example .env
```

```
VITE_API_URL=https://script.google.com/macros/s/xxxxxxxx/exec
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드

```bash
npm run build
```

### 5. 린트

```bash
npm run lint
```

## 프로젝트 구조

```
src/
├── api/            # 백엔드(Apps Script) 통신 클라이언트 및 타입 정의
├── components/     # UI 컴포넌트 (목록, 검색, 통계, 모달 등)
├── hooks/          # 인증, 참가자 데이터, 토스트 알림 훅
├── utils/          # 검색 유틸리티
└── constants.ts    # 학년/부서 등 앱 상수
```

## 백엔드

참가자 데이터는 이 저장소가 아닌 별도의 Google Apps Script 프로젝트(Google Sheets 기반)에서 관리됩니다. 프런트엔드는 `VITE_API_URL`로 지정된 Apps Script 웹앱 엔드포인트에 POST 요청을 보내 데이터를 조회·수정합니다.
