"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full" data-oid="wm63pdn">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((_error) => {
            const toastTitle =
              flow === "signIn"
                ? "Could not sign in, did you mean to sign up?"
                : "Could not sign up, did you mean to sign in?";
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
        data-oid="901avrb"
      >
        <input
          className="input-field"
          type="email"
          name="email"
          placeholder="Email"
          required
          data-oid="bsvuk_m"
        />

        <input
          className="input-field"
          type="password"
          name="password"
          placeholder="Password"
          required
          data-oid="364q0mz"
        />

        <button
          className="auth-button"
          type="submit"
          disabled={submitting}
          data-oid="k50cnju"
        >
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="text-center text-sm text-slate-600" data-oid="-d0mbne">
          <span data-oid="8-ugl73">
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-blue-500 cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            data-oid="4sg32te"
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-3" data-oid="djbdzgh">
        <hr className="my-4 grow" data-oid="89h-p.f" />
        <span className="mx-4 text-slate-400 " data-oid=":sbq_:l">
          or
        </span>
        <hr className="my-4 grow" data-oid="vg9vdkt" />
      </div>
      <button
        className="auth-button"
        onClick={() => void signIn("anonymous")}
        data-oid="0yqfyms"
      >
        Sign in anonymously
      </button>
    </div>
  );
}
