"use server";

import { auth } from "@/server/better-auth";

// type $ERROR_CODES = {
//   USER_NOT_FOUND: string;
//   FAILED_TO_CREATE_USER: string;
//   FAILED_TO_CREATE_SESSION: string;
//   FAILED_TO_UPDATE_USER: string;
//   FAILED_TO_GET_SESSION: string;
//   INVALID_PASSWORD: string;
//   INVALID_EMAIL: string;
//   INVALID_EMAIL_OR_PASSWORD: string;
//   SOCIAL_ACCOUNT_ALREADY_LINKED: string;
//   PROVIDER_NOT_FOUND: string;
//   INVALID_TOKEN: string;
//   ID_TOKEN_NOT_SUPPORTED: string;
//   FAILED_TO_GET_USER_INFO: string;
//   USER_EMAIL_NOT_FOUND: string;
//   EMAIL_NOT_VERIFIED: string;
//   PASSWORD_TOO_SHORT: string;
//   PASSWORD_TOO_LONG: string;
//   USER_ALREADY_EXISTS: string;
//   EMAIL_CAN_NOT_BE_UPDATED: string;
//   CREDENTIAL_ACCOUNT_NOT_FOUND: string;
//   SESSION_EXPIRED: string;
//   FAILED_TO_UNLINK_LAST_ACCOUNT: string;
//   ACCOUNT_NOT_FOUND: string;
//   USER_ALREADY_HAS_PASSWORD: string;
// }

/* ---------------- Helpers ---------------- */

function getFormString(
  formData: FormData,
  key: string
): string | null {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : null;
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Unexpected error occurred.";
}

/* ---------------- Register ---------------- */

export async function registerAction(formData: FormData) {
  const name = getFormString(formData, "name");
  const email = getFormString(formData, "email");
  const password = getFormString(formData, "password");
  const confirmPassword = getFormString(formData, "confirmPassword");

  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
    });

    return { status: "OK" };
  } catch (err: unknown) {
    return { error: getErrorMessage(err) };
  }
}

/* ---------------- Login ---------------- */

export async function loginAction(formData: FormData) {
  const email = getFormString(formData, "email");
  const password = getFormString(formData, "password");

  if (!email || !password) {
    return { error: "All fields are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  try {
    await auth.api.signInEmail({
      body: { email, password },
    });

    return { status: "OK" };
  } catch (err: unknown) {
    return { error: getErrorMessage(err) };
  }
}
