# CafeOps Dashboard 구현 순서

## 1. 구현 순서 작성 목적

CafeOps Dashboard는 재고 계산 로직, Mock API, 서버 상태 관리, 클라이언트 UI 상태, 폼 검증, 차트 UI를 포함한다.

구현 순서를 미리 정해 핵심 도메인 로직부터 검증하고, 이후 API와 UI를 단계적으로 연결한다.

---

## 2. 실행 스크립트 기준

현재 프로젝트는 기존 React Webpack Starter 템플릿을 기반으로 하며, 초기 단계에서는 아래 script를 기준으로 검증한다.

| Script          | 목적                         |
| --------------- | ---------------------------- |
| `npm run dev`   | 개발 서버 실행               |
| `npm run build` | 운영 빌드 검증               |
| `npm run test`  | Vitest 설정 이후 테스트 실행 |

`npm run start`는 현재 정의되어 있지 않으므로 사용하지 않는다.

---

## 3. 구현 원칙

1. UI보다 도메인 타입과 계산 로직을 먼저 작성한다.
2. 계산 가능한 값은 상태로 저장하지 않고 함수로 계산한다.
3. 핵심 계산 로직은 테스트 환경을 구성한 뒤 테스트한다.
4. Mock API를 구성한 뒤 TanStack Query로 서버 상태를 연결한다.
5. Zustand는 검색, 필터, 정렬, 모달 같은 클라이언트 UI 상태에만 사용한다.
6. 상품 등록/수정 폼은 React Hook Form과 Zod로 구현한다.
7. UI는 재고 페이지 → 대시보드 페이지 순서로 구현한다.
8. 현재 단계에서는 `npm run dev`, `npm run build`를 기준으로 동작을 확인하고, 테스트 환경 구성 이후 `npm run test`를 추가한다.

---

## Phase 1. 프로젝트 기반 정리

### 작업

- 기존 스타터 템플릿에서 불필요한 예제 코드 제거
- 프로젝트 이름, 메타 정보 수정
- FSD 폴더 구조 생성
- 라우터 기본 구조 정리
- 전역 스타일 초기화

### 완료 기준

- `npm run dev`가 정상 실행된다.
- `npm run build`가 정상 통과한다.
- `/`와 `/inventory` 라우트가 빈 페이지로 연결된다.
- FSD 폴더 구조가 생성된다.

---

## Phase 2. 도메인 타입 정의

### 작업

- `InventoryItem` 타입 정의
- `InventoryCategory` 타입 정의
- `InventoryUnit` 타입 정의
- `InventoryStatus` 타입 정의
- 판매 요약, 차트 데이터 타입 정의

### 완료 기준

- 데이터 모델 문서와 코드 타입이 일치한다.
- mock data 작성 시 타입 오류가 발생하지 않는다.

---

## Phase 3. 재고 계산 로직 구현

### 작업

- 마지막 재고 확인일 이후 지난 일수 계산
- 다음 보충 가능일까지 남은 일수 계산
- 현재 예상 재고 계산
- 다음 보충 주기까지 필요한 기준 재고 계산
- 권장 발주 수량 계산
- 재고 상태 계산

### 완료 기준

- 계산 로직이 UI 컴포넌트와 분리되어 있다.
- 모든 계산 함수가 `entities/inventory/model`에 위치한다.
- 음수 결과는 `0`으로 보정된다.
- 문서에 정의한 계산식과 코드 구현이 일치한다.

---

## Phase 4. 계산 로직 테스트 환경 구성 및 테스트 작성

### 작업

- Vitest 설치
- 테스트 설정 파일 작성
- `package.json`에 `test` script 추가
- `getEstimatedCurrentStock` 테스트
- `getRequiredStockUntilNextCycleRestock` 테스트
- `getRecommendedOrderQuantity` 테스트
- `getInventoryStatus` 테스트
- 날짜 계산 예외 케이스 테스트

### 완료 기준

- `npm run test`가 정상 실행된다.
- 핵심 계산 함수 테스트가 통과한다.
- 문서에 작성한 계산 예시와 테스트 결과가 일치한다.

---

## Phase 5. Mock API 구성

