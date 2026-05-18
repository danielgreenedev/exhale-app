export const SOUND_STORAGE_KEY = 'exhale-sound-palette';

export const SOUND_PALETTES = [
  {
    id: 'air',
    label: 'Air',
    ariaLabel: 'Still Air, filtered air with a barely tonal pad',
  },
  {
    id: 'warm',
    label: 'Warm',
    ariaLabel: 'Warm Current, a softer and fuller pad',
  },
  {
    id: 'low',
    label: 'Deep',
    ariaLabel: 'Deep Ember, darker and more grounded',
  },
  {
    id: 'quiet',
    label: 'Still',
    ariaLabel: 'Still Room, very quiet breath tone with very soft cues',
  },
  {
    id: 'off',
    label: 'Off',
    ariaLabel: 'Sound off',
  },
] as const;

export type SoundPaletteId = (typeof SOUND_PALETTES)[number]['id'];

export const DEFAULT_SOUND_PALETTE: SoundPaletteId = 'air';

export function isSoundPaletteId(value: string | null | undefined): value is SoundPaletteId {
  return SOUND_PALETTES.some((palette) => palette.id === value);
}

export function resolveSoundPalette(value: string | null | undefined): SoundPaletteId {
  return isSoundPaletteId(value) ? value : DEFAULT_SOUND_PALETTE;
}
