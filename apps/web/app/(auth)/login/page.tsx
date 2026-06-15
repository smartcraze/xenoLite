import { LoginForm } from "@/components/features/auth/login-form";

export const metadata = {
  title: "Login - XenoLite CRM",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full animate-in fade-in zoom-in-95 duration-500">
        <LoginForm />
      </div>
    </div>
  );
}
