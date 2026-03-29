import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

const PHOTO_DIR = FileSystem.documentDirectory + 'photos/';

// SALVAR FOTO
export async function savePhoto(uri) {

  if (Platform.OS !== 'web') {

    const dir = await FileSystem.getInfoAsync(PHOTO_DIR);

    if (!dir.exists) {
      await FileSystem.makeDirectoryAsync(PHOTO_DIR, { intermediates: true });
    }

    const newPath = PHOTO_DIR + Date.now() + '.jpg';

    await FileSystem.copyAsync({
      from: uri,
      to: newPath,
    });

    return newPath;
  } 
  else {

    const photos = JSON.parse(localStorage.getItem('photos') || '[]');

    photos.push(uri);

    localStorage.setItem('photos', JSON.stringify(photos));

    return uri;
  }
}


// BUSCAR FOTOS
export async function getPhotos() {

  if (Platform.OS !== 'web') {

    const files = await FileSystem.readDirectoryAsync(PHOTO_DIR);

    return files.map(file => PHOTO_DIR + file);
  } 
  else {

    return JSON.parse(localStorage.getItem('photos') || '[]');
  }
}