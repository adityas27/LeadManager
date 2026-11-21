import { useEffect, useState } from "react";
import { Plus, ShieldAlert, Users, UsersRound } from "lucide-react";

import api from "../services/api";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Field from "../components/ui/Field";
import Modal from "../components/ui/Modal";
import { useToast } from "../hooks/useToast.jsx";

export default function EmployeePage() {
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    refreshEmployees();
  }, []);

  useEffect(() => {
    document.title = "Employees · Lead Manager";
  }, []);

  function refreshEmployees() {
    setLoading(true);
    api
      .get("/employees/")
      .then((res) => setEmployees(res.data))
      .catch((err) => {
        toast.error(err.response?.data?.detail || "Failed to load employees");
      })
      .finally(() => setLoading(false));
  }

  function openCreate() {
    setFormData({ username: "", email: "", password: "", firstName: "", lastName: "" });
    setErrors({});
    setFormError("");
    setSaving(false);
    setOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    // Simple validation
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
      };
      const res = await api.post("/employees/create/", payload);
      setEmployees((prev) => [...prev, res.data]);
      setOpen(false);
      setFormData({ username: "", email: "", password: "", firstName: "", lastName: "" });
      setErrors({});
      toast.success("Employee account created successfully");
    } catch (err) {
      setFormError(err.response?.data?.detail || "Failed to create employee");
      if (err.response?.data?.username) setErrors((prev) => ({ ...prev, username: err.response.data.username }));
      if (err.response?.data?.email) setErrors((prev) => ({ ...prev, email: err.response.data.email }));
      if (err.response?.data?.password) setErrors((prev) => ({ ...prev, password: err.response.data.password }));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeleting(null);
    try {
      await api.delete(`/employees/${id}/`);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      toast.success("Employee deleted");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete employee");
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Employees</h1>
            <p className="mt-2 text-sm text-zinc-600">Manage employee accounts</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Employees</h1>
          <p className="mt-2 text-sm text-zinc-600">Create and manage employee accounts</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add employee
        </Button>
      </header>

      <section aria-label="Employee list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {employees.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState
              icon={UsersRound}
              title="No employees yet"
              description="Create an employee account to give them access to the CRM."
              action={
                <Button onClick={openCreate}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add employee
                </Button>
              }
            />
          </div>
        ) : (
          employees.map((emp) => (
            <div key={emp.id} className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-md">
                    {emp.first_name?.[0] || emp.last_name?.[0] || emp.username?.[0] || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{emp.username}</p>
                    <p className="text-xs text-zinc-500">{emp.email}</p>
                  </div>
                </div>
                <div className="rounded-md bg-green-100 px-2 py-1">
                  <span className="text-xs font-semibold text-green-800">Active</span>
                </div>
              </div>
              {(emp.first_name || emp.last_name) && (
                <p className="mt-3 text-sm text-zinc-600">
                  {emp.first_name} {emp.last_name}
                </p>
              )}
              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  className="h-8 w-8 px-0 text-red-600 hover:bg-red-50"
                  onClick={() => setDeleting(emp)}
                  aria-label={`Delete ${emp.username}`}
                >
                  <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))
        )}
      </section>

      <Modal
        open={open}
        title="Create employee account"
        description="Give an employee access to manage leads. They can only view and edit their own leads."
        onClose={() => setOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="employee-form" loading={saving}>
              {saving ? "Creating..." : "Create employee"}
            </Button>
          </>
        }
      >
        <form id="employee-form" onSubmit={handleSubmit} noValidate className="space-y-4">
          {formError && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {formError}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="emp-username" label="Username" error={errors.username}>
              <input
                id="emp-username"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                className={`block w-full rounded-lg border ${
                  errors.username ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500"
                } py-2.5 px-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm`}
                placeholder="john.doe"
                disabled={saving}
              />
            </Field>

            <Field id="emp-email" label="Email" error={errors.email}>
              <input
                id="emp-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className={`block w-full rounded-lg border ${
                  errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500"
                } py-2.5 px-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm`}
                placeholder="john@example.com"
                disabled={saving}
              />
            </Field>

            <Field id="emp-password" label="Password" error={errors.password}>
              <input
                id="emp-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className={`block w-full rounded-lg border ${
                  errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500"
                } py-2.5 px-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm`}
                placeholder="••••••••"
                disabled={saving}
                autoComplete="new-password"
              />
            </Field>

            <Field id="emp-firstname" label="First Name" error={errors.firstName}>
              <input
                id="emp-firstname"
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                className="block w-full rounded-lg border border-zinc-200 py-2.5 px-3 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                placeholder="John"
                disabled={saving}
              />
            </Field>

            <Field id="emp-lastname" label="Last Name" error={errors.lastName}>
              <input
                id="emp-lastname"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                className="block w-full rounded-lg border border-zinc-200 py-2.5 px-3 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                placeholder="Doe"
                disabled={saving}
              />
            </Field>
          </div>
        </form>
      </Modal>

      {deleting && (
        <DeleteEmployeeDialog
          employee={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function DeleteEmployeeDialog({ employee, onClose, onConfirm }) {
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await onConfirm(employee.id);
    setDeleting(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-zinc-900">Delete employee?</h3>
        <p className="mt-2 text-sm text-zinc-600">
          Are you sure you want to delete <strong className="text-zinc-900">{employee.username}</strong>? This action cannot be
          undone and they will lose access to the CRM.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete employee"}
          </Button>
        </div>
      </div>
    </div>
  );
}
