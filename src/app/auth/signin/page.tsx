import { SigninForm } from "@/components/signinForm";
import { Cat } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative flex flex-col gap-4 p-6 md:p-10 lg:block">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 text-lg font-medium">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
              <Cat className="size-4" />
            </div>
            Better Auth.
          </a>
        </div>
        <Image
          height={1000}
          width={1000}
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex justify-center gap-2 md:justify-start">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SigninForm />
          </div>
        </div>
      </div>
    </div>
  );
}
