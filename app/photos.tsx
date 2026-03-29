import { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet } from 'react-native';
import { getPhotos } from '@/services/PhotoService';
import { Appbar } from '@/components/customs';
import { useRouter } from 'expo-router';

export default function PhotosScreen() {

  const [photos, setPhotos] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadPhotos();
  }, []);

  async function loadPhotos() {
    const data = await getPhotos();
    setPhotos(data);
  }

  return (
    <>
      <Appbar
        title="Fotos"
        icons={[
          { name: 'arrow-left', onPress: () => router.back() }
        ]}
      />

      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 16,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
});