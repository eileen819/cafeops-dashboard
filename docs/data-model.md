# CafeOps Dashboard 데이터 모델

## 1. 데이터 모델 작성 목적

CafeOps Dashboard는 재고 상태와 발주 필요 여부를 운영 기준에 따라 자동으로 계산한다.

이를 위해 재고 품목, 입고 정보, 다음 보충 주기, 판매 요약, 차트 데이터의 구조를 먼저 정의하고, 핵심 계산 로직을 UI와 분리해 테스트 가능한 형태로 구현한다.

---

## 2. InventoryItem

재고 품목을 나타내는 기본 데이터 모델이다.

```ts
export type InventoryCategory =
  | "coffee-bean"
  | "milk"
  | "syrup"
  | "beverage"
  | "bakery"
  | "supplies";

export type InventoryUnit = "ea" | "kg" | "g" | "ml" | "l";

export type InventoryStatus = "low" | "normal" | "overstock";

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;

  // 현재 재고 계산 기준
  lastCheckedStock: number;
  lastCheckedDate: string;
  receivedQuantitySinceLastChecked: number;
  expectedDailyUsage: number;

  // 입고 및 보충 주기 기준
  nextRestockDate: string;
  nextCycleRestockDate: string;

  // 운영 기준
  bufferStock: number;
  maxStock: number;

  // 기타
  unit: InventoryUnit;
  supplier?: string;
  updatedAt: string;
}
```

---

## 3. 필드 설명

| 필드                             | 설명                                           |
| -------------------------------- | ---------------------------------------------- |
| id                               | 재고 품목 고유 ID                              |
| name                             | 품목명                                         |
| category                         | 품목 카테고리                                  |
| lastCheckedStock                 | 마지막으로 확인한 재고 수량                    |
| lastCheckedDate                  | 마지막으로 재고를 확인한 날짜                  |
| receivedQuantitySinceLastChecked | 마지막 재고 확인 이후 입고된 수량              |
| expectedDailyUsage               | 하루 평균 예상 사용량                          |
| nextRestockDate                  | 현재 발주 또는 예정 입고가 들어오는 날짜       |
| nextCycleRestockDate             | 이번 입고 이후 다시 재고를 보충할 수 있는 날짜 |
| bufferStock                      | 예외 상황을 대비한 여유 재고                   |
| maxStock                         | 과잉 여부 판단 기준 수량                       |
| unit                             | 재고 단위                                      |
| supplier                         | 공급처                                         |
| updatedAt                        | 마지막 수정일                                  |

---

## 4. 날짜 계산 기준

날짜 변화에 따라 현재 예상 재고와 권장 발주 수량이 달라져야 하므로, 지난 일수와 남은 일수는 고정값으로 저장하지 않는다.

대신 `lastCheckedDate`, `nextRestockDate`, `nextCycleRestockDate`, 오늘 날짜를 기준으로 계산한다.

| 값                        | 계산 기준                      |
| ------------------------- | ------------------------------ |
| daysSinceLastChecked      | 오늘 날짜 - 마지막 재고 확인일 |
| daysUntilNextRestock      | 다음 입고 예정일 - 오늘 날짜   |
| daysUntilNextCycleRestock | 다음 보충 가능일 - 오늘 날짜   |

### 예외 기준

| 상황                                              | 처리                                        |
| ------------------------------------------------- | ------------------------------------------- |
| 마지막 재고 확인일이 오늘인 경우                  | 지난 일수는 0으로 계산                      |
| 마지막 재고 확인일이 미래인 경우                  | 지난 일수는 0으로 계산                      |
| 다음 입고 예정일이 오늘인 경우                    | 남은 일수는 0으로 계산                      |
| 다음 입고 예정일이 과거인 경우                    | 입력 오류 또는 데이터 갱신 필요 상태로 처리 |
| 다음 보충 가능일이 다음 입고 예정일보다 빠른 경우 | 입력 오류로 처리                            |
| 현재 예상 재고가 0보다 작아지는 경우              | 0으로 처리                                  |
| 권장 발주 수량이 0보다 작아지는 경우              | 0으로 처리                                  |

---

## 5. 현재 예상 재고 계산

현재 예상 재고는 마지막 확인 재고에 마지막 확인 이후 입고된 수량을 더하고, 마지막 확인일 이후 예상 사용량을 차감해 계산한다.

### 계산식

`estimatedCurrentStock = Math.max(lastCheckedStock + receivedQuantitySinceLastChecked - expectedDailyUsage * daysSinceLastChecked, 0)`

