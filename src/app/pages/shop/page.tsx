import GetCat from "@/components/cat/cat.api";
import ShopClient from "./Shopclient";
import Me from "@/components/auth/auth.api";

export default async function Page() {
  const cat = await GetCat().catch(() => null);
  const user = await Me().catch(() => null)
  const catSrc = cat?.skin ?? "/cats/defaultCat.png";
  const userCoins = (user?.coins ?? 0).toString();
  const userId = user?._id ?? "";
  return <ShopClient catSrc={catSrc} userCoins={userCoins} userId={userId}/>;
}