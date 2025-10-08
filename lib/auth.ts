import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  User
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { User as UserType } from '../types';

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign up with email and password
export const signUp = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile
    await updateProfile(user, { displayName: name });

    // Create user document in Firestore
    const userData: Omit<UserType, 'id'> = {
      email: user.email!,
      name: name,
      role: 'traveler',
      preferences: {
        language: 'en',
        currency: 'USD'
      },
      createdAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign out
export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (user: User, updates: { displayName?: string; photoURL?: string }) => {
  try {
    await updateProfile(user, updates);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Update user email
export const updateUserEmail = async (user: User, newEmail: string) => {
  try {
    await updateEmail(user, newEmail);
    
    // Update email in Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      email: newEmail
    });

    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Update user password
export const updateUserPassword = async (user: User, newPassword: string) => {
  try {
    await updatePassword(user, newPassword);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Get user data from Firestore
export const getUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { userData: userDoc.data() as UserType, error: null };
    }
    return { userData: null, error: 'User not found' };
  } catch (error: any) {
    return { userData: null, error: error.message };
  }
};

// Update user preferences
export const updateUserPreferences = async (userId: string, preferences: UserType['preferences']) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      preferences,
      updatedAt: new Date()
    });
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Check if user is admin
export const isAdmin = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserType;
      return userData.role === 'admin';
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Auth state helper functions
export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback);
};