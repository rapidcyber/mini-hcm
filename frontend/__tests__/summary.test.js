import { getWeeklySummaryPerUser } from "../src/utils/getWeeklySummaryPerUser.js";
import { describe, it, expect } from "@jest/globals";

// Mock attendance data
const mockAttendance = {
  data: {
    data: [
      { userId: "user123", type: "in", timestamp: "2025-10-06T09:05:00" },
      { userId: "user123", type: "out", timestamp: "2025-10-06T18:00:00" },
      { userId: "user123", type: "in", timestamp: "2025-10-07T09:00:00" },
      { userId: "user123", type: "out", timestamp: "2025-10-07T18:30:00" },
    ],
  },
};

// Inject global attendance mock
globalThis.attendance = mockAttendance;

// Mock user
const mockUser = {
  id: "user123",
  schedule: {
    start: "09:00",
    end: "18:00",
  },
};

describe("getWeeklySummaryPerUser", () => {
  it("should compute weekly metrics correctly", () => {
    const result = getWeeklySummaryPerUser(mockUser, mockAttendance);
    expect(result).toBeDefined();
    expect(result[0].userId).toBe("user123");
    expect(result[0].workedHours).toBe(1105);
    expect(result[0].late).toBe(5);
    expect(result[0].overtime).toBe(30);
  });
});
