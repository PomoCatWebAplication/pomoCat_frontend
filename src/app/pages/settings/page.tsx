import  Me from "@/components/auth/me.api";
import SettingsClient from "./SettingsClient";
import { SoundProvider } from "@/context/soundContext";
import getSettings from "@/components/settings/settings.api";

export default async function Page() {
  const user = await Me().catch(() => null);
  const settings = await getSettings().catch(() => null);


  if (!user || !settings) {
    return <div>Error loading page</div>;
  }

  return (
    <SoundProvider initialSfxVolumePct={settings.sfxVolume} initialVolumePct={settings.musicVolume}>
      <SettingsClient userCoins={user.coins} propSetVolume={settings.musicVolume} propSetVfx={settings.sfxVolume} userId={user._id} />
    </SoundProvider>
  );
}