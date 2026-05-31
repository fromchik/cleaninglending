import { describe, expect, it } from "vitest";
import { dateKeyboard, leadKeyboard, listMenuKeyboard, reminderKeyboard } from "./keyboards.js";

describe("Telegram keyboards", () => {
  it("shows call result actions for a new lead", () => {
    expect(leadKeyboard({ id: 10, status: "new" })).toEqual({
      inline_keyboard: [
        [
          { text: "📞 Дозвонився", callback_data: "lead:10:reached" },
          { text: "☎️ Не дозвонився", callback_data: "lead:10:unreached" }
        ]
      ]
    });
  });

  it("shows visit date shortcuts", () => {
    expect(dateKeyboard(10).inline_keyboard).toEqual([
      [
        { text: "Сьогодні", callback_data: "lead:10:date:today" },
        { text: "Завтра", callback_data: "lead:10:date:tomorrow" }
      ],
      [{ text: "Інша дата", callback_data: "lead:10:date:custom" }]
    ]);
  });

  it("shows lead sections", () => {
    expect(listMenuKeyboard().inline_keyboard.flat().map((button) => button.callback_data)).toEqual([
      "list:new",
      "list:unreached",
      "list:scheduled",
      "list:closed",
      "list:rejected"
    ]);
  });

  it("uses the retry action for an unreached reminder", () => {
    expect(reminderKeyboard({ id: 10, status: "unreached" }).inline_keyboard).toEqual([
      [{ text: "📞 Подзвонити повторно", callback_data: "lead:10:retry" }]
    ]);
  });
});
