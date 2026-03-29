import { Appbar, FAB } from '@/components/customs';
import { useSession } from '@/providers/SessionContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'react-native';
import { savePhoto } from '@/services/PhotoService';
import { Platform } from 'react-native';

const EXCHANGES = [
  { id: 'binance', name: 'Binance', color: '#F0B90B' },
  { id: 'mercado_bitcoin', name: 'Mercado Bitcoin', color: '#FF6B00' },
];

export default function HomeScreen() {
  const { signOut } = useSession() as { signOut: any };
  const router = useRouter();
  const theme = useTheme();
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [camera, setCamera] = useState<CameraView | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  // Função para tirar foto
  async function takePicture() {
  if (!camera) return;

  const result = await camera.takePictureAsync({
    quality: 0.8,
    base64: Platform.OS === 'web',
  });

  if (Platform.OS === 'web') {

    let uri = result.base64;

    if (!uri) return;

    // garante que não duplique o prefixo
    if (!uri.startsWith('data:image')) {
      uri = `data:image/jpg;base64,${uri}`;
    }

    setPhoto(uri);

  } else {
    setPhoto(result.uri);
  }
}

  const handlePress = (exchange: any) => {
    router.push({
      pathname: '/exchange',
      params: { exchangeId: exchange.id, exchangeName: exchange.name },
    });
  };

  return (
    <>
      <Appbar
        title="Exchanges"
        icons={[
          { name: 'cog-outline', onPress: () => router.push('/settings') },
          { name: 'logout', onPress: () => signOut() },
        ]}
      />

      <FlatList
        data={EXCHANGES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma exchange cadastrada</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(item)}
            activeOpacity={0.7}
          >
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.cardText}>{item.name}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />

      <FAB
        icon="camera-plus"
        color="white"
        style={{
          ...styles.fab,
          backgroundColor: theme.colors.secondary,
        }}
         onPress={async () => {
          if (!permission?.granted) {
            const res = await requestPermission();
            if (!res.granted) return;
          }

          setShowCamera(true);
        }}
      />

      <FAB
        icon="image"
        style={{
          position: 'absolute',
          right: 16,
          bottom: 100,
        }}
        onPress={() => router.push('/photos')}
      />


     {showCamera && (
    <View style={StyleSheet.absoluteFillObject}>

    {photo ? (
      <>
        <Image source={{ uri: photo }} style={{ flex: 1 }} />

        <View style={{
          position: 'absolute',
          bottom: 40,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
          <TouchableOpacity
            onPress={() => setPhoto(null)}
            style={{
              backgroundColor: 'red',
              padding: 15,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: '#fff' }}>Refazer</Text>
          </TouchableOpacity>

          <TouchableOpacity
           onPress={async () => {
            if (!photo) return;

            await savePhoto(photo);

            setShowCamera(false);
            setPhoto(null);
          }}
            style={{
              backgroundColor: 'green',
              padding: 15,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: '#fff' }}>Usar</Text>
          </TouchableOpacity>
        </View>
      </>
    ) : (
      // 📷 CÂMERA
      <>
        <CameraView
          ref={(ref) => setCamera(ref)}
          style={{ flex: 1 }}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={(result) => {
            console.log('QR Code:', result.data);
            setShowCamera(false);
          }}
        />
        <TouchableOpacity
            style={{
              position: 'absolute',
              top: 60,
              right: 20,
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: 10,
              borderRadius: 8,
            }}
            onPress={() => setShowCamera(false)}
          >
            <Text style={{ color: '#fff' }}>Fechar</Text>
          </TouchableOpacity>
        {/* Botão de captura */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 60,
            alignSelf: 'center',
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: 'white',
            borderWidth: 4,
            borderColor: 'rgba(255,255,255,0.5)',
          }}
          onPress={takePicture}
        />
      </>
    )}

  </View>
)}
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  arrow: {
    fontSize: 22,
    color: '#999',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 60,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});