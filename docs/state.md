# CafeOps Dashboard 상태 분류

## 1. 상태 분류 목적

CafeOps Dashboard는 재고 목록, 판매 요약, 차트 데이터처럼 API 요청을 통해 받아오는 데이터와 검색어, 필터, 정렬, 모달 열림 여부처럼 화면 안에서만 필요한 상태를 함께 다룬다.

상태를 명확히 분류해 서버 상태와 클라이언트 UI 상태의 책임을 나누고, 기능 구현 시 상태 관리 기준이 흔들리지 않도록 한다.

---

## 2. 상태 분류 기준

| 상태 유형          | 설명                                                             | 관리 방식                    |
| ------------------ | ---------------------------------------------------------------- | ---------------------------- |
| 서버 상태          | API 요청을 통해 받아오는 데이터                                  | TanStack Query `useQuery`    |
| 서버 변경 상태     | 등록, 수정처럼 서버 데이터를 변경하는 요청                       | TanStack Query `useMutation` |
| 클라이언트 UI 상태 | 서버에 저장할 필요는 없지만 여러 컴포넌트에서 공유하는 화면 상태 | Zustand                      |
| 지역 UI 상태       | 특정 컴포넌트 안에서만 필요한 일시적 상태                        | `useState`                   |
| 파생 상태          | 기존 데이터와 UI 상태로 계산할 수 있는 값                        | 계산 함수 또는 selector      |
| 폼 상태            | 상품 등록/수정 입력값과 검증 상태                                | React Hook Form + Zod        |

---

## 3. 서버 상태

서버 상태는 Mock API를 통해 요청하고, TanStack Query의 `useQuery`로 관리한다.

| 상태                 | 설명                                        | Query Key                     |
| -------------------- | ------------------------------------------- | ----------------------------- |
| 재고 목록            | 전체 재고 품목 목록                         | `["inventory"]`               |
| 판매 요약            | 오늘 매출, 이번 주 주문 수, 부족 품목 수 등 | `["sales", "summary"]`        |
| 일자별 매출 추이     | 차트에 표시할 날짜별 매출 데이터            | `["sales", "trend"]`          |
| 카테고리별 판매 비중 | 차트에 표시할 카테고리별 판매 비율          | `["sales", "category-ratio"]` |

---

## 4. 서버 변경 상태

상품 등록과 수정은 TanStack Query의 `useMutation`으로 처리한다.

| 기능                   | 설명                        | 처리 방식                                        |
| ---------------------- | --------------------------- | ------------------------------------------------ |
| 상품 등록              | 새 재고 품목 추가           | `useMutation`                                    |
| 상품 수정              | 기존 재고 품목 수정         | `useMutation`                                    |
| 등록/수정 후 목록 갱신 | 변경 후 재고 목록 다시 조회 | `invalidateQueries({ queryKey: ["inventory"] })` |

### 처리 흐름

1. 사용자가 상품 등록 또는 수정 폼을 제출한다.
2. React Hook Form과 Zod로 입력값을 검증한다.
3. 검증을 통과하면 `useMutation`으로 Mock API 요청을 보낸다.
4. 요청 성공 시 `["inventory"]` query를 invalidate한다.
5. 재고 목록을 다시 조회해 화면을 갱신한다.
6. Zustand로 관리하는 모달 상태를 닫는다.

---

## 5. 클라이언트 UI 상태

클라이언트 UI 상태는 서버에 저장할 필요는 없지만 여러 컴포넌트에서 공유해야 하는 화면 상태다.

CafeOps Dashboard에서는 검색어, 카테고리 필터, 정렬 기준, 등록/수정 모달 상태를 Zustand로 관리한다.

| 상태                     | 설명                          | 관리 방식 |
| ------------------------ | ----------------------------- | --------- |
| 검색어                   | 상품명 검색 입력값            | Zustand   |
| 선택된 카테고리          | 카테고리 필터 값              | Zustand   |
| 정렬 기준                | 재고 부족순, 입고 예정일순 등 | Zustand   |
| 등록/수정 모달 열림 여부 | 상품 폼 모달 표시 상태        | Zustand   |
| 수정 대상 상품 ID        | 현재 수정 중인 재고 품목 ID   | Zustand   |

