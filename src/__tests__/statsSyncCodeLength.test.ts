import { expectedCodeLength } from '@/app/stats/page';

describe('expectedCodeLength', () => {
  it('uses a 6-digit code for existing email sign-in', () => {
    expect(expectedCodeLength('signin')).toBe(6);
  });

  it('uses an 8-digit code for anonymous email linking', () => {
    expect(expectedCodeLength('link')).toBe(8);
  });
});
