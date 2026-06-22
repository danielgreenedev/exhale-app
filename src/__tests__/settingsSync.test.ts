jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

import { DEFAULT_ORB_SCALE, DEFAULT_RHYTHM, RHYTHM_STORAGE_KEY } from '@/lib/breathing';
import { DEFAULT_SOUND_PALETTE } from '@/lib/sound';
import { readLocalPracticeSettings } from '@/lib/settingsSync';

describe('practice settings rhythm compatibility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('uses the first-run default settings when nothing is stored', () => {
    expect(readLocalPracticeSettings()).toMatchObject({
      orbScale: DEFAULT_ORB_SCALE,
      soundPalette: DEFAULT_SOUND_PALETTE,
      rhythm: DEFAULT_RHYTHM,
    });
    expect(DEFAULT_RHYTHM).toBe('gentle');
    expect(DEFAULT_SOUND_PALETTE).toBe('warm');
  });

  it('maps the retired Full rhythm to the structured rhythm storage id', () => {
    localStorage.setItem(RHYTHM_STORAGE_KEY, 'full');

    expect(readLocalPracticeSettings().rhythm).toBe('box');
  });

  it('maps the older Slow rhythm to the structured rhythm storage id', () => {
    localStorage.setItem(RHYTHM_STORAGE_KEY, 'slow');

    expect(readLocalPracticeSettings().rhythm).toBe('box');
  });
});
