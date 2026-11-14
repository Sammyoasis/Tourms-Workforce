import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  getIdTokenResult
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserRole, AdminSubRole, UserAccount, WorkerProfile, EmployerProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userAccount: UserAccount | null;
  userRole: UserRole;
  adminSubRole: AdminSubRole;
  isAdminVerified: boolean;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; role?: UserRole; error?: string }>;
  signUp: (
    email: string,
    password: string,
    role: 'worker' | 'employer',
    profileData?: Partial<WorkerProfile | EmployerProfile>
  ) => Promise<{ success: boolean; user?: User; error?: string }>;
  signOutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshAuthClaims: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('public');
  const [adminSubRole, setAdminSubRole] = useState<AdminSubRole>('super_admin');
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  // Sync with Firebase Authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        setCurrentUser(user);
        try {
          // 1. Check custom token claims for backend administrative privilege
          const tokenResult = await getIdTokenResult(user, true);
          const hasAdminClaim = tokenResult.claims.role === 'admin';
          const tokenSubRole = (tokenResult.claims.subRole as AdminSubRole) || 'super_admin';

          // 2. Check administrative registry collection doc
          let hasAdminDoc = false;
          let adminDocSubRole: AdminSubRole | undefined;
          try {
            const adminDocSnap = await getDoc(doc(db, 'admins', user.uid));
            if (adminDocSnap.exists()) {
              hasAdminDoc = true;
              const adminData = adminDocSnap.data();
              if (adminData?.subRole) adminDocSubRole = adminData.subRole as AdminSubRole;
            }
          } catch {
            // Unprivileged accounts will be denied read on admins collection by security rules
          }

          const isAuthorizedAdmin = hasAdminClaim || hasAdminDoc;
          setIsAdminVerified(isAuthorizedAdmin);

          // 3. Fetch user record from users/{uid}
          let userDocData: UserAccount | null = null;
          try {
            const userSnap = await getDoc(doc(db, 'users', user.uid));
            if (userSnap.exists()) {
              userDocData = userSnap.data() as UserAccount;
              setUserAccount(userDocData);
            }
          } catch {
            // User doc may not exist yet or offline
          }

          // 4. Derive effective role
          if (isAuthorizedAdmin) {
            setUserRole('admin');
            setAdminSubRole(tokenSubRole || adminDocSubRole || 'super_admin');
          } else if (userDocData?.role) {
            setUserRole(userDocData.role);
          } else {
            // Fallback: check localStorage or default to worker
            const cachedRole = localStorage.getItem('tourms_user_role') as UserRole;
            if (cachedRole && ['worker', 'employer'].includes(cachedRole)) {
              setUserRole(cachedRole);
            } else {
              setUserRole('worker');
            }
          }
        } catch (err) {
          console.error('Error synchronizing user session roles:', err);
          setUserRole('worker');
        }
      } else {
        setCurrentUser(null);
        setUserAccount(null);
        setUserRole('public');
        setIsAdminVerified(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshAuthClaims = async () => {
    if (!currentUser) return;
    try {
      const tokenResult = await getIdTokenResult(currentUser, true);
      const hasAdmin = tokenResult.claims.role === 'admin';
      setIsAdminVerified(hasAdmin);
      if (hasAdmin) {
        setUserRole('admin');
        if (tokenResult.claims.subRole) {
          setAdminSubRole(tokenResult.claims.subRole as AdminSubRole);
        }
      }
    } catch (err) {
      console.warn('Failed to refresh claims:', err);
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; role?: UserRole; error?: string }> => {
    setAuthError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      // Determine role after login
      const tokenResult = await getIdTokenResult(cred.user, true);
      let role: UserRole = 'worker';

      if (tokenResult.claims.role === 'admin') {
        role = 'admin';
      } else {
        try {
          const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
          if (userDoc.exists()) {
            role = (userDoc.data() as UserAccount).role;
          }
        } catch {}
      }

      setUserRole(role);
      localStorage.setItem('tourms_user_role', role);
      return { success: true, role };
    } catch (error: any) {
      const message = mapAuthError(error.code || error.message);
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    role: 'worker' | 'employer',
    profileData?: Partial<WorkerProfile | EmployerProfile>
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = cred.user.uid;
      const now = new Date().toISOString();

      // Create base user document in users/{uid}
      const userDoc: UserAccount = {
        uid,
        email: email.trim(),
        role,
        createdAt: now,
        updatedAt: now
      };
      await setDoc(doc(db, 'users', uid), userDoc);

      // Create initial profile in workers/{uid} or employers/{uid}
      if (role === 'worker') {
        const workerData = profileData as Partial<WorkerProfile> | undefined;
        const workerDoc: Partial<WorkerProfile> = {
          id: uid,
          fullName: workerData?.fullName || email.split('@')[0],
          email: email.trim(),
          phone: workerData?.phone || '',
          isVerified: false,
          phoneVerified: Boolean(workerData?.phoneVerified),
          emailVerified: cred.user.emailVerified,
          location: workerData?.location || { state: 'Oyo', lga: 'Ibadan' },
          ...workerData
        };
        await setDoc(doc(db, 'workers', uid), workerDoc);
      } else {
        const empData = profileData as Partial<EmployerProfile> | undefined;
        const employerLocation = {
          state: empData?.location?.state || 'Oyo',
          lga: empData?.location?.lga || 'Ibadan',
          farmSiteAddress: empData?.location?.farmSiteAddress || 'Commercial Farm Road, Oyo'
        };
        const employerDoc: Partial<EmployerProfile> = {
          id: uid,
          companyName: empData?.companyName || 'Agribusiness Enterprise',
          registrationNumber: empData?.registrationNumber || 'PENDING',
          email: email.trim(),
          cacVerified: false,
          isVerified: false,
          verificationStatus: 'unverified',
          location: employerLocation,
          ...empData
        };
        await setDoc(doc(db, 'employers', uid), employerDoc);
      }

      setUserAccount(userDoc);
      setUserRole(role);
      localStorage.setItem('tourms_user_role', role);

      return { success: true, user: cred.user };
    } catch (error: any) {
      const message = mapAuthError(error.code || error.message);
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  const signOutUser = async (): Promise<void> => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserAccount(null);
      setUserRole('public');
      setIsAdminVerified(false);
      localStorage.removeItem('tourms_user_role');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (error: any) {
      const message = mapAuthError(error.code || error.message);
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userAccount,
        userRole,
        adminSubRole,
        isAdminVerified,
        isLoading,
        authError,
        clearAuthError,
        signIn,
        signUp,
        signOutUser,
        resetPassword,
        refreshAuthClaims
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function mapAuthError(codeOrMsg: string): string {
  if (codeOrMsg.includes('auth/invalid-credential') || codeOrMsg.includes('auth/wrong-password')) {
    return 'Invalid email or password. Please verify your credentials.';
  }
  if (codeOrMsg.includes('auth/user-not-found')) {
    return 'No registered account found with this email address.';
  }
  if (codeOrMsg.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (codeOrMsg.includes('auth/weak-password')) {
    return 'Security passcode must be at least 6 characters long.';
  }
  if (codeOrMsg.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (codeOrMsg.includes('auth/too-many-requests')) {
    return 'Access temporarily disabled due to multiple failed login attempts. Please try again later or reset password.';
  }
  if (codeOrMsg.includes('auth/network-request-failed')) {
    return 'Network communication failure. Please check your internet connection.';
  }
  return codeOrMsg || 'Authentication failed. Please verify your inputs.';
}
