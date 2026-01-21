"use client";

import { registerAction } from "@/server/better-auth/actions";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import GoogleButton from "./googleButton";
import Link from "next/link";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retype, setRetype] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [retypeTouched, setRetypeTouched] = useState(false);

  /* ---------------- Validation (pure, derived) ---------------- */

  const emailError =
    email.length === 0
      ? "Email is required."
      : !email.includes("@")
        ? "Must be a valid email."
        : null;

  const passwordError =
    password.length === 0
      ? "Password is required."
      : password.length < 8
        ? "Must be at least 8 characters long."
        : null;

  const retypeError =
    retype.length === 0
      ? "Please confirm your password."
      : retype !== password
        ? "Passwords do not match."
        : null;

  const hasError = Boolean(emailError || passwordError || retypeError);

  /* ---------------- Submit ---------------- */

  async function onSubmit(formData: FormData) {
    setPending(true);

    if (hasError) {
      setEmailTouched(true);
      setPasswordTouched(true);
      setRetypeTouched(true);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const result = await registerAction(formData);

    if (result?.error) {
      toast.error(result.error as string);
      return;
    }

    toast.success("Account created successfully!");
    setPending(false);
    router.push("/");
  }

  /* ---------------- Render ---------------- */

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      action={onSubmit}
      {...props}
    >
      <FieldGroup className="gap-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input name="name" type="text" placeholder="John Doe" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder="m@example.com"
            required
          />
          {emailTouched && emailError && (
            <FieldDescription>{emailError}</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            required
          />
          {passwordTouched && passwordError && (
            <FieldDescription>{passwordError}</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            name="confirmPassword"
            type="password"
            value={retype}
            onChange={(e) => setRetype(e.target.value)}
            onBlur={() => setRetypeTouched(true)}
            required
          />
          {retypeTouched && retypeError && (
            <FieldDescription>{retypeError}</FieldDescription>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={pending || hasError}>
            {pending ? "Creating account..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <GoogleButton />
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link href="/auth/signin">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
