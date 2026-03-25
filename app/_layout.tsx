import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  PaperProvider
} from 'react-native-paper';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { SessionProvider, useSession } from '@/providers/SessionContext';
import Themes from '@/services/Themes';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import { useEffect } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

const InitialLayout = () => { 
  const { user, isLoading } = useSession() as { user: any, isLoading: any };
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if(isLoading && user == undefined) return;
    
    if(user === null) {
      if (path !== "/login" && path !== "/register") {
        router.replace("/login");
        return;
      }
    }  else{
      if (path === "/login" || path === "/register" ) {
        router.replace("/(tabs)");
        return;
      }
    }
  }, [user, isLoading])

  return <>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
              
            </Stack>
          <StatusBar style="auto" />
        </>
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return  <SessionProvider>
            <PaperProvider theme={colorScheme === 'dark' ? Themes.dark : Themes.light}>
              <SafeAreaProvider>
                <InitialLayout />
              </SafeAreaProvider>
            </PaperProvider>
          </SessionProvider>
}
