import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "../components/LoginForm";
import { AuthenticatedRedirect } from "../components/AuthenticatedRedirect";

export default function LoginPage() {
  return (
    <AuthenticatedRedirect>
      <div className="bg-[#070a14] flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 shadow-2xl">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
          <LoginForm />
        </div>
      </div>
    </AuthenticatedRedirect>
  );
} 