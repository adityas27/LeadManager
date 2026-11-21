export const SOURCES = [
  { value: "WEBSITE", label: "Website" },
  { value: "REFERRAL", label: "Referral" },
  { value: "SOCIAL_MEDIA", label: "Social Media" },
  { value: "COLD_CALL", label: "Cold Call" },
  { value: "OTHER", label: "Other" },
];

export const STATUSES = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "LOST", label: "Lost" },
];

export const EMPTY_LEAD = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "",
  status: "NEW",
};

export function labelFor(options, value) {
  return options.find((option) => option.value === value)?.label ?? value ?? "—";
}
