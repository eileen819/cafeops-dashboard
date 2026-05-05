import { describe, expect, test } from "vitest";

import {
  getDaysSinceLastChecked,
  getDaysUntilNextCycleRestock,
  getEstimatedCurrentStock,
  getInventoryStatus,
  getRecommendedOrderQuantity,
  getRequiredStockUntilNextCycleRestock,
} from "../index";

describe("재고 계산 로직", () => {
  describe("getDaysSinceLastChecked", () => {
    test("마지막 재고 확인일 이후 지난 일수를 계산한다", () => {
      const result = getDaysSinceLastChecked("2026-04-25", "2026-04-28");

      expect(result).toBe(3);
    });

    test("마지막 재고 확인일이 오늘이면 0을 반환한다", () => {
      const result = getDaysSinceLastChecked("2026-04-28", "2026-04-28");

      expect(result).toBe(0);
    });

    test("마지막 재고 확인일이 미래이면 0으로 보정한다", () => {
      const result = getDaysSinceLastChecked("2026-04-30", "2026-04-28");

      expect(result).toBe(0);
    });
  });

  describe("getDaysUntilNextCycleRestock", () => {
    test("다음 보충 가능일까지 남은 일수를 계산한다", () => {
      const result = getDaysUntilNextCycleRestock("2026-04-28", "2026-05-06");

      expect(result).toBe(8);
    });

    test("다음 보충 가능일이 오늘이면 0을 반환한다", () => {
      const result = getDaysUntilNextCycleRestock("2026-04-28", "2026-04-28");

      expect(result).toBe(0);
    });

    test("다음 보충 가능일이 과거이면 0으로 보정한다", () => {
      const result = getDaysUntilNextCycleRestock("2026-04-28", "2026-04-20");

      expect(result).toBe(0);
    });
  });

  describe("getEstimatedCurrentStock", () => {
    test("마지막 확인 재고, 입고 수량, 예상 사용량, 지난 일수를 기준으로 현재 예상 재고를 계산한다", () => {
      const result = getEstimatedCurrentStock({
        lastCheckedStock: 30,
        receivedQuantitySinceLastChecked: 0,
        expectedDailyUsage: 5,
        daysSinceLastChecked: 3,
      });

      expect(result).toBe(15);
    });

    test("계산 결과가 음수이면 0으로 보정한다", () => {
      const result = getEstimatedCurrentStock({
        lastCheckedStock: 5,
        receivedQuantitySinceLastChecked: 0,
        expectedDailyUsage: 4,
        daysSinceLastChecked: 3,
      });

      expect(result).toBe(0);
    });

    test("지난 일수가 0이면 마지막 확인 재고와 입고 수량의 합을 반환한다", () => {
      const result = getEstimatedCurrentStock({
        lastCheckedStock: 30,
        receivedQuantitySinceLastChecked: 10,
        expectedDailyUsage: 5,
        daysSinceLastChecked: 0,
      });

      expect(result).toBe(40);
    });
  });

  describe("getRequiredStockUntilNextCycleRestock", () => {
    test("다음 보충 가능일까지 필요한 기준 재고를 계산한다", () => {
      const result = getRequiredStockUntilNextCycleRestock({
        daysUntilNextCycleRestock: 8,
        expectedDailyUsage: 5,
        bufferStock: 5,
      });

      expect(result).toBe(45);
    });

    test("남은 일수가 0이면 버퍼 재고만 기준 재고로 반환한다", () => {
      const result = getRequiredStockUntilNextCycleRestock({
        daysUntilNextCycleRestock: 0,
        expectedDailyUsage: 5,
        bufferStock: 5,
      });

      expect(result).toBe(5);
    });

    test("예상 하루 사용량이 0이면 버퍼 재고만 기준 재고로 반환한다", () => {
      const result = getRequiredStockUntilNextCycleRestock({
        daysUntilNextCycleRestock: 8,
        expectedDailyUsage: 0,
        bufferStock: 5,
      });

      expect(result).toBe(5);
    });
  });

  describe("getRecommendedOrderQuantity", () => {
    test("필요 기준 재고에서 현재 예상 재고를 뺀 값을 반환한다", () => {
      const result = getRecommendedOrderQuantity({
        requiredStockUntilNextCycleRestock: 45,
        estimatedCurrentStock: 15,
      });

      expect(result).toBe(30);
    });

    test("현재 예상 재고가 필요 기준 재고보다 많으면 0을 반환한다", () => {
      const result = getRecommendedOrderQuantity({
        requiredStockUntilNextCycleRestock: 45,
        estimatedCurrentStock: 50,
      });

      expect(result).toBe(0);
    });
  });

  describe("getInventoryStatus", () => {
    test("현재 예상 재고가 최대 재고보다 크면 overstock을 반환한다", () => {
      const result = getInventoryStatus({
        estimatedCurrentStock: 120,
        requiredStockUntilNextCycleRestock: 45,
        maxStock: 100,
      });

      expect(result).toBe("overstock");
    });

    test("현재 예상 재고가 필요 기준 재고보다 작으면 low를 반환한다", () => {
      const result = getInventoryStatus({
        estimatedCurrentStock: 15,
        requiredStockUntilNextCycleRestock: 45,
        maxStock: 100,
      });

      expect(result).toBe("low");
    });

    test("현재 예상 재고가 필요 기준 재고 이상이고 최대 재고 이하이면 normal을 반환한다", () => {
      const result = getInventoryStatus({
        estimatedCurrentStock: 50,
        requiredStockUntilNextCycleRestock: 45,
        maxStock: 100,
      });

      expect(result).toBe("normal");
    });
  });
});
