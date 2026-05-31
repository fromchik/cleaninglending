import { describe, expect, it } from "vitest";
import { isAdminChat } from "./bot.js";

describe("isAdminChat", () => {
  it("allows only the configured owner chat", () => {
    expect(isAdminChat(123, "123")).toBe(true);
    expect(isAdminChat("123", "123")).toBe(true);
    expect(isAdminChat(456, "123")).toBe(false);
  });
});
