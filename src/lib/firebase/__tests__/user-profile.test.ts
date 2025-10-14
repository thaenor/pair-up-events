import { describe, expect, it, vi, beforeEach } from 'vitest';

describe('user-profile helpers with disabled Firestore', () => {
  const loadModule = async () => {
    vi.doMock('@/lib/firebase/index', () => ({
      db: null,
    }));

    return import('../user-profile');
  };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('throws a configuration error when fetching a profile without Firestore', async () => {
    const module = await loadModule();

    await expect(module.getUserProfileOnce('user-123')).rejects.toThrow(
      'Profile storage is not configured.',
    );
  });

  it('throws a configuration error when accepting an invite without Firestore', async () => {
    const module = await loadModule();

    await expect(
      module.acceptDuoInvite({
        inviterId: 'inviter-1',
        partnerId: 'partner-2',
        tokenHash: 'hash',
      }),
    ).rejects.toThrow('Profile storage is not configured.');
  });
});
