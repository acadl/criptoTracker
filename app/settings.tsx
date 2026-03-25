import { Appbar } from "@/components/customs";
import { useSession } from "@/providers/SessionContext";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
    const { signOut } = useSession() as { signOut: any };
  const router = useRouter();

  return <>
            <Appbar
              onBack={() => {
                router.back();
              }}
              title="Configurações"
              icons={[
                { name: 'logout', onPress: () => signOut() },
              ]}
            />
          </>;
}