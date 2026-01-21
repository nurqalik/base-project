"use client";
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
import { useRouter } from "next/navigation";
import { loginAction } from "@/server/better-auth/actions";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const router = useRouter();

  /* ---------------- Validation (pure, derived) ---------------- */

  const emailError =
    email.length === 0
      ? "Email is required."
      : !email.includes("@")
        ? "Must be a valid email."
        : null;

  const passwordError = password.length === 0 ? "Password is required." : null;

  const hasError = Boolean(emailError || passwordError);

  async function onSubmit(formData: FormData) {
    setPending(true);

    if (hasError) {
      setEmailTouched(true);
      setPasswordTouched(true);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const result = await loginAction(formData);

    if (result?.error) {
      toast.error(result.error as string);
    } else if (result?.status) {
      toast.success("Good to see you back!");
      router.push("/");
    }

    setPending(false);
  }
  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      action={onSubmit}
    >
      <FieldGroup className="gap-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
          {emailTouched && emailError && (
            <FieldDescription>{emailError}</FieldDescription>
          )}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            name="password"
            type="password"
            required
          />
          {passwordTouched && passwordError && (
            <FieldDescription>{passwordError}</FieldDescription>
          )}
        </Field>
        <Field>
          <Button type="submit" disabled={pending || hasError}>
            {pending ? "Loading.." : "Login"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <GoogleButton />
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
