import Me from "@/components/auth/auth.api";
import CalendarPage from "./CalendarClient";

export default async function Page() {

  const user = await Me().catch(() => null)
  if (!user) {return}
  return (
    <CalendarPage userid={user._id}/>
  )
}
