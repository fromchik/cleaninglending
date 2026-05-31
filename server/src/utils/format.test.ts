import { describe, expect, it } from "vitest";
import { formatLeadMessage, formatReminderMessage, getServiceLabel, getStatusLabel } from "./format.js";

describe("format helpers", () => {
  it("maps service and status labels to Ukrainian display text", () => {
    expect(getServiceLabel("sofa")).toBe("Диван");
    expect(getServiceLabel("car_interior")).toBe("Автосалон");
    expect(getStatusLabel("price_sent")).toBe("Ціну надіслано");
  });

  it("formats Telegram lead messages", () => {
    const message = formatLeadMessage({
      id: 123,
      serviceType: "sofa",
      location: "Київ, Оболонь",
      phone: "+380991112233",
      comment: "",
      status: "new",
      createdAt: "2026-05-28T12:00:00.000Z",
      updatedAt: "2026-05-28T12:00:00.000Z",
      telegramMessageId: null
    });

    expect(message).toContain("🧼 Нова заявка на хімчистку");
    expect(message).toContain("ID: #123");
    expect(message).toContain("Послуга: Диван");
    expect(message).toContain("Район: Київ, Оболонь");
    expect(message).toContain("Телефон: +380991112233");
    expect(message).toContain("Коментар: —");
    expect(message).toContain("Статус: Нова");
  });

  it("shows operational details in Telegram lead messages", () => {
    const message = formatLeadMessage({
      id: 124,
      serviceType: "sofa",
      location: "Київ, Позняки",
      phone: "+380991112233",
      comment: "",
      status: "scheduled",
      createdAt: "2026-05-28T12:00:00.000Z",
      updatedAt: "2026-05-28T12:00:00.000Z",
      telegramMessageId: 10,
      callResult: "reached",
      priceAmount: 1800,
      scheduledAt: "2026-05-31T14:30:00",
      reminderType: null,
      reminderAt: null,
      newLeadReminderCount: 0
    });

    expect(message).toContain("Ціна: 1800 грн");
    expect(message).toContain("Виїзд: 31.05");
    expect(message).toContain("14:30");
  });

  it("formats reminder messages with a phone number", () => {
    const message = formatReminderMessage({
      id: 125,
      serviceType: "sofa",
      location: "Київ, Позняки",
      phone: "+380991112233",
      comment: "",
      status: "unreached",
      createdAt: "2026-05-28T12:00:00.000Z",
      updatedAt: "2026-05-28T12:00:00.000Z",
      telegramMessageId: 11,
      callResult: "unreached",
      priceAmount: null,
      scheduledAt: null,
      reminderType: "callback",
      reminderAt: "2026-05-28T13:00:00.000Z",
      newLeadReminderCount: 0
    });

    expect(message).toContain("Нагадування");
    expect(message).toContain("#125");
    expect(message).toContain("+380991112233");
  });
});
