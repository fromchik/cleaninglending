import { describe, expect, it } from "vitest";
import { validateLeadInput, validateLeadPhotos } from "./lead.validation.js";

describe("validateLeadInput", () => {
  it("accepts a complete lead payload", () => {
    const result = validateLeadInput({
      serviceType: "sofa",
      location: "Київ, Печерськ",
      phone: "+380991112233",
      comment: "Є пляма на підлокітнику"
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({
        serviceType: "sofa",
        location: "Київ, Печерськ",
        phone: "+380991112233",
        comment: "Є пляма на підлокітнику"
      });
    }
  });

  it("rejects missing required fields", () => {
    const result = validateLeadInput({
      serviceType: "",
      location: "",
      phone: ""
    });

    expect(result).toEqual({
      ok: false,
      message: "Заповніть телефон, район / місто та оберіть послугу"
    });
  });

  it("rejects unsupported service types", () => {
    const result = validateLeadInput({
      serviceType: "window",
      location: "Київ",
      phone: "+380991112233"
    });

    expect(result).toEqual({
      ok: false,
      message: "Оберіть послугу зі списку"
    });
  });

  it("rejects too-short locations", () => {
    const result = validateLeadInput({
      serviceType: "sofa",
      location: "К",
      phone: "+380991112233"
    });

    expect(result).toEqual({
      ok: false,
      message: "Вкажіть район або місто мінімум з 2 символів"
    });
  });

  it("rejects invalid phone numbers", () => {
    const result = validateLeadInput({
      serviceType: "sofa",
      location: "Київ",
      phone: "12345"
    });

    expect(result).toEqual({
      ok: false,
      message: "Вкажіть коректний номер телефону"
    });
  });

  it("rejects comments longer than 500 characters", () => {
    const result = validateLeadInput({
      serviceType: "sofa",
      location: "Київ",
      phone: "+380991112233",
      comment: "а".repeat(501)
    });

    expect(result).toEqual({
      ok: false,
      message: "Коментар має бути до 500 символів"
    });
  });

  it("rejects requests without photos", () => {
    const result = validateLeadPhotos([]);

    expect(result).toEqual({
      ok: false,
      message: "Додайте хоча б одне фото меблів"
    });
  });

  it("accepts requests with photos", () => {
    const result = validateLeadPhotos([{ mimetype: "image/jpeg", size: 1024 }]);

    expect(result).toEqual({ ok: true });
  });
});
