import GetCat, { GetItems, ItemDto } from "@/components/cat/cat.api";
import ShopClient from "./Shopclient";
import  Me from "@/components/auth/me.api";

export default async function Page() {
  const cat = await GetCat().catch(() => null);
  const user = await Me().catch(() => null)
  const itemsCat = await GetItems(cat).catch(() => null);

  const catSrc = cat?.skin ?? "/cats/defaultCat.png";
  const userCoins = (user?.coins ?? 0).toString();
  const userId = user?._id ?? "";
  const hatItem: ItemDto | undefined = itemsCat?.find(i => i._id === cat?.hat);
  const accessoryItem: ItemDto | undefined = itemsCat?.find(i => i._id === cat?.accessory);


  return (
    <ShopClient catSrc={catSrc} userCoins={userCoins} userId={userId} accessory={accessoryItem} hat={hatItem} />
  )
}