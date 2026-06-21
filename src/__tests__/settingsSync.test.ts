jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

import { RHYTHM_STORAGE_KEY } from '@/lib/breathing';
import { readLocalPracticeSettings } from '@/lib/settingsSync';

describe('practice settings rhythm compatibility', () => {
  beforeEach(() => {
    localStorage.clear();
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
