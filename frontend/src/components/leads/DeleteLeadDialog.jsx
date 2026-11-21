import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function DeleteLeadDialog({ lead, onClose, onConfirm }) {
  const [pending, setPending] = useState(false);
  const open = Boolean(lead);

  async function confirm() {
    if (!lead) return;
    setPending(true);
    const result = await onConfirm(lead.id);
    if (result?.ok) onClose();
    else setPending(false);
  }

  return (
    <Modal
      open={open}
      title="Delete lead"
      description="This permanently removes the lead and cannot be undone."
      onClose={pending ? () => {} : onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={pending} data-autofocus="true">
            Cancel
          </Button>
          <Button variant="danger" onClick={confirm} loading={pending}>
            {pending ? "Deleting…" : "Delete lead"}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-zinc-700">
        Delete <span className="font-semibold text-zinc-950">{lead?.name}</span>
        {lead?.company ? (
          <>
            {" "}
            from <span className="font-semibold text-zinc-950">{lead.company}</span>
          </>
        ) : null}
        ?
      </p>
    </Modal>
  );
}
