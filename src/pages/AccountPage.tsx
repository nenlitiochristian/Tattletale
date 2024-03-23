import { useState } from "react";
import { useAuth } from "../middlewares/RequireAuth"
import { signOut, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

type ChangePasswordData = {
    newPassword: string,
    newPasswordConfirmation: string
}

const AccountPage = () => {
    const { user } = useAuth();
    const [passwordData, setPasswordData] = useState<ChangePasswordData>({ newPassword: '', newPasswordConfirmation: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const initial = user.email ? user.email.substring(0, user.email.indexOf('@')).toUpperCase() : 'ERROR';

    const submit = () => {
        if (passwordData.newPassword !== passwordData.newPasswordConfirmation) {
            setError("You must enter the same password twice!");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setError("Password too short!");
            return;
        }
        updatePassword(user, passwordData.newPassword)
            .then(() => {
                //log out
                signOut(auth);
                navigate('/')
            })
            .catch(() => { setError("Unknown error occurred") });
    }

    return (
        <div className='flex items-center justify-center w-full h-full text-black dark:text-white'>
            <div className='flex flex-col gap-2 items-center justify-center p-12 bg-slate-500  dark:bg-slate-800 text-base rounded-lg'>
                <h1 className='text-2xl text-black dark:text-white mb-2'>Hello, {initial}</h1>
                <p className="text-lg text-white mb-1">Password must be at least 6 characters long</p>
                <p className="text-lg text-red-500 mb-2">{error}</p>
                <form className='flex flex-col gap-2 items-center justify-center bg-slate-500  dark:bg-slate-800 text-base rounded-lg' onSubmit={(e) => { e.preventDefault(); submit() }}>
                    <input type="password" placeholder='New password' className='rounded-md p-1 focus:ring-2 focus:ring-slate-700 dark:focus:ring-slate-500 focus:outline-none text-black bg-slate-200'
                        onChange={(e) => { setPasswordData({ ...passwordData, newPassword: e.target.value }) }} value={passwordData.newPassword}
                    ></input>
                    <input type="password" placeholder='Re-enter new password' className='rounded-md p-1 focus:ring-2 focus:ring-slate-700 dark:focus:ring-slate-500 focus:outline-none text-black bg-slate-200'
                        onChange={(e) => { setPasswordData({ ...passwordData, newPasswordConfirmation: e.target.value }) }} value={passwordData.newPasswordConfirmation}></input>
                    <div className="flex w-full gap-2">
                        <button className='bg-red-500 py-0.5 rounded-lg w-full text-lg' onClick={() => { navigate('/') }}>CANCEL</button>
                        <button type='submit' className='bg-indigo-500 p-0.5 w-full rounded-lg text-lg'>CONFIRM</button>
                    </div>
                </form>
            </div>
        </div >
    )
}

export default AccountPage