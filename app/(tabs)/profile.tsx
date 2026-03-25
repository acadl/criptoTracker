import { Appbar } from "@/components/customs";
import { useSession } from "@/providers/SessionContext";
import { useRouter } from "expo-router";

export default function TabTwoScreen() {
    const { signOut } = useSession() as { signOut: any };
  const router = useRouter();

  return  <>
            <Appbar 
              title="Perfil"
              icons={[
                { name: 'cog-outline', onPress: () => router.push('/settings')   },
                { name: 'logout', onPress: () => signOut() },
              ]}
            />
          </>;
}