import React, { useEffect, useState } from 'react'
import { TodoNode, TodoPage } from '../models/TodoPage';
import { Link, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { IoArrowBack } from 'react-icons/io5';

type Props = {}

const TodoPage = (props: Props) => {
    const [loading, setLoading] = useState(true);
    const [todo, setTodo] = useState<null | TodoPage>(null);
    const { pageId } = useParams();
    const user = auth.currentUser;

    useEffect(() => {
        (async () => {
            const id = pageId ? pageId : '';
            const docRef = doc(db, "pages", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setTodo({ id: id, ...docSnap.data() } as TodoPage);
            }
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return <></>
    }

    if (!todo) {
        return <></>
    }

    todo.content.push({
        content: 'aaaa',
        collapsed: false,
        children: [{
            content: 'aaaa',
            collapsed: false,
            children: []
        }]
    })

    return (
        <div className="container mx-auto py-6 px-10 lg:px-32 divide-y-2 font-sans">
            <div className='w-full flex items-stretch mb-4'>
                <Link to={'/'} className='flex items-stretch mr-4 aspect-square'><IoArrowBack className='grow' /></Link>
                <h1 className='text-3xl lg:text-5xl text-white font-bold'>{todo.name}</h1>
            </div>
            <div className='text-lg'>
                <TodoTree content={todo.content} />
            </div>
        </div>
    )
}

const TodoTree = ({ content }: { content: TodoNode[] }) => {
    return (
        <>
            {content.map((node, key) => <div key={key}>
                <p>{node.content}</p>
                <div className='pl-4'>
                    <TodoTree content={node.children} />
                </div>
            </div>)}
        </>
    )
}

export default TodoPage