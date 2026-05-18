import { friendlySyncError } from '@/app/stats/page';

describe('friendlySyncError', () => {
  it('softens Supabase email rate limit messages', () => {
    expect(friendlySyncError('Email rate limit exceeded')).toBe('Please wait a minute, then try again.');
    expect(friendlySyncError('Too many requests')).toBe('Please wait a minute, then try again.');
  });

  it('softens invalid or expired code messages', () => {
    expect(friendlySyncError('Token has expired or is invalid')).toBe(
      'That code did not work. Check the email and try again.'
    );
  });

  it('keeps other specific messages when they are useful', () => {
    expect(friendlySyncError('Email address is invalid')).toBe('Email address is invalid');
  });

  it('falls back when no message is available', () => {
    expect(friendlySyncError()).toBe('Something went quiet on our side. Please try again.');
  });
});
