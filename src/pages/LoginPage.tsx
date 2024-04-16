import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

type Props = {}

const LoginPage = ({ }: Props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = (username + "@example.dummy").toLowerCase();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => { navigate('/') })
            .catch(() => { setError(true) });
    }

    return (
        <>
            <div className='flex items-center justify-center w-full h-full text-black dark:text-white'>
                <form className='flex flex-col gap-2 items-center justify-center p-12 bg-zinc-500  dark:bg-zinc-800 text-base rounded-lg' onSubmit={(e) => { handleSubmit(e) }}>
                    <h1 className='text-3xl text-black dark:text-white mb-2'>TattleTaLe</h1>
                    <input type="text" placeholder='Username' className='rounded-md p-1 focus:ring-2 focus:ring-zinc-700 dark:focus:ring-zinc-500 focus:outline-none text-black bg-zinc-200' onChange={e => { setUsername(e.target.value) }}></input>
                    <input type="password" placeholder='Password' className='rounded-md p-1 focus:ring-2 focus:ring-zinc-700 dark:focus:ring-zinc-500 focus:outline-none text-black bg-zinc-200' onChange={e => { setPassword(e.target.value) }}></input>
                    <button type='submit' className='bg-zinc-500 py-0.5 w-full rounded-lg text-lg'>LOGIN</button>
                    {error ? <p className='text-red-600'>Invalid credentials!</p> : <></>}
                </form>
            </div >
        </>
    )
}

export default LoginPage