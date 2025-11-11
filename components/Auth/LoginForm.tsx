// components/Auth/LoginForm.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  getAdditionalUserInfo,
  setPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  // separate loading + error states so options don't block each other
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(() => {});
  }, []);

  // Handle redirect result (Google fallback)
  useEffect(() => {
    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result) return;
        const user = result.user;
        const info = getAdditionalUserInfo(result);

        if (info?.isNewUser) {
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            name: user.displayName,
            role: 'traveler',
            preferences: { language: 'en', currency: 'USD' },
            createdAt: serverTimestamp(),
            provider: 'google',
          });
        }
        onSuccess();
      } catch (e: any) {
        setError(mapAuthError(e));
      }
    })();
  }, [onSuccess]);

  const mapAuthError = (e: any) => {
    const code = e?.code || '';
    if (code === 'auth/popup-closed-by-user') return 'Sign-in popup was closed. Try again.';
    if (code === 'auth/popup-blocked') return 'Popup was blocked. We’ll try full-page sign-in instead.';
    if (code === 'auth/account-exists-with-different-credential') return 'This email is linked to another sign-in method.';
    if (code === 'auth/invalid-credential') return 'Could not verify your Google sign-in. Please try again.';
    if (code === 'auth/invalid-email') return 'Please enter a valid email address.';
    if (code === 'auth/wrong-password') return 'Incorrect password.';
    if (code === 'auth/user-not-found') return 'No account found for this email.';
    if (code === 'auth/weak-password') return 'Password should be at least 6 characters.';
    return e?.message || 'Something went wrong. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name,
          role: 'traveler',
          preferences: { language: 'en', currency: 'USD' },
          createdAt: serverTimestamp(),
          provider: 'email',
        });
      }
      onSuccess();
    } catch (e: any) {
      setError(mapAuthError(e));
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      // try popup first
      const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      const user = result.user;
      const info = getAdditionalUserInfo(result);
      if (info?.isNewUser) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          name: user.displayName,
          role: 'traveler',
          preferences: { language: 'en', currency: 'USD' },
          createdAt: serverTimestamp(),
          provider: 'google',
        });
      }
      onSuccess();
    } catch (e: any) {
      // fallback to redirect only when popup was blocked/closed
      if (e?.code === 'auth/popup-blocked' || e?.code === 'auth/popup-closed-by-user') {
        try {
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          await signInWithRedirect(auth, provider);
          return; // continue after redirect
        } catch (redirectErr: any) {
          setError(mapAuthError(redirectErr));
        }
      } else {
        setError(mapAuthError(e));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Google Sign In */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:border-primary-gold hover:shadow-md transition-all duration-200 bg-white text-gray-700 font-medium disabled:opacity-50"
      >
        {/* your SVG icon here */}
        {googleLoading ? 'Connecting…' : 'Continue with Google'}
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      {/* Email / Password form (login OR sign-up) */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition-all"
              placeholder="Enter your full name"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition-all"
            placeholder="Enter your email"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition-all"
            placeholder="Enter your password"
            required
            minLength={6}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
        </div>

        <button
          type="submit"
          disabled={emailLoading}
          className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {emailLoading ? (isLogin ? 'Logging in…' : 'Creating account…') : (isLogin ? 'Login' : 'Create Account')}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            className="text-primary-gold hover:text-yellow-600 font-medium transition-colors"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </form>

      <div className="text-xs text-gray-500 text-center">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
}



// //components/Auth/LoginForm.tsx
// 'use client';

// import { useState } from 'react';
// import { 
//   signInWithEmailAndPassword, 
//   createUserWithEmailAndPassword, 
//   updateProfile,
//   GoogleAuthProvider,
//   signInWithPopup,
//   getAdditionalUserInfo // Add this
// } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import { db, auth } from '../../lib/firebase';

// interface LoginFormProps {
//   onSuccess: () => void;
// }

// export default function LoginForm({ onSuccess }: LoginFormProps) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [isLogin, setIsLogin] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       if (isLogin) {
//         await signInWithEmailAndPassword(auth, email, password);
//       } else {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
        
//         await updateProfile(user, { displayName: name });
        
//         await setDoc(doc(db, 'users', user.uid), {
//           email: user.email,
//           name: name,
//           role: 'traveler',
//           preferences: {
//             language: 'en',
//             currency: 'USD'
//           },
//           createdAt: new Date(),
//           provider: 'email'
//         });
//       }
//       onSuccess();
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       const additionalUserInfo = getAdditionalUserInfo(result);

//       // Check if user is new using the proper method
//       if (additionalUserInfo?.isNewUser) {
//         await setDoc(doc(db, 'users', user.uid), {
//           email: user.email,
//           name: user.displayName,
//           role: 'traveler',
//           preferences: {
//             language: 'en',
//             currency: 'USD'
//           },
//           createdAt: new Date(),
//           provider: 'google'
//         });
//       }
      
//       onSuccess();
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ... rest of your JSX remains the same
//   return (
//     <div className="space-y-6">
//       {/* Google Sign In Button */}
//       <button
//         type="button"
//         onClick={handleGoogleSignIn}
//         disabled={loading}
//         className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:border-primary-gold hover:shadow-md transition-all duration-200 bg-white text-gray-700 font-medium disabled:opacity-50"
//       >
//         <svg className="w-5 h-5" viewBox="0 0 24 24">
//           <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//           <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//           <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//           <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//         </svg>
//         Continue with Google
//       </button>

//       {/* Divider and rest of form */}
//       <div className="relative">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-gray-300" />
//         </div>
//         <div className="relative flex justify-center text-sm">
//           <span className="px-2 bg-white text-gray-500">Or continue with email</span>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Form fields remain the same */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//             {error}
//           </div>
//         )}

//         {!isLogin && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition-all"
//               placeholder="Enter your full name"
//               required
//             />
//           </div>
//         )}

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition-all"
//             placeholder="Enter your email"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition-all"
//             placeholder="Enter your password"
//             required
//             minLength={6}
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
//         >
//           {loading ? (
//             <span className="flex items-center justify-center gap-2">
//               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               {isLogin ? 'Logging in...' : 'Creating account...'}
//             </span>
//           ) : (
//             isLogin ? 'Login' : 'Create Account'
//           )}
//         </button>

//         <div className="text-center pt-2">
//           <button
//             type="button"
//             className="text-primary-gold hover:text-yellow-600 font-medium transition-colors"
//             onClick={() => {
//               setIsLogin(!isLogin);
//               setError('');
//             }}
//             disabled={loading}
//           >
//             {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
//           </button>
//         </div>
//       </form>

//       <div className="text-xs text-gray-500 text-center">
//         By continuing, you agree to our Terms of Service and Privacy Policy
//       </div>
//     </div>
//   );
// }