//src/app/(auth)/register/page.tsx

import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

 

export default function RegisterPage() {
  return (
    <AuthShell
      kicker="Get started now"
      title="Registration"
      imageSrc="/assets/images/registration.png"
      imageAlt="Registration illustration"
      reverse
    >
      <RegisterForm />
    </AuthShell>
  );
}