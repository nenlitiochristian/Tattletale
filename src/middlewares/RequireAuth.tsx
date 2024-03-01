import { User, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

type Props = {
    children: React.ReactNode
}

const RequireAuth = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Fetching user...</div>;
    }

    if (!user) {
        navigate('/login');
        return null;
    }

    return <>{children}</>;
}

export default RequireAuth