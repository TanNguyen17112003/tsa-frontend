import { useContext } from 'react';
import type { AuthContextType as FirebaseAuthContextType } from 'src/contexts/auth/firebase-context';
import { AuthContext as FirebaseAuthContext } from 'src/contexts/auth/firebase-context';

import type { AuthContextType as JwtAuthContextType } from 'src/contexts/auth/jwt-context';
import { AuthContext as JwtAuthContext } from 'src/contexts/auth/jwt-context';

type AuthContextType = JwtAuthContextType;

export const useAuth = <T = AuthContextType>() => useContext(JwtAuthContext) as T;
export const useFirebaseAuth = <T = FirebaseAuthContextType>() =>
  useContext(FirebaseAuthContext) as T;
