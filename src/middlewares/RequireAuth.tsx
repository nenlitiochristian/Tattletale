import { User, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

type Props = {
    children: React.ReactNode
}

type AuthContextType = {
    user: User,
    setUser: (user: User) => void,
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useCurrentFocusContext must be used within a BooleanProvider');
    }
    return context;
};

const RequireAuth = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [loading, user, navigate]);

    if (loading) {
        return (
            <>
                <div className='flex items-center justify-center w-full h-full text-black dark:text-white'>
                    <div className='flex flex-col gap-2 items-center justify-center p-12 bg-zinc-500  dark:bg-zinc-800 text-base rounded-lg'>
                        <h1 className='text-3xl text-black dark:text-white mb-2'>Fetching User...</h1>
                        <div className='border-t-2 border-r-2 animate-spin size-12 rounded-full flex items-center justify-center'>
                        </div>
                    </div>
                </div >
            </>
        )
    }

    if (!user) {
        return <></>;
    }

    return <AuthContext.Provider value={{ user, setUser }}>
        {children}
    </AuthContext.Provider>;
}

export default RequireAuth