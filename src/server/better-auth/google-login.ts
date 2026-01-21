'use server'
import { auth } from "@/server/better-auth";
import { redirect } from "next/navigation";

export const handleGoogleLogin = async () => {
  const res = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: "/",
    },
  });
  if (!res.url) {
    throw new Error("No URL returned from signInSocial");
  }
  redirect(res.url);
};