```ts
const estimatedCurrentStock = Math.max(
  lastCheckedStock +
    receivedQuantitySinceLastChecked -
    expectedDailyUsage * daysSinceLastChecked,
  0,
);
```

### 예시

| 항목                       | 값         |
| -------------------------- | ---------- |
| 마지막 확인 재고           | 30         |
| 마지막 재고 확인일         | 2026-04-25 |
| 오늘 날짜                  | 2026-04-28 |
| 예상 하루 사용량           | 5          |
| 마지막 확인 이후 입고 수량 | 0          |

지난 일수: `3일`

현재 예상 재고: `Math.max(30 + 0 - 5 * 3, 0) = 15`

---

## 6. 다음 보충 주기까지 필요한 기준 재고 계산

다음 보충 주기까지 필요한 기준 재고는 다음 보충 가능일까지 남은 일수, 예상 하루 사용량, 버퍼 재고를 기준으로 계산한다.

### 계산식

`requiredStockUntilNextCycleRestock = daysUntilNextCycleRestock * expectedDailyUsage + bufferStock`

```ts
const requiredStockUntilNextCycleRestock =
  daysUntilNextCycleRestock * expectedDailyUsage + bufferStock;
```

### 예시

| 항목             | 값         |
| ---------------- | ---------- |
| 다음 보충 가능일 | 2026-05-06 |
| 오늘 날짜        | 2026-04-28 |
| 예상 하루 사용량 | 5          |
| 버퍼 재고        | 5          |

다음 보충 가능일까지 남은 일수: `8일`

다음 보충 주기까지 필요한 기준 재고: `8 * 5 + 5 = 45`

---

## 7. 권장 발주 수량 계산

권장 발주 수량은 다음 보충 주기까지 필요한 기준 재고에서 현재 예상 재고를 뺀 값으로 계산한다.

### 계산식

`recommendedOrderQuantity = Math.max(requiredStockUntilNextCycleRestock - estimatedCurrentStock, 0)`

```ts
const recommendedOrderQuantity = Math.max(
  requiredStockUntilNextCycleRestock - estimatedCurrentStock,
  0,
);
```

### 예시

| 항목                                | 값  |
| ----------------------------------- | --- |
| 현재 예상 재고                      | 15  |
| 다음 보충 주기까지 필요한 기준 재고 | 45  |

권장 발주 수량: `Math.max(45 - 15, 0) = 30`

---

## 8. 전체 계산 예시

| 항목                       | 값         |
| -------------------------- | ---------- |
| 마지막 확인 재고           | 30         |
| 마지막 재고 확인일         | 2026-04-25 |
| 오늘 날짜                  | 2026-04-28 |
| 예상 하루 사용량           | 5          |
| 마지막 확인 이후 입고 수량 | 0          |
| 다음 입고 예정일           | 2026-04-29 |
| 다음 보충 가능일           | 2026-05-06 |
| 버퍼 재고                  | 5          |

### 8.1 마지막 확인일 이후 지난 일수

`2026-04-28 - 2026-04-25 = 3일`

### 8.2 현재 예상 재고

`Math.max(30 + 0 - 5 * 3, 0) = 15`

### 8.3 다음 보충 가능일까지 남은 일수

`2026-05-06 - 2026-04-28 = 8일`

### 8.4 다음 보충 주기까지 필요한 기준 재고

`8 * 5 + 5 = 45`

### 8.5 권장 발주 수량

`Math.max(45 - 15, 0) = 30`

따라서 권장 발주 수량은 `30`이다.

---

## 9. 재고 상태 계산

재고 상태는 현재 예상 재고, 다음 보충 주기까지 필요한 기준 재고, 최대 재고를 기준으로 분류한다.

### 상태 기준

| 상태      | 기준                                                                                |
| --------- | ----------------------------------------------------------------------------------- |
| low       | 현재 예상 재고가 다음 보충 주기까지 필요한 기준 재고보다 작은 경우                  |
| normal    | 현재 예상 재고가 다음 보충 주기까지 필요한 기준 재고 이상이고 최대 재고 이하인 경우 |
| overstock | 현재 예상 재고가 최대 재고를 초과하는 경우                                          |

### 판단 순서

1. 현재 예상 재고가 최대 재고를 초과하면 `overstock`으로 분류한다.
2. 현재 예상 재고가 다음 보충 주기까지 필요한 기준 재고보다 작으면 `low`로 분류한다.
3. 그 외에는 `normal`로 분류한다.

