import { User } from 'firebase/auth';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { PiCircle, PiCircleFill, PiCircleHalfFill } from 'react-icons/pi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { useAuth } from '../middlewares/RequireAuth';
import { TodoCheckedState, TodoNode, TodoPage } from '../models/TodoPage';
import NotFound from './NotFound';

const ViewTemplatePage = () => {
    const [loading, setLoading] = useState(true);
    const [todo, setTodo] = useState<null | TodoPage>(null);
    const { user } = useAuth();
    const { templateId } = useParams();

    useEffect(() => {
        (async () => {
            const id = templateId ? templateId : '';
            const docRef = doc(db, "templates", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const todoPage = { id: id, ...docSnap.data() } as TodoPage;
                setTodo(todoPage);
            }
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return <></>
    }

    if (!todo) {
        return <NotFound />
    }

    return (
        <div className="container mx-auto py-6 px-16 lg:px-64 divide-y-2 font-sans">
            <Header {...{ todo, user }} />
            <div className='text-lg py-4 text-slate-100'>
                <TodoNodes content={todo.content} />
            </div>
        </div>
    )
}

const Header = ({ todo, user }: { todo: TodoPage, user: User }) => {
    const navigate = useNavigate();
    let totalTodosCount = 0;

    const todoCounter = (nodes: TodoNode[]) => {
        nodes.map((node) => {
            if ('checked' in node) {
                totalTodosCount++;
                node.checked = 0;
            }
            todoCounter(node.children);
        })
    }

    todoCounter(todo.content);

    return (
        <div className='w-full flex flex-wrap items-center mb-4'>
            <Link to='/' className='flex items-stretch mr-4 aspect-square size-4 lg:size-8'><IoArrowBack className='h-full w-full' /></Link>
            <div className=''>
                <div className=' w-full outline-none bg-slate-900 text-3xl lg:text-5xl text-white font-bold mb-2'>
                    {todo.name}
                </div>
                <div className='w-full flex gap-3'>
                    <button onClick={() => {
                        const { id: _, ...pureTodo } = todo;
                        console.log(pureTodo);
                        addDoc(collection(db, 'pages'), { ...pureTodo, ownerId: user.uid }).then((data) => {
                            navigate('/pages/' + data.id);
                        })
                    }} className='text-indigo-500 text-lg underline'>
                        Clone this page
                    </button>
                </div>
                <div className='w-full flex gap-2'>
                    <p>Total Todo-Items: {totalTodosCount}</p>
                </div>
            </div>
        </div >
    )
}

const TodoNodes = ({ content }: { content: TodoNode[] }) => {
    return (
        content.map((node, index) => <div className='w-full' key={index} >
            <Todo  {...{ node, index, key: index, parentNode: content }} />
        </div>)
    )
}

const TodoCheckButton = ({ value, className }: { value: TodoCheckedState, className?: string }) => {
    const style = className ? className : '';

    if (value === 0) {
        return <PiCircle className={style + 'text-blue-300'} />
    }
    else if (value === 0.5) {
        return <PiCircleHalfFill className={style + ' rotate-180 text-blue-300'} />
    }
    else {
        return <PiCircleFill className={style + ' text-blue-300'} />
    }
}

const Todo = ({ node }: { node: TodoNode }) => {
    const isTodo = ('checked' in node);
    const textColor = 'text-white';

    return (
        <>
            <div className='flex relative'>
                {isTodo ?
                    <button className='mr-2 -ml-6'><TodoCheckButton value={0} className='size-5' /></button>
                    : <></>}
                <div className={textColor + ' w-full outline-none bg-slate-900 min-h-6'}>
                    {node.content}
                </div>
            </div>
            <div className='pl-6'>
                <TodoNodes {...{ content: node.children }} />
            </div>
        </>
    )
}
export default ViewTemplatePage