import { useCallback, useState } from 'react';
import { Linking, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export type PhotoSource = 'camera' | 'library';

export type PhotoPickerError = {
  message: string;
  // True when the user denied camera access for good, so only Settings can turn it back on
  canOpenSettings: boolean;
};

type PhotoPickerOptions = {
  // Crop shape as [width, height]: [1, 1] for profile photos, [4, 3] for product photos
  aspect?: [number, number];
};

// Takes a photo with the camera or picks one from the library.
// Asks for camera permission first and explains what to do if it's denied.
// Reusable anywhere we need a photo (profile picture, product listings, ...).
export function usePhotoPicker({ aspect = [1, 1] }: PhotoPickerOptions = {}) {
  const [aspectWidth, aspectHeight] = aspect;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<PhotoPickerError | null>(null);

  const pickPhoto = useCallback(async (source: PhotoSource): Promise<string | null> => {
    setError(null);
    setBusy(true);

    try {
      // The library doesn't need permission to open, the camera does.
      // Permission requests do nothing on web, and awaiting one there can
      // stop the browser from opening the file picker, so skip it.
      if (source === 'camera' && Platform.OS !== 'web') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
          setError({
            message: permission.canAskAgain
              ? 'Camera access is needed to take a photo. Tap Take Photo again to allow it.'
              : 'Camera access is turned off for ClothingPlace. Turn it on in Settings to take a photo.',
            canOpenSettings: !permission.canAskAgain,
          });
          return null;
        }
      }

      // Cropped to the requested shape, compressed a bit so photos stay small when we upload them later
      const pickerOptions: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [aspectWidth, aspectHeight],
        quality: 0.7,
      };

      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync(pickerOptions)
          : await ImagePicker.launchImageLibraryAsync(pickerOptions);

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      return result.assets[0].uri;
    } catch (err) {
      // For example the iOS Simulator, which has no camera
      console.warn('[photo] could not open picker', err);
      setError({
        message:
          source === 'camera'
            ? "Couldn't open the camera on this device. Try choosing a photo instead."
            : "Couldn't open your photo library.",
        canOpenSettings: false,
      });
      return null;
    } finally {
      setBusy(false);
    }
  }, [aspectWidth, aspectHeight]);

  const clearError = useCallback(() => setError(null), []);

  const openSettings = useCallback(() => {
    Linking.openSettings().catch((err) => console.warn('[photo] could not open settings', err));
  }, []);

  return { pickPhoto, busy, error, clearError, openSettings };
}
