import { signOut } from "firebase/auth"
import { auth, db } from "../firebase"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { TodoPage } from "../models/TodoPage";

const HomePage = () => {
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState('');
    const [pages, setPages] = useState<TodoPage[]>([]);
    const navigate = useNavigate();
    const user = auth.currentUser;

    const logout = () => {
        signOut(auth).then(() => { navigate('/login') }).catch();
    }

    useEffect(() => {
        (async () => {
            const q = query(collection(db, 'pages'), where('ownerId', '==', user?.uid))
            getDocs(q)
                .then((result) => {
                    const myList: TodoPage[] = [];
                    result.forEach((doc) => {
                        const data = doc.data();
                        myList.push({ ...data, id: doc.id } as TodoPage)
                    })
                    setPages(myList)
                })
                .catch();
        })();
    }, []);

    const handleCreateNewPage = async () => {
        if (!newPageTitle || !user) return;
        const newPage = {
            name: newPageTitle,
            ownerId: user.uid,
            content: []
        }
        addDoc(collection(db, 'pages'), newPage).then(() => { window.location.reload() })
    }

    if (!user) {
        return <></>
    }

    const initial = user.email ? user.email.substring(0, user.email.indexOf('@')).toUpperCase() : 'ERROR';

    return (
        <div className="container mx-auto py-6 px-10 lg:px-32 divide-y-2 font-sans">
            <nav className="flex w-full flex-wrap font-bold">
                <div className="">
                    <h1 className="text-white text-3xl lg:text-5xl mb-2">TattleTaLe</h1>
                    <h2 className="text-sky-500 text-2xl lg:text-3xl font-semibold">TPA To-do List</h2>
                </div>
                <div className="ml-auto my-auto flex flex-col text-white text-xl lg:text-2xl font-semibold">
                    <p className="ml-auto">Welcome, {initial}</p>
                    <button onClick={logout} className="ml-auto bg-sky-500 py-1 px-3 my-2 rounded-md">Logout</button>
                </div>
            </nav>
            <div className="w-full my-3 py-3 flex flex-col gap-4">
                {showCreatePopup ?
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
                        <form className='flex flex-col gap-2 items-center justify-center p-12 bg-slate-500  dark:bg-slate-800 text-base rounded-lg' onSubmit={(e) => { e.preventDefault(); handleCreateNewPage() }}>
                            <h1 className='text-xl lg:text-3xl text-black dark:text-white mb-2'>Create a new to-do page</h1>
                            <input type="text" placeholder='To-do page title' className='rounded-md p-1 w-full focus:ring-2 focus:ring-slate-700 dark:focus:ring-slate-500 focus:outline-none text-black bg-slate-200' onChange={(e) => { setNewPageTitle(e.target.value) }} value={newPageTitle}></input>
                            <div className="w-full mt-2 flex">
                                <button type='submit' className='bg-indigo-500 py-0.5 mx-1 lg:mx-4 rounded-lg text-lg flex-grow'>Confirm</button>
                                <button className='bg-red-500 py-0.5 mx-1 lg:mx-4 rounded-lg text-lg flex-grow' onClick={() => { setShowCreatePopup(false); setNewPageTitle('') }}>Cancel</button>
                            </div>
                        </form>
                    </div> : <></>
                }
                <h1 className="text-xl lg:text-2xl text-white">My To-do Lists:</h1>
                <ul className="space-y-6 lg:space-y-2 border-l border-slate-100 dark:border-slate-800 flex flex-col">
                    {pages.map((page, key) => <li className="block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300" key={key} ><Link to={'/pages/' + page.id} className="text-lg"> {page.name}</Link></li>)}
                </ul>
                <button className="w-max p-3 bg-sky-500 rounded-md font-bold text-white highlight-white/20" onClick={() => { setShowCreatePopup(true) }}>Add a new to-do page</button>
            </div >
        </div >
    )
}

export default HomePage