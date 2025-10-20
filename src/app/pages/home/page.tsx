import GetCat from "@/components/cat/cat.api";
import HomeClient from "./HomeClient";
import Me from "@/components/auth/auth.api";

export default async function Page() {
  const cat = await GetCat().catch(() => null);
  const user = await Me().catch(() => null);
  const catSrc = cat?.skin ?? "/cats/defaultCat.png";
  const userCoins = (user?.coins ?? 0).toString();
  return <HomeClient catSrc={catSrc} coins_user={userCoins} />;
}