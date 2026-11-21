import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Field, { controlClass } from "../ui/Field";
import { EMPTY_LEAD, SOURCES, STATUSES } from "../../utils/constants";
import { validateLead } from "../../utils/validators";

function toForm(lead) {
  return {
    name: lead.name ?? "",
    email: lead.email ?? "",
    phone: lead.phone ?? "",
    company: lead.company ?? "",
    source: lead.source ?? "",
    status: lead.status ?? "NEW",
  };
}

export default function LeadFormModal({ open, lead, onClose, onSubmit }) {
  const isEdit = Boolean(lead);
  const [values, setValues] = useState(EMPTY_LEAD);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const leadId = lead?.id ?? "new";

  useEffect(() => {
    if (!open) return;
    setValues(lead ? toForm(lead) : { ...EMPTY_LEAD });
    setErrors({});
    setFormError("");
    setSaving(false);
    // Reset only when the dialog opens or a different lead is loaded.
    // `lead` is read from this render, which is the one that changed open/leadId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, leadId]);

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateLead(values);
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    const result = await onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      company: values.company.trim(),
      source: values.source,
      status: values.status,
    });

    if (!result?.ok) {
      setSaving(false);
      setErrors(result?.fieldErrors ?? {});
      setFormError(result?.form ?? "");
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit lead" : "Add lead"}
      description={
        isEdit
          ? "Update contact details or move this lead to a different status."
          : "Every field is required. New leads start as New unless you choose another status."
      }
      onClose={saving ? () => {} : onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="lead-form" loading={saving}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create lead"}
          </Button>
        </>
      }
    >
      <form id="lead-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError ? (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {formError}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="lead-name" label="Name" error={errors.name}>
            <input
              id="lead-name"
              data-autofocus="true"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Ada Lovelace"
              autoComplete="name"
              disabled={saving}
              aria-invalid={Boolean(errors.name) || undefined}
              aria-describedby={errors.name ? "lead-name-error" : undefined}
              className={controlClass(errors.name)}
            />
          </Field>

          <Field id="lead-email" label="Email" error={errors.email}>
            <input
              id="lead-email"
              type="email"
              inputMode="email"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="ada@example.com"
              autoComplete="email"
              disabled={saving}
              aria-invalid={Boolean(errors.email) || undefined}
              aria-describedby={errors.email ? "lead-email-error" : undefined}
              className={controlClass(errors.email)}
            />
          </Field>

          <Field id="lead-phone" label="Phone" error={errors.phone}>
            <input
              id="lead-phone"
              type="tel"
              inputMode="tel"
              value={values.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="+1 555 010 1234"
              autoComplete="tel"
              maxLength={20}
              disabled={saving}
              aria-invalid={Boolean(errors.phone) || undefined}
              aria-describedby={errors.phone ? "lead-phone-error" : undefined}
              className={controlClass(errors.phone)}
            />
          </Field>

          <Field id="lead-company" label="Company" error={errors.company}>
            <input
              id="lead-company"
              value={values.company}
              onChange={(event) => updateField("company", event.target.value)}
              placeholder="Analytical Engines"
              autoComplete="organization"
              disabled={saving}
              aria-invalid={Boolean(errors.company) || undefined}
              aria-describedby={errors.company ? "lead-company-error" : undefined}
              className={controlClass(errors.company)}
            />
          </Field>

          <Field id="lead-source" label="Source" error={errors.source}>
            <div className="relative">
              <select
                id="lead-source"
                value={values.source}
                onChange={(event) => updateField("source", event.target.value)}
                disabled={saving}
                aria-invalid={Boolean(errors.source) || undefined}
                aria-describedby={errors.source ? "lead-source-error" : undefined}
                className={`${controlClass(errors.source)} appearance-none pr-10`}
              >
                <option value="">Select a source</option>
                {SOURCES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
            </div>
          </Field>

          <Field id="lead-status" label="Status" error={errors.status}>
            <div className="relative">
              <select
                id="lead-status"
                value={values.status}
                onChange={(event) => updateField("status", event.target.value)}
                disabled={saving}
                aria-invalid={Boolean(errors.status) || undefined}
                aria-describedby={errors.status ? "lead-status-error" : undefined}
                className={`${controlClass(errors.status)} appearance-none pr-10`}
              >
                {STATUSES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
            </div>
          </Field>
        </div>
      </form>
    </Modal>
  );
}
