# CafeOps Dashboard FSD 구조 설계

## 1. 설계 목적

CafeOps Dashboard는 재고 목록, 필터/정렬, 상품 등록/수정, 판매 요약, 차트, 계산 로직을 포함한다.

기능이 늘어날수록 컴포넌트와 로직이 섞이지 않도록 FSD 구조를 참고해 역할별로 코드를 분리한다.

이 프로젝트에서는 완전한 대규모 FSD가 아니라, 포트폴리오 프로젝트에 맞춘 간소화 FSD 구조를 적용한다.

---

## 2. Layer 기준

| Layer    | 역할                                       |
| -------- | ------------------------------------------ |
| app      | 앱 초기화, provider, router, 전역 스타일   |
| pages    | 라우트 단위 페이지                         |
| widgets  | 페이지를 구성하는 큰 UI 블록               |
| features | 사용자 행동 단위 기능                      |
| entities | 재고, 판매 등 도메인 데이터와 계산 로직    |
| shared   | 도메인에 의존하지 않는 공통 UI, 유틸, 설정 |

---

## 3. 최종 폴더 구조

```txt
src/
  app/
    providers/
    routes/
    styles/

  pages/
    dashboard/
      ui/
    inventory/
      ui/

  widgets/
    dashboard-summary/
      ui/
    inventory-table/
      ui/
    sales-chart/
      ui/

  features/
    filter-inventory/
      model/
      ui/
    sort-inventory/
      model/
      ui/
    upsert-inventory-item/
      model/
      ui/

  entities/
    inventory/
      api/
      model/
      ui/
    sales/
      api/
      model/

  shared/
    api/
    config/
    lib/
    ui/
```

---

## 4. app

앱 실행에 필요한 전역 설정을 둔다.

| 폴더          | 역할                                         |
| ------------- | -------------------------------------------- |
| app/providers | TanStack Query Provider, MSW 초기화 Provider |
| app/routes    | React Router 라우트 설정                     |
| app/styles    | 전역 스타일                                  |

예상 파일:

```txt
src/app/providers/query-client-provider.tsx
src/app/providers/msw-provider.tsx
src/app/routes/router.tsx
src/app/styles/global.css
```

---

## 5. pages

라우트 단위 화면을 둔다.

| Page          | 경로       | 역할                                   |
| ------------- | ---------- | -------------------------------------- |
| DashboardPage | /          | 운영 요약, 재고 부족 품목, 차트 표시   |
| InventoryPage | /inventory | 재고 목록, 검색, 필터, 정렬, 등록/수정 |

예상 파일:

```txt
src/pages/dashboard/ui/dashboard-page.tsx
src/pages/inventory/ui/inventory-page.tsx
```

---

## 6. widgets

페이지를 구성하는 큰 UI 블록을 둔다.

| Widget            | 역할                                          |
| ----------------- | --------------------------------------------- |
| dashboard-summary | 오늘 매출, 주문 수, 재고 부족 수 등 요약 카드 |
| inventory-table   | 재고 목록 테이블                              |
| sales-chart       | 매출 추이, 카테고리별 판매 비중 차트          |

예상 파일:

```txt
src/widgets/dashboard-summary/ui/dashboard-summary-cards.tsx
src/widgets/inventory-table/ui/inventory-table.tsx
src/widgets/sales-chart/ui/sales-trend-chart.tsx
src/widgets/sales-chart/ui/category-sales-chart.tsx
```

---

## 7. features

사용자 행동 단위 기능을 둔다.

| Feature               | 역할                                   |
| --------------------- | -------------------------------------- |
| filter-inventory      | 검색어, 카테고리 필터 UI와 필터링 기준 |
| sort-inventory        | 정렬 옵션 UI와 정렬 기준               |
| upsert-inventory-item | 상품 등록/수정 폼과 validation schema  |

예상 파일:

```txt
src/features/filter-inventory/model/use-inventory-ui-store.ts
src/features/filter-inventory/ui/inventory-filter-bar.tsx

src/features/sort-inventory/model/sort-inventory-items.ts
src/features/sort-inventory/ui/inventory-sort-select.tsx

src/features/upsert-inventory-item/model/inventory-item-schema.ts
src/features/upsert-inventory-item/ui/inventory-item-form.tsx
src/features/upsert-inventory-item/ui/inventory-item-form-modal.tsx
```

---

## 8. entities

도메인 데이터, API 요청, 계산 로직, 도메인 UI를 둔다.

### inventory

재고 도메인과 관련된 타입, API, 계산 함수, 상태 배지를 둔다.

예상 파일:

```txt
src/entities/inventory/api/inventory-api.ts

src/entities/inventory/model/types.ts
src/entities/inventory/model/get-days-since-last-checked.ts
src/entities/inventory/model/get-days-until-next-restock.ts
src/entities/inventory/model/get-days-until-next-cycle-restock.ts
src/entities/inventory/model/get-estimated-current-stock.ts
src/entities/inventory/model/get-required-stock-until-next-cycle-restock.ts
src/entities/inventory/model/get-recommended-order-quantity.ts
src/entities/inventory/model/get-inventory-status.ts

src/entities/inventory/ui/inventory-status-badge.tsx
```

### sales

판매 요약과 차트 데이터 관련 타입과 API를 둔다.

예상 파일:

```txt
src/entities/sales/api/sales-api.ts
src/entities/sales/model/types.ts
```

---

## 9. shared

도메인에 의존하지 않는 공통 요소를 둔다.

| 폴더          | 역할                                           |
| ------------- | ---------------------------------------------- |
| shared/api    | 공통 fetch client, MSW handler                 |
| shared/config | 상수, 라벨, 옵션                               |
| shared/lib    | 날짜 포맷, 금액 포맷 등 공통 함수              |
| shared/ui     | Button, Input, Select, Modal, Table 등 공통 UI |

예상 파일:

```txt
src/shared/api/http-client.ts
src/shared/api/handlers.ts

src/shared/config/inventory-options.ts

src/shared/lib/format-currency.ts
src/shared/lib/format-date.ts

src/shared/ui/button.tsx
src/shared/ui/input.tsx
src/shared/ui/select.tsx
src/shared/ui/modal.tsx
src/shared/ui/table.tsx
src/shared/ui/empty-state.tsx
src/shared/ui/error-state.tsx
src/shared/ui/loading-state.tsx
```

---

## 10. 의존성 기준

FSD 구조에서는 상위 layer가 하위 layer를 사용할 수 있지만, 하위 layer가 상위 layer에 의존하지 않도록 한다.

| Layer    | 의존 가능                           |
| -------- | ----------------------------------- |
| pages    | widgets, features, entities, shared |
| widgets  | features, entities, shared          |
| features | entities, shared                    |
| entities | shared                              |
| shared   | 없음                                |

---

## 11. 적용 원칙

1. 재고 계산 로직은 `entities/inventory/model`에 둔다.
2. 검색/필터/정렬 UI 상태는 Zustand store로 관리한다.
3. 상품 등록/수정 폼은 `features/upsert-inventory-item`에 둔다.
4. 재고 목록 테이블은 `widgets/inventory-table`에 둔다.
5. 서버 데이터 요청 함수는 각 entity의 `api`에 둔다.
6. 공통 UI 컴포넌트는 `shared/ui`에 둔다.
7. 계산 가능한 값은 상태로 저장하지 않고 model 함수로 계산한다.
