import type { Lead, LeadStatus, ServiceType } from "../leads/lead.model.js";

export const serviceLabels: Record<ServiceType, string> = {
  sofa: "Диван",
  mattress: "Матрац",
  armchair: "Крісло",
  chairs: "Стільці",
  carpet: "Килим",
  car_interior: "Автосалон"
};

export const statusLabels: Record<LeadStatus, string> = {
  new: "Нова",
  taken: "Дозвонилися",
  unreached: "Не дозвонилися",
  scheduled: "Призначено",
  price_sent: "Ціну надіслано",
  closed: "Виконано",
  rejected: "Відмова"
};

export function getServiceLabel(serviceType: ServiceType): string {
  return serviceLabels[serviceType];
}

export function getStatusLabel(status: LeadStatus): string {
  return statusLabels[status];
}

export function formatLeadMessage(lead: Lead): string {
  const details = [
    "🧼 Нова заявка на хімчистку",
    "",
    `ID: #${lead.id}`,
    `Послуга: ${getServiceLabel(lead.serviceType)}`,
    `Район: ${lead.location}`,
    `Телефон: ${lead.phone}`,
    `Коментар: ${lead.comment?.trim() || "—"}`,
    `Статус: ${getStatusLabel(lead.status)}`
  ];

  if (lead.priceAmount) {
    details.push(`Ціна: ${lead.priceAmount} грн`);
  }
  if (lead.scheduledAt) {
    details.push(`Виїзд: ${formatDateTime(lead.scheduledAt)}`);
  }

  return details.join("\n");
}

export function formatLeadList(leads: Lead[]): string {
  if (leads.length === 0) {
    return "У цьому розділі заявок поки немає.";
  }

  return leads
    .map((lead) => {
      const created = formatDateTime(lead.createdAt);
      return [
        `#${lead.id} · ${getServiceLabel(lead.serviceType)} · ${getStatusLabel(lead.status)}`,
        lead.location,
        lead.phone,
        created
      ].join("\n");
    })
    .join("\n\n");
}

export function formatReminderMessage(lead: Lead): string {
  const reason =
    lead.reminderType === "callback"
      ? "Час повторно зателефонувати клієнту."
      : "Нова заявка ще чекає на дзвінок.";

  return ["⏰ Нагадування", "", `Заявка #${lead.id}`, reason, `Телефон: ${lead.phone}`].join("\n");
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
