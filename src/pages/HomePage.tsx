import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"

const HomePage = () => {
    const navigate = useNavigate();

    const logout = () => {
        signOut(auth).then(() => { navigate('/login') }).catch();
    }

    return (
        <div>
            <p className=""></p>
            <button onClick={logout}>logout</button>
        </div>
    )
}

export default HomePage