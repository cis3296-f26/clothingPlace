export type WebcamCaptureProps = {
  visible: boolean;
  // Receives the captured photo's URI
  onCapture: (uri: string) => void;
  onClose: () => void;
};

// Phones use the native camera through usePhotoPicker, so this renders nothing.
// The web version lives in WebcamCapture.web.tsx and is picked automatically on web.
export default function WebcamCapture(_props: WebcamCaptureProps) {
  return null;
}
