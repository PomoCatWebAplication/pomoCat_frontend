// app/pages/calendar/page.tsx
import CalendarPage from "./CalendarClient";
import Me from "@/components/auth/me.api"; // O donde tengas la función Me()

export default async function Page() {
  const user = await Me().catch(() => null);
  
  const userCoins = (user?.coins ?? 0).toString();
  const userId = user?._id ?? "";

  return (
    <CalendarPage 
      userid={userId} 
      coins_user={userCoins}
    />
  );
}