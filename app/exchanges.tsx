import { Appbar } from "@/components/customs";
import { useSession } from "@/providers/SessionContext";
import { useRouter } from "expo-router";

export default function ExchangeScreen() {
  const { signOut } = useSession() as { signOut: any };
  const router = useRouter();

  return <>
            <Appbar
              onBack={() => {
                router.back();
              }}
              title="Exchange"
              icons={[
                { name: 'logout', onPress: () => signOut() },
              ]}
            />
          </>;
}