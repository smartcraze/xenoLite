import { SignupForm } from "@/components/features/auth/signup-form";

export const metadata = {
  title: "Sign up - XenoLite CRM",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full animate-in fade-in zoom-in-95 duration-500">
        <SignupForm />
      </div>
    </div>
  );
}