---

## 6. Zustand Store 설계

재고 페이지에서 사용하는 UI 상태는 `inventoryUiStore`로 분리한다.

```ts
type InventoryCategory =
  | "coffee-bean"
  | "milk"
  | "syrup"
  | "beverage"
  | "bakery"
  | "supplies";

type InventorySortOption =
  | "low-stock"
  | "recommended-order"
  | "restock-date"
  | "estimated-stock"
  | "name";

interface InventoryUiState {
  keyword: string;
  selectedCategory: InventoryCategory | "all";
  sortBy: InventorySortOption;
  isFormModalOpen: boolean;
  editingItemId: string | null;

  setKeyword: (keyword: string) => void;
  setSelectedCategory: (category: InventoryCategory | "all") => void;
  setSortBy: (sortBy: InventorySortOption) => void;

  openCreateModal: () => void;
  openEditModal: (itemId: string) => void;
  closeFormModal: () => void;
  resetFilters: () => void;
}
```

### Store 책임

| 책임           | 설명                               |
| -------------- | ---------------------------------- |
| 필터 상태 관리 | 검색어와 카테고리 선택값 관리      |
| 정렬 상태 관리 | 현재 정렬 기준 관리                |
| 모달 상태 관리 | 상품 등록/수정 모달 열림 여부 관리 |
| 수정 대상 관리 | 현재 수정 중인 상품 ID 관리        |
| 필터 초기화    | 검색어, 카테고리, 정렬 기준 초기화 |

---

## 7. 지역 UI 상태

한 컴포넌트 안에서만 필요한 일시적인 상태는 Zustand에 넣지 않고 `useState`로 관리한다.

| 상태                    | 설명                                               | 관리 방식           |
| ----------------------- | -------------------------------------------------- | ------------------- |
| 드롭다운 내부 열림 상태 | 특정 select/dropdown 컴포넌트 안에서만 필요한 상태 | `useState`          |
| 임시 hover 상태         | 특정 UI 컴포넌트의 일시적 상태                     | CSS 또는 `useState` |
| 로컬 탭 상태            | 한 컴포넌트 안에서만 쓰는 탭 선택값                | `useState`          |

---

## 8. 폼 상태

상품 등록/수정 폼은 React Hook Form과 Zod로 관리한다.

| 상태        | 설명                               | 관리 방식                       |
| ----------- | ---------------------------------- | ------------------------------- |
| 입력값      | 상품명, 카테고리, 재고 수량 등     | React Hook Form                 |
| 검증 상태   | 필수 입력, 숫자 범위, 날짜 조건 등 | Zod                             |
| 제출 상태   | 제출 중 / 성공 / 실패              | React Hook Form + `useMutation` |
| 에러 메시지 | 필드별 검증 실패 메시지            | Zod error message               |

폼 입력값은 서버에 저장되기 전의 임시 값이므로 Zustand에 저장하지 않는다.

---

## 9. 파생 상태

파생 상태는 서버 상태 또는 클라이언트 UI 상태를 바탕으로 계산할 수 있으므로 별도 상태로 저장하지 않는다.

| 파생 상태                           | 계산 기준                                                   |
| ----------------------------------- | ----------------------------------------------------------- |
| 현재 예상 재고                      | 마지막 확인 재고, 입고 수량, 예상 사용량, 지난 일수         |
| 다음 보충 주기까지 필요한 기준 재고 | 다음 보충 가능일까지 남은 일수, 예상 하루 사용량, 버퍼 재고 |
| 권장 발주 수량                      | 필요한 기준 재고 - 현재 예상 재고                           |
| 재고 상태                           | 현재 예상 재고, 필요한 기준 재고, 최대 재고                 |
| 필터링된 재고 목록                  | 재고 목록 + 검색어 + 카테고리                               |
| 정렬된 재고 목록                    | 필터링된 재고 목록 + 정렬 기준                              |
| 재고 부족 품목 수                   | 재고 상태가 부족인 품목 개수                                |
| 발주 필요 품목 수                   | 권장 발주 수량이 0보다 큰 품목 개수                         |

---

