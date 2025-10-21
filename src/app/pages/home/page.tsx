import GetCat from "@/components/cat/cat.api";
import HomeClient from "./HomeClient";
import Me from "@/components/auth/auth.api";
import { SoundProvider } from "@/context/soundContext";
import getSettings from "@/components/settings/settings.api";

const clamp100 = (n: number) => Math.max(0, Math.min(100, n));
const to01 = (pct: number) => clamp100(pct) / 100;

export default async function Page() {
  const cat = await GetCat().catch(() => null);
  const user = await Me().catch(() => null);
  const settings = await getSettings().catch(() => null);

  const svfxVolume = settings?.sfxVolume ?? 50;
  const musicVolume = settings?.musicVolume ?? 30;

  const catSrc = cat?.skin ?? "/cats/defaultCat.png";
  const userCoins = (user?.coins ?? 0).toString();
  const userId = user?._id ?? "";
  return (
    <SoundProvider initialSfxVolumePct={svfxVolume} initialVolumePct={musicVolume}>
      <HomeClient catSrc={catSrc} coins_user={userCoins} userId={userId} />
    </SoundProvider>
  )
}