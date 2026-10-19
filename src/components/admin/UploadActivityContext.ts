import { createContext } from 'react';

// Keep publishing and draft replacement disabled while a photo is uploading.
export const UploadActivityContext = createContext<(uploading: boolean) => void>(() => undefined);
