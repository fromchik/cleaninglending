import type { ServiceOption } from "../types/lead";

export const serviceOptions: ServiceOption[] = [
  { value: "sofa", label: "Диван", price: "від 900 грн", note: "2-3 місця, тканина або велюр" },
  { value: "mattress", label: "Матрац", price: "від 800 грн", note: "плями, пил, запахи, освіження" },
  { value: "armchair", label: "Крісло", price: "від 450 грн", note: "домашні та офісні крісла" },
  { value: "chairs", label: "Стільці", price: "від 120 грн", note: "за один м'який стілець" },
  { value: "carpet", label: "Килим", price: "від 90 грн/м²", note: "ворс, доріжки, ковролін" },
  { value: "car_interior", label: "Автосалон", price: "від 1800 грн", note: "сидіння, підлога, багажник" }
];
