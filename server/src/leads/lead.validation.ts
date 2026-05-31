import { serviceTypes, type CreateLeadInput, type ServiceType } from "./lead.model.js";

type LeadInputPayload = {
  serviceType?: unknown;
  location?: unknown;
  phone?: unknown;
  comment?: unknown;
};

type ValidationResult =
  | { ok: true; value: CreateLeadInput }
  | { ok: false; message: string };

type LeadPhotoPayload = {
  mimetype?: unknown;
  size?: unknown;
};

type PhotoValidationResult =
  | { ok: true }
  | { ok: false; message: string };

function normalize(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function hasValidPhoneFormat(phone: string): boolean {
  if (!/^\+?[\d\s().-]+$/.test(phone)) {
    return false;
  }

  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function isServiceType(value: unknown): value is ServiceType {
  return typeof value === "string" && serviceTypes.includes(value as ServiceType);
}

export function validateLeadInput(payload: LeadInputPayload): ValidationResult {
  const serviceType = normalize(payload.serviceType);
  const location = normalize(payload.location);
  const phone = normalize(payload.phone);
  const comment = normalize(payload.comment);

  if (!serviceType || !location || !phone) {
    return {
      ok: false,
      message: "Заповніть телефон, район / місто та оберіть послугу"
    };
  }

  if (!isServiceType(serviceType)) {
    return {
      ok: false,
      message: "Оберіть послугу зі списку"
    };
  }

  if (location.length < 2) {
    return {
      ok: false,
      message: "Вкажіть район або місто мінімум з 2 символів"
    };
  }

  if (!hasValidPhoneFormat(phone)) {
    return {
      ok: false,
      message: "Вкажіть коректний номер телефону"
    };
  }

  if (comment.length > 500) {
    return {
      ok: false,
      message: "Коментар має бути до 500 символів"
    };
  }

  return {
    ok: true,
    value: {
      serviceType,
      location,
      phone,
      comment
    }
  };
}

export function validateLeadPhotos(photos: LeadPhotoPayload[]): PhotoValidationResult {
  if (photos.length === 0) {
    return {
      ok: false,
      message: "Додайте хоча б одне фото меблів"
    };
  }

  return { ok: true };
}