```ts
if (estimatedCurrentStock > maxStock) {
  return "overstock";
}

if (estimatedCurrentStock < requiredStockUntilNextCycleRestock) {
  return "low";
}

return "normal";
```

---

## 10. SalesSummary

요약 카드에 사용하는 판매 데이터 모델이다.

```ts
export interface SalesSummary {
  todaySales: number;
  weeklyOrderCount: number;
  lowStockCount: number;
  pendingOrderCount: number;
}
```

| 필드              | 설명              |
| ----------------- | ----------------- |
| todaySales        | 오늘 매출         |
| weeklyOrderCount  | 이번 주 주문 수   |
| lowStockCount     | 재고 부족 품목 수 |
| pendingOrderCount | 발주 필요 품목 수 |

---

## 11. SalesTrendItem

일자별 매출 추이 차트에 사용하는 데이터 모델이다.

```ts
export interface SalesTrendItem {
  date: string;
  sales: number;
  orderCount: number;
}
```

| 필드       | 설명                |
| ---------- | ------------------- |
| date       | 날짜                |
| sales      | 해당 날짜의 매출    |
| orderCount | 해당 날짜의 주문 수 |

---

## 12. CategorySalesRatio

카테고리별 판매 비중 차트에 사용하는 데이터 모델이다.

```ts
export interface CategorySalesRatio {
  category: InventoryCategory;
  sales: number;
  ratio: number;
}
```

| 필드     | 설명                |
| -------- | ------------------- |
| category | 판매 카테고리       |
| sales    | 해당 카테고리 매출  |
| ratio    | 전체 매출 대비 비율 |

---

## 13. API 응답 모델

Mock API를 구성할 때 사용하는 응답 모델이다.

```ts
export interface InventoryListResponse {
  items: InventoryItem[];
}

export interface SalesSummaryResponse {
  summary: SalesSummary;
}

export interface SalesTrendResponse {
  items: SalesTrendItem[];
}

export interface CategorySalesRatioResponse {
  items: CategorySalesRatio[];
}
```

---

## 14. 테스트 대상

핵심 판단 로직은 UI와 분리해 테스트 가능한 함수로 작성한다.

| 함수                                  | 검증 내용                                |
| ------------------------------------- | ---------------------------------------- |
| getDaysSinceLastChecked               | 마지막 재고 확인일 이후 지난 일수 계산   |
| getDaysUntilNextRestock               | 다음 입고 예정일까지 남은 일수 계산      |
| getDaysUntilNextCycleRestock          | 다음 보충 가능일까지 남은 일수 계산      |
| getEstimatedCurrentStock              | 현재 예상 재고 계산                      |
| getRequiredStockUntilNextCycleRestock | 다음 보충 주기까지 필요한 기준 재고 계산 |
| getRecommendedOrderQuantity           | 권장 발주 수량 계산                      |
| getInventoryStatus                    | 부족 / 정상 / 과잉 상태 분류             |

---

## 15. 테스트 케이스 예시

### getEstimatedCurrentStock

| 조건                                                              | 기대 결과                         |
| ----------------------------------------------------------------- | --------------------------------- |
| 마지막 확인 재고 30, 입고 수량 0, 예상 하루 사용량 5, 지난 일수 3 | 15                                |
| 마지막 확인 재고 5, 입고 수량 0, 예상 하루 사용량 4, 지난 일수 3  | 0                                 |
| 지난 일수가 0                                                     | 마지막 확인 재고 + 입고 수량 반환 |

### getRequiredStockUntilNextCycleRestock

| 조건                                                      | 기대 결과 |
| --------------------------------------------------------- | --------- |
| 다음 보충 가능일까지 8일, 예상 하루 사용량 5, 버퍼 재고 5 | 45        |
| 다음 보충 가능일까지 0일, 예상 하루 사용량 5, 버퍼 재고 5 | 5         |
| 예상 하루 사용량 0, 버퍼 재고 5                           | 5         |

### getRecommendedOrderQuantity

| 조건                                 | 기대 결과 |
| ------------------------------------ | --------- |
| 필요 기준 재고 45, 현재 예상 재고 15 | 30        |
| 필요 기준 재고 45, 현재 예상 재고 50 | 0         |

### getInventoryStatus

| 조건                                                 | 기대 결과 |
| ---------------------------------------------------- | --------- |
| 현재 예상 재고 > 최대 재고                           | overstock |
| 현재 예상 재고 < 다음 보충 주기까지 필요한 기준 재고 | low       |
| 현재 예상 재고가 기준 재고 이상이고 최대 재고 이하   | normal    |
