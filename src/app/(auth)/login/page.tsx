//src/app/(auth)/login/page.tsx

import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

 

export default function LoginPage() {
  return (
    <AuthShell
      kicker="Welcome back"
      title="Login to your account"
      imageSrc="/assets/images/login.png"
      imageAlt="Login illustration"
    >
      <LoginForm />
    </AuthShell>
  );
}