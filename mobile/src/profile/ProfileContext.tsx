import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { loadProfile, persistProfile } from './profileStorage';
import { defaultProfile, ShopperProfile } from './profileTypes';

type ProfileContextValue = {
  profile: ShopperProfile;
  hydrated: boolean;
  updateProfile: (changes: Partial<Pick<ShopperProfile, 'displayName' | 'neighborhood'>>) => void;
  toggleStyleTag: (tag: string) => void;
  // Pass null to remove the photo
  setPhotoUri: (uri: string | null) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

type Props = {
  userId: string;
  children: ReactNode;
};

export function ProfileProvider({ userId, children }: Props) {
  const [profile, setProfile] = useState<ShopperProfile>(() => defaultProfile());
  const [hydrated, setHydrated] = useState(false);

  // Load from storage whenever the signed-in user changes.
  useEffect(() => {
    let cancelled = false;
    setHydrated(false);
    loadProfile(userId).then((stored) => {
      if (cancelled) return;
      setProfile(stored);
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Write back after every change, but never before the initial load finishes.
  useEffect(() => {
    if (hydrated) persistProfile(userId, profile);
  }, [profile, hydrated, userId]);

  const updateProfile = useCallback<ProfileContextValue['updateProfile']>((changes) => {
    setProfile((prev) => ({
      ...prev,
      ...(changes.displayName !== undefined && { displayName: changes.displayName.trim() }),
      ...(changes.neighborhood !== undefined && { neighborhood: changes.neighborhood }),
    }));
  }, []);

  const toggleStyleTag = useCallback((tag: string) => {
    setProfile((prev) => {
      const styleTags = prev.styleTags.includes(tag)
        ? prev.styleTags.filter((t) => t !== tag)
        : [...prev.styleTags, tag];
      return { ...prev, styleTags, styleQuizCompleted: styleTags.length > 0 };
    });
  }, []);

  const setPhotoUri = useCallback((uri: string | null) => {
    setProfile((prev) => ({ ...prev, photoUri: uri }));
  }, []);

  const value = useMemo(
    () => ({ profile, hydrated, updateProfile, toggleStyleTag, setPhotoUri }),
    [profile, hydrated, updateProfile, toggleStyleTag, setPhotoUri],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside <ProfileProvider>');
  return ctx;
}