## 10. 상태를 저장하지 않는 기준

아래 값들은 계산 가능한 값이므로 Zustand나 React state에 저장하지 않는다.

| 값                                  | 저장하지 않는 이유                            |
| ----------------------------------- | --------------------------------------------- |
| 현재 예상 재고                      | 날짜와 재고 데이터로 계산 가능                |
| 다음 보충 주기까지 필요한 기준 재고 | 날짜와 사용량으로 계산 가능                   |
| 권장 발주 수량                      | 필요한 기준 재고와 현재 예상 재고로 계산 가능 |
| 재고 상태                           | 계산 함수로 도출 가능                         |
| 필터링된 목록                       | 검색어와 카테고리로 계산 가능                 |
| 정렬된 목록                         | 정렬 기준으로 계산 가능                       |

이 값들을 상태로 저장하면 원본 데이터와 계산 결과가 어긋날 수 있으므로, 렌더링 시점에 함수로 계산한다.

---

## 11. 상태 관리 원칙

1. API로 받아오는 데이터는 TanStack Query `useQuery`로 관리한다.
2. 서버 데이터를 변경하는 등록/수정 요청은 TanStack Query `useMutation`으로 처리한다.
3. 여러 컴포넌트에서 공유하는 UI 상태는 Zustand로 관리한다.
4. 한 컴포넌트 안에서만 필요한 일시적 상태는 `useState`로 관리한다.
5. 상품 등록/수정 폼은 React Hook Form과 Zod로 관리한다.
6. 계산 가능한 값은 별도 상태로 저장하지 않는다.
7. mutation 이후에는 관련 query를 invalidate해 화면 데이터를 갱신한다.
8. 계산 로직은 UI 컴포넌트에서 직접 작성하지 않고 entity model 함수로 분리한다.

---

## 12. 예시 흐름

### 12.1 재고 목록 조회

1. `InventoryPage` 진입
2. `useInventoryItemsQuery` 실행
3. Mock API `GET /inventory` 요청
4. TanStack Query가 재고 목록 캐싱
5. Zustand에서 검색어, 카테고리, 정렬 기준을 가져온다.
6. 재고 목록과 UI 상태를 바탕으로 필터링/정렬된 목록을 계산한다.
7. 테이블에 표시한다.

---

### 12.2 상품 등록

1. 사용자가 상품 등록 버튼을 클릭한다.
2. Zustand의 `openCreateModal`을 호출한다.
3. 상품 등록 모달이 열린다.
4. React Hook Form으로 입력값을 관리한다.
5. Zod로 입력값을 검증한다.
6. 검증 통과 시 `useCreateInventoryItemMutation`을 실행한다.
7. Mock API `POST /inventory` 요청을 보낸다.
8. 성공 후 `["inventory"]` query를 invalidate한다.
9. Zustand의 `closeFormModal`을 호출해 모달을 닫는다.

---

### 12.3 상품 수정

1. 사용자가 테이블에서 수정 버튼을 클릭한다.
2. Zustand의 `openEditModal(itemId)`를 호출한다.
3. Zustand에 `editingItemId`가 저장되고, 상품 수정 모달이 열린다.
4. 재고 목록에서 `editingItemId`에 해당하는 상품을 찾는다.
5. React Hook Form에 기존 상품 값을 주입한다.
6. 사용자가 값을 수정한다.
7. Zod 검증 통과 시 `useUpdateInventoryItemMutation`을 실행한다.
8. Mock API `PATCH /inventory/:id` 요청을 보낸다.
9. 성공 후 `["inventory"]` query를 invalidate한다.
10. Zustand의 `closeFormModal`을 호출해 모달을 닫는다.

---

### 12.4 검색 / 필터 / 정렬

1. 사용자가 검색어를 입력하거나 카테고리/정렬 옵션을 변경한다.
2. Zustand store의 `keyword`, `selectedCategory`, `sortBy`가 변경된다.
3. 서버에서 받아온 원본 재고 목록은 변경하지 않는다.
4. 렌더링 시점에 검색어, 카테고리, 정렬 기준을 적용해 파생 목록을 계산한다.
5. 계산된 목록을 테이블에 표시한다.
