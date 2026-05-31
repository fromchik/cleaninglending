export type ServiceType = "sofa" | "mattress" | "armchair" | "chairs" | "carpet" | "car_interior";

export type ServiceOption = {
  value: ServiceType;
  label: string;
  price: string;
  note: string;
};
