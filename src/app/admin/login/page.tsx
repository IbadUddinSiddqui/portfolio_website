import { redirect } from "next/navigation";
import { FadeIn } from "@/components/animations/fade-in";
import { LoginForm } from "./login-form";
import { hasValidSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  // If already authenticated, redirect to dashboard
  const isValid = await hasValidSession();
  if (isValid) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <FadeIn>
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold mx-auto mb-4">
              P
            </div>
            <h1 className="text-xl font-bold tracking-tight">Admin Login</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your password to access the dashboard.
            </p>
          </div>

          {/* Login Form */}
          <div className="rounded-xl border border-card-border bg-card-background p-6">
            <LoginForm />
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
