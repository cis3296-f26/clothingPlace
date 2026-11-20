export type WebcamCaptureProps = {
  visible: boolean;
  // Receives the captured photo's URI
  onCapture: (uri: string) => void;
  onClose: () => void;
  // Heading shown above the preview
  title?: string;
  // Photo shape as width / height: 1 for profile photos, 4 / 3 for product photos
  aspect?: number;
  // 'user' = front camera, mirrored like a selfie. 'environment' = back camera, not mirrored,
  // so text on clothing reads the right way round.
  facing?: 'user' | 'environment';
};

// Phones use the native camera through usePhotoPicker, so this renders nothing.
// The web version lives in WebcamCapture.web.tsx and is picked automatically on web.
export default function WebcamCapture(_props: WebcamCaptureProps) {
  return null;
}
