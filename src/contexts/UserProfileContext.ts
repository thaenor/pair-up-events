import { createContext } from 'react';

import type { UserProfileContextValue } from './UserProfileProvider';

export const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);
