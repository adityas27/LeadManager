const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+().\-\s]+$/;

export function validateLead(values) {
  const errors = {};
  const name = values.name?.trim() ?? "";
  const email = values.email?.trim() ?? "";
  const phone = values.phone?.trim() ?? "";
  const company = values.company?.trim() ?? "";

  if (!name) errors.name = "Name is required.";
  else if (name.length > 150) errors.name = "Name must be 150 characters or fewer.";

  if (!email) errors.email = "Email is required.";
  else if (email.length > 254) errors.email = "Email must be 254 characters or fewer.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";

  if (!phone) errors.phone = "Phone is required.";
  else if (phone.length > 20) errors.phone = "Phone must be 20 characters or fewer.";
  else if (!PHONE_PATTERN.test(phone)) {
    errors.phone = "Phone can only include digits and + ( ) . - spaces.";
  } else if (!/\d/.test(phone)) {
    errors.phone = "Phone must include at least one digit.";
  }

  if (!company) errors.company = "Company is required.";
  else if (company.length > 150) errors.company = "Company must be 150 characters or fewer.";

  if (!values.source) errors.source = "Source is required.";
  if (!values.status) errors.status = "Status is required.";

  return errors;
}
