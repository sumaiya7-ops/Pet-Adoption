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
    const baseUrl = import.meta.env.VITE_API_URL || 'https://pet-adoption-server-gamma.vercel.app';    
    const createUser = async (email, password) => {
        setLoading(true);
        try {
            return await createUserWithEmailAndPassword(auth, email, password);
        } finally {
            setLoading(false);
        }
    };    
    const loginUser = async (email, password) => {
        setLoading(true);
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } finally {
            setLoading(false);
        }
    };    
    const loginWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
            .finally(() => setLoading(false));
    };
    const logout = async () => {
        setLoading(true);
        try {
            await axios.post(`${baseUrl}/logout`, {}, {
                withCredentials: true
            });
            await signOut(auth);

        } finally {
            setLoading(false);
        }
    };   
    const updateUserProfile = (name, photoURL) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photoURL
        });
    };
   
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser?.email) {
                try {
                    await axios.post(`${baseUrl}/jwt`,
                        { email: currentUser.email },
                        { withCredentials: true }
                    );
                } catch (err) {
                    console.log("🔥 JWT Error:", err.message);
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [baseUrl]);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            createUser,
            loginUser,
            loginWithGoogle,
            logout,
            updateUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};