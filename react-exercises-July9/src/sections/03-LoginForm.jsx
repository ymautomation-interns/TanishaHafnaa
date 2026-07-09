import { useState } from "react";
import { Mail, Lock, CheckCircle2 } from "lucide-react";
import Panel from "../components/Panel.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";

function validate(v) {
  const e = {};
  if (!v.email) e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Enter a valid email address.";
  if (!v.password) e.password = "Password is required.";
  else if (v.password.length < 6) e.password = "Password must be at least 6 characters.";
  return e;
}

export default function LoginFormSection() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(ev) {
    ev.preventDefault();
    const foundErrors = validate(values);
    setErrors(foundErrors);
    setSubmitted(Object.keys(foundErrors).length === 0);
  }

  return (
    <Panel
      eyebrow="03 / FORMS"
      title="Login Form"
      description="Client-side validation with per-field error messages, checked on submit."
      note="Validation only runs on submit, not per keystroke — keeps typing free of extra re-renders."
    >
      <form onSubmit={handleSubmit} className="max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <Input
          label="Email"
          icon={Mail}
          type="email"
          placeholder="you@company.com"
          value={values.email}
          error={errors.email}
          onChange={(e) => {
            setSubmitted(false);
            setValues((v) => ({ ...v, email: e.target.value }));
          }}
        />
        <Input
          label="Password"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          value={values.password}
          error={errors.password}
          onChange={(e) => {
            setSubmitted(false);
            setValues((v) => ({ ...v, password: e.target.value }));
          }}
        />
        <Button type="submit" size="lg" className="w-full">
          Sign in
        </Button>
        {submitted && (
          <p className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle2 size={16} /> Signed in successfully.
          </p>
        )}
      </form>
    </Panel>
  );
}
