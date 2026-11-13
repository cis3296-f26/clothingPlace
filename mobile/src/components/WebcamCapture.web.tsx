import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { WebcamCaptureProps } from './WebcamCapture';

// Size of the saved square photo, in pixels
const PHOTO_SIZE = 512;

// Explains why the browser couldn't start the camera
function messageFor(err: unknown): string {
  const name = err instanceof DOMException ? err.name : '';
  switch (name) {
    case 'NotAllowedError':
      return 'Camera access was blocked. Allow the camera for this site (the camera icon in the address bar), then try again.';
    case 'NotFoundError':
      return 'No camera was found on this computer. Try Choose from library instead.';
    case 'NotReadableError':
      return 'Your camera is being used by another app. Close it and try again.';
    default:
      return "Couldn't start the camera. Try Choose from library instead.";
  }
}

// Web version: shows a live webcam preview and captures a square photo.
// Desktop browsers ignore the "open the camera" hint on file inputs and show a
// file picker, so on web we use the browser's camera directly instead.
export default function WebcamCapture({ visible, onCapture, onClose }: WebcamCaptureProps) {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ask for the camera when the screen opens, and turn it off when it closes
  useEffect(() => {
    if (!visible) return;

    let cancelled = false;
    let started: MediaStream | null = null;
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      // Also happens on plain http:// pages other than localhost
      setError('This browser can\'t use the camera here. Try Choose from library instead.');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((s) => {
        started = s;
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
        } else {
          setStream(s);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(messageFor(err));
      });

    return () => {
      cancelled = true;
      started?.getTracks().forEach((t) => t.stop());
      setStream(null);
    };
  }, [visible]);

  // Connect the camera to the preview once both exist
  useEffect(() => {
    if (video && stream) {
      video.srcObject = stream;
      video.play().catch(() => {});
    }
  }, [video, stream]);

  const capture = () => {
    if (!video || video.videoWidth === 0) return;

    // Crop the middle square of the frame and mirror it to match the preview
    const side = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - side) / 2;
    const sy = (video.videoHeight - side) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = PHOTO_SIZE;
    canvas.height = PHOTO_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.translate(PHOTO_SIZE, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, side, side, 0, 0, PHOTO_SIZE, PHOTO_SIZE);

    // A data URI, so the photo still shows after the page reloads
    onCapture(canvas.toDataURL('image/jpeg', 0.85));
    onClose();
  };

  const ready = stream !== null && error === null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Take a photo</Text>

          <View style={styles.preview}>
            {error ? (
              <Text style={styles.errorText} accessibilityRole="alert">
                {error}
              </Text>
            ) : (
              <>
                <video
                  ref={setVideo}
                  autoPlay
                  playsInline
                  muted
                  aria-label="Camera preview"
                  style={videoStyle}
                />
                {!ready && (
                  <View style={styles.loading}>
                    <ActivityIndicator color="#fff" />
                    <Text style={styles.loadingText}>Starting camera...</Text>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose} accessibilityRole="button">
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.captureButton, !ready && styles.disabled]}
              onPress={capture}
              disabled={!ready}
              accessibilityRole="button"
              accessibilityLabel="Capture photo"
            >
              <Text style={styles.captureText}>Capture</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Plain CSS for the <video> element: fill the square and mirror like a selfie camera
const videoStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transform: 'scaleX(-1)',
  backgroundColor: '#111',
} as const;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 14,
  },
  preview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#fff',
    fontSize: 13,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    padding: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  captureButton: {
    backgroundColor: '#111',
  },
  captureText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  disabled: {
    opacity: 0.5,
  },
});
