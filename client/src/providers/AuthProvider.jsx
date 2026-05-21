import { createContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase.config";
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔗 আপনার Vercel লাইভ ব্যাকএন্ড সার্ভার লিংক (এখানে পরিবর্তন করা হয়েছে)
    const baseUrl = 'https://pet-adoption-server-gamma.vercel.app';

    // ✅ CREATE USER (FIXED + DEBUG)
    const createUser = async (email, password) => {
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            console.log("✅ User Created:", result.user);
            return result;
        } catch (error) {
            console.log("🔥 Signup Error:", error.code, error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // ✅ LOGIN USER
    const loginUser = async (email, password) => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log("✅ Login Success:", result.user);
            return result;
        } catch (error) {
            console.log("🔥 Login Error:", error.code, error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // ✅ GOOGLE LOGIN
    const loginWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
            .finally(() => setLoading(false));
    };

    // ✅ LOGOUT
    const logout = () => {
        setLoading(true);
<<<<<<< HEAD
        const baseUrl = import.meta.env.VITE_API_URL || 'http://https://pet-adoption-server-gamma.vercel.app
';

=======
>>>>>>> 41d9006feeca23ba652a7cc96298ff79189a4d27
        return axios.post(`${baseUrl}/logout`, {}, { withCredentials: true })
            .then(() => signOut(auth))
            .finally(() => setLoading(false));
    };

    // ✅ UPDATE PROFILE
    const updateUserProfile = (name, photoURL) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photoURL
        });
    };

    // ✅ AUTH STATE LISTENER
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

<<<<<<< HEAD
            const baseUrl = import.meta.env.VITE_API_URL || 'http://https://pet-adoption-server-gamma.vercel.app
';

=======
>>>>>>> 41d9006feeca23ba652a7cc96298ff79189a4d27
            if (currentUser?.email) {
                const loggedUser = { email: currentUser.email };

                try {
                    await axios.post(`${baseUrl}/jwt`, loggedUser, {
                        withCredentials: true
                    });
                } catch (err) {
                    console.log("🔥 JWT Error:", err.message);
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        createUser,
        loginUser,
        loginWithGoogle,
        logout,
        updateUserProfile
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};
