import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"

const HomePage = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;

    const logout = () => {
        signOut(auth).then(() => { navigate('/login') }).catch();
    }

    if (!user) {
        return <></>
    }

    const initial = user.email ? user.email.substring(0, user.email.indexOf('@')).toUpperCase() : 'ERROR';
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-white text-4xl sm:text-2xl">TattleTaLe</h1>
            <h1 className="text-white text-2xl sm:text-xl">TPA To-do List</h1>
            <p className="">Welcome, {initial}</p>
            <button onClick={logout}>logout</button>
            <div className="prose-invert prose">
                <h2>TPA</h2>
                <p>Lmao</p>
            </div>
        </div>
    )
}

export default HomePage