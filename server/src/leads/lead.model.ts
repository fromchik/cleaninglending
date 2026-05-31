export const serviceTypes = [
  "sofa",
  "mattress",
  "armchair",
  "chairs",
  "carpet",
  "car_interior"
] as const;

export type ServiceType = (typeof serviceTypes)[number];

export const leadStatuses = [
  "new",
  "taken",
  "unreached",
  "scheduled",
  "price_sent",
  "closed",
  "rejected"
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export const reminderTypes = ["new_first", "new_second", "callback"] as const;
export type ReminderType = (typeof reminderTypes)[number];

export type CallResult = "reached" | "unreached";

export type Lead = {
  id: number;
  serviceType: ServiceType;
  location: string;
  phone: string;
  comment: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  telegramMessageId: number | null;
  callResult: CallResult | null;
  priceAmount: number | null;
  scheduledAt: string | null;
  reminderType: ReminderType | null;
  reminderAt: string | null;
  newLeadReminderCount: number;
};

export type LeadPhoto = {
  id: number;
  leadId: number;
  fileName: string;
  filePath: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};

export type CreateLeadInput = {
  serviceType: ServiceType;
  location: string;
  phone: string;
  comment?: string;
};

export type CreateLeadPhotoInput = {
  fileName: string;
  filePath: string;
  mimeType: string;
  sizeBytes: number;
};
