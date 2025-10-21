import GetCat, { GetItems, type ItemDto } from "@/components/cat/cat.api";
import HomeClient from "./HomeClient";
import Me  from "@/components/auth/me.api";
import { SoundProvider } from "@/context/soundContext";
import getSettings from "@/components/settings/settings.api";

export default async function Page() {
  const cat = await GetCat().catch(() => null);
  const user = await Me().catch(() => null);
  const settings = await getSettings().catch(() => null);
  const itemsCat = await GetItems(cat).catch(() => null);

  const svfxVolume = settings?.sfxVolume ?? 50;
  const musicVolume = settings?.musicVolume ?? 30;

  const catSrc = cat?.skin ?? "/cats/defaultCat.png";
  const userCoins = (user?.coins ?? 0).toString();
  const userId = user?._id ?? "";

  const hatItem: ItemDto | undefined = itemsCat?.find(i => i._id === cat?.hat);
  const accessoryItem: ItemDto | undefined = itemsCat?.find(i => i._id === cat?.accessory);

  return (
    <SoundProvider initialSfxVolumePct={svfxVolume} initialVolumePct={musicVolume}>
      <HomeClient
        catSrc={catSrc}
        coins_user={userCoins}
        userId={userId}
        hat={hatItem}
        accessory={accessoryItem}
      />
    </SoundProvider>
  );
}