### 작업

- MSW 설정
- 재고 mock data 작성
- 판매 요약 mock data 작성
- `GET /inventory` handler 작성
- `POST /inventory` handler 작성
- `PATCH /inventory/:id` handler 작성
- 판매 요약 및 차트 API handler 작성

### 완료 기준

- 실제 백엔드 없이 재고 목록 API 응답을 받을 수 있다.
- 등록/수정 요청 후 mock 데이터가 갱신되는 흐름을 확인할 수 있다.
- 로딩, 성공, 실패 상황을 UI에서 구분할 수 있는 기반이 마련된다.

---

## Phase 6. TanStack Query 연결

### 작업

- QueryClient Provider 설정
- `useInventoryItemsQuery` 작성
- `useCreateInventoryItemMutation` 작성
- `useUpdateInventoryItemMutation` 작성
- 판매 요약/차트 query 작성

### 완료 기준

- 재고 목록을 query로 조회한다.
- 등록/수정 성공 후 `["inventory"]` query가 갱신된다.
- 로딩/에러/성공 상태를 UI에서 구분할 수 있다.

---

## Phase 7. Zustand UI 상태 구현

### 작업

- `inventoryUiStore` 작성
- 검색어 상태 관리
- 카테고리 필터 상태 관리
- 정렬 기준 상태 관리
- 등록/수정 모달 상태 관리
- 수정 대상 상품 ID 관리

### 완료 기준

- 검색/필터/정렬 상태가 여러 컴포넌트에서 공유된다.
- 모달 열림/닫힘과 수정 대상 ID가 Zustand로 관리된다.
- 파생 상태는 store에 저장하지 않는다.

---

## Phase 8. 재고 관리 페이지 구현

### 작업

- `InventoryPage` 구현
- `InventoryFilterBar` 구현
- `InventorySortSelect` 구현
- `InventoryTable` 구현
- `InventoryStatusBadge` 구현
- 권장 발주 수량 표시
- Empty / Loading / Error 상태 표시

### 완료 기준

- 재고 목록이 테이블로 표시된다.
- 검색, 필터, 정렬이 정상 동작한다.
- 부족 / 정상 / 과잉 상태가 표시된다.
- 권장 발주 수량이 계산되어 표시된다.
- 데이터가 없는 경우 Empty 상태를 표시한다.
- 요청 실패 시 Error 상태를 표시한다.

---

## Phase 9. 상품 등록/수정 폼 구현

### 작업

- Zod schema 작성
- React Hook Form 연결
- 상품 등록 모달 구현
- 상품 수정 모달 구현
- 등록/수정 mutation 연결

### 완료 기준

- 잘못된 입력값은 제출 전에 차단된다.
- 등록/수정 성공 후 재고 목록이 갱신된다.
- 모달이 정상적으로 닫힌다.
- 수정 모달에서는 기존 상품 데이터가 기본값으로 표시된다.

---

## Phase 10. 대시보드 페이지 구현

### 작업

- `DashboardPage` 구현
- Summary Cards 구현
- 재고 부족 품목 목록 구현
- 판매 추이 차트 구현
- 카테고리별 판매 비중 차트 구현

### 완료 기준

- 오늘 매출, 주문 수, 부족 품목 수, 발주 필요 품목 수가 표시된다.
- 차트 데이터가 시각화된다.
- 부족 품목을 대시보드에서 빠르게 확인할 수 있다.
- 재고 관리 페이지로 이동할 수 있다.

---

## Phase 11. 문서화 및 검증

### 작업

- README 작성
- 구현 기준 정리
- 계산 로직 설명 추가
- 테스트 실행 결과 정리
- 트러블슈팅 문서 작성
- 배포 또는 빌드 결과 확인

### 완료 기준

- 프로젝트 목적, 기능, 기술 스택, 실행 방법이 README에 정리되어 있다.
- 재고 계산 기준이 문서와 코드에서 일치한다.
- `npm run build`가 통과한다.
- 테스트 환경 구성 이후 `npm run test`가 통과한다.
- 주요 기능 흐름이 README 또는 트러블슈팅 문서에 정리되어 있다.
