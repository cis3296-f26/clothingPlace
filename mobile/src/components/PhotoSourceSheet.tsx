import { useRef } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PhotoSource } from '../media/usePhotoPicker';

type Props = {
  visible: boolean;
  title?: string;
  // Shows a "Remove photo" option when there's already a photo
  hasPhoto?: boolean;
  onSelect: (source: PhotoSource) => void;
  onRemove?: () => void;
  onClose: () => void;
};

// Bottom sheet that asks where the photo should come from
export default function PhotoSourceSheet({
  visible,
  title = 'Profile photo',
  hasPhoto = false,
  onSelect,
  onRemove,
  onClose,
}: Props) {
  // iOS can't open the camera while this sheet is still closing,
  // so on iOS we wait until it has fully closed before running the action.
  const pendingAction = useRef<(() => void) | null>(null);

  const choose = (action: () => void) => {
    if (Platform.OS === 'ios') {
      pendingAction.current = action;
      onClose();
    } else {
      onClose();
      action();
    }
  };

  const runPendingAction = () => {
    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onDismiss={runPendingAction}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
      >
        {/* Stops taps on the sheet from closing it */}
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>

          <Pressable
            style={styles.option}
            onPress={() => choose(() => onSelect('camera'))}
            accessibilityRole="button"
          >
            <Text style={styles.optionIcon}>📷</Text>
            <Text style={styles.optionText}>Take photo</Text>
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.option}
            onPress={() => choose(() => onSelect('library'))}
            accessibilityRole="button"
          >
            <Text style={styles.optionIcon}>🖼️</Text>
            <Text style={styles.optionText}>Choose from library</Text>
          </Pressable>

          {hasPhoto && onRemove && (
            <>
              <View style={styles.divider} />
              <Pressable
                style={styles.option}
                onPress={() => {
                  onClose();
                  onRemove();
                }}
                accessibilityRole="button"
              >
                <Text style={styles.optionIcon}>🗑️</Text>
                <Text style={[styles.optionText, styles.removeText]}>Remove photo</Text>
              </Pressable>
            </>
          )}

          <Pressable style={styles.cancelButton} onPress={onClose} accessibilityRole="button">
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 34,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionIcon: {
    fontSize: 20,
    width: 36,
  },
  optionText: {
    fontSize: 16,
    color: '#111',
  },
  removeText: {
    color: '#c62828',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ddd',
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
