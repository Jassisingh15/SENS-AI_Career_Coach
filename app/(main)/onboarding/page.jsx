import { redirect } from "next/navigation";
import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";
import { getUserOnboardingStatus } from "@/actions/user";

export default async function OnboardingPage({ searchParams }) {
  // ✅ Await searchParams in Next.js 15
  const params = await searchParams;

  const { isOnboarded } = await getUserOnboardingStatus();

  const isEditMode = params?.edit === "true";

  // Only block onboarding on FIRST time, not edit mode
  if (isOnboarded && !isEditMode) {
    redirect("/dashboard");
  }

  return (
    <main>
      <OnboardingForm industries={industries} isEditMode={isEditMode} />
    </main>
  );
}
