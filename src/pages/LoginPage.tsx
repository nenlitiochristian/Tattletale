import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

type Props = {}

const LoginPage = (props: Props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = username + "@example.dummy";
        signInWithEmailAndPassword(auth, email, password)
            .then(() => { navigate('/') })
            .catch(() => { setError(true) });
    }

    return (
        <>
            <div className='flex items-center justify-center w-full h-svh'>
                <form className='flex flex-col gap-2 items-center justify-center p-5 bg-violet-700 text-base' onSubmit={(e) => { handleSubmit(e) }}>
                    <input type="text" placeholder='Username' className='' onChange={e => { setUsername(e.target.value) }}></input>
                    <input type="password" placeholder='Password' onChange={e => { setPassword(e.target.value) }}></input>
                    <button type='submit' className='bg-black'>Login</button>
                    {error ? <p className='text-red-600'>Invalid credentials!</p> : <></>}
                </form>
            </div>
        </>
    )
}

export default LoginPage