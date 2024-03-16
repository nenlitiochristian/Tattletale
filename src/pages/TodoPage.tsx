import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoArrowBack } from 'react-icons/io5';
import { PiCircleBold, PiCircleFill, PiCircleHalfFill } from 'react-icons/pi';
import { Link, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import { TodoCheckedState, TodoNode, TodoPage } from '../models/TodoPage';

type Props = {}

interface EditModeContextType {
    booleanState: boolean;
    setBooleanState: (value: boolean) => void;
}

const EditModeContext = createContext<EditModeContextType | null>(null);

const useEditModeContext = () => {
    const context = useContext(EditModeContext);
    if (!context) {
        throw new Error('useEditModeContext must be used within a BooleanProvider');
    }
    return context;
};

// Create the provider component
const EditModeProvider = ({ children }: { children: React.ReactNode }) => {
    const [booleanState, setBooleanState] = useState<boolean>(false);

    return (
        <EditModeContext.Provider value={{ booleanState, setBooleanState }}>
            {children}
        </EditModeContext.Provider>
    );
};

const TodoPage = (props: Props) => {
    const [loading, setLoading] = useState(true);
    const [todo, setTodo] = useState<null | TodoPage>(null);
    const { pageId } = useParams();

    useEffect(() => {
        (async () => {
            const id = pageId ? pageId : '';
            const docRef = doc(db, "pages", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const todoPage = { id: id, ...docSnap.data() } as TodoPage;
                setTodo(todoPage);
            }
            setLoading(false);
        })();
    }, []);

    const handleChange = () => {
        if (todo) {
            // setDoc(doc(db, 'pages', todo.id), todo);
            setTodo({ ...todo });
        }
    }

    if (loading) {
        return <></>
    }

    if (!todo) {
        return <></>
    }

    if (todo.content.length === 0) {
        todo.content.push({
            children: [],
            content: '',
            collapsed: false,
        })
    }

    return (
        <EditModeProvider>
            <div className="container mx-auto py-6 px-16 lg:px-64 divide-y-2 font-sans">
                <div className='w-full flex items-center mb-4'>
                    <Link to={'/'} className='flex items-stretch mr-4 aspect-square size-4 lg:size-8'><IoArrowBack className='h-full w-full' /></Link>
                    <h1 className='text-3xl lg:text-5xl text-white font-bold'>{todo.name}</h1>
                </div>
                <div className='text-lg py-4 text-white'>
                    <TodoNodes notifyChange={handleChange} content={todo.content} />
                </div>
            </div>
        </EditModeProvider>
    )
}

const TodoNodes = ({ content, notifyChange }: { content: TodoNode[], notifyChange: () => void }) => {
    const [showAddButton, setShowAddButton] = useState(false);
    const showEdit = useEditModeContext();

    return (
        <div className='flex flex-col relative min-h-0.5'
            onMouseEnter={() => setShowAddButton(true)}
            onMouseLeave={() => setShowAddButton(false)}>
            {content.map((node, index) => <div className='flex' key={index}>
                <div className='w-full'>
                    <Todo  {...{ node, index, notifyChange, key: index, parentNode: content }} />
                </div>
            </div>)}
            {content.length === 0 ?
                <div className={showAddButton ? 'w-full flex justify-center gap-8 text-base' : 'hidden'}>
                    <button className='bg-slate-800 p-2 rounded-md' onClick={() => {
                        content.push({
                            children: [],
                            content: '',
                            collapsed: false,
                        })
                        notifyChange();
                    }}>Add Text Child</button>
                    <button className='bg-slate-800 p-2 rounded-md' onClick={() => {
                        content.push({
                            children: [],
                            content: '',
                            checked: 0,
                            collapsed: false,
                        })
                        notifyChange();
                    }}>Add Todo Child</button>
                </div>
                : <></>
            }
        </div>
    )
}

const TodoCheckButton = ({ value, className }: { value: TodoCheckedState, className?: string }) => {
    const style = className ? className : '';

    if (value === 0) {
        return <PiCircleBold className={style + ''} />
    }
    else if (value === 0.5) {
        return <PiCircleHalfFill className={style + ' rotate-180 text-blue-300'} />
    }
    else {
        return <PiCircleFill className={style + ' text-blue-300'} />
    }
}

const AddCheckedState = (value: TodoCheckedState) => {
    if (value === 0) {
        return 0.5;
    }
    else if (value === 0.5) {
        return 1;
    }
    else {
        return 0;
    }
}

const Todo = ({ node, notifyChange, parentNode, index }: { node: TodoNode, notifyChange: () => void, parentNode: TodoNode[], index: number }) => {
    const isTodo = ('checked' in node);
    const textColor = !isTodo ? '' : node.checked === 0 ? 'text-white' : node.checked === 0.5 ? 'text-slate-400' : 'text-slate-400 line-through'
    const remove = (index: number) => {
        parentNode.splice(index, 1);
        notifyChange();
    }
    const inputRef = useRef<HTMLInputElement>(null);

    const removeFocus = () => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    return (
        <>
            <div className='flex relative'>
                <div className='flex gap-1 h-7 absolute -left-7'>
                    <button onClick={() => { remove(index) }} className='flex items-center justify-center'><FaRegTrashCan></FaRegTrashCan></button>
                </div>
                {isTodo ?
                    <button className='mr-2' onClick={() => {
                        node.checked = AddCheckedState(node.checked);
                        notifyChange();
                    }}><TodoCheckButton value={node.checked} className='size-5' /></button>
                    : <></>}
                <input type='text' ref={inputRef} className={textColor + ' w-full outline-none py-1 bg-slate-900'} onChange={(e) => {
                    node.content = e.target.value;
                    notifyChange();
                }} onKeyDown={(e) => {
                    if (e.key.toLowerCase() === "enter") {
                        let newNode = isTodo ? {
                            children: [],
                            content: '',
                            collapsed: false,
                            checked: 0
                        } : {
                            children: [],
                            content: '',
                            collapsed: false
                        }
                        parentNode.splice(index + 1, 0, newNode);
                        notifyChange();
                    }
                    else if (e.key.toLowerCase() === "tab") {
                        e.preventDefault();
                        let newNode: TodoNode = isTodo ? {
                            children: node.children,
                            content: node.content,
                            collapsed: node.collapsed
                        } : { ...node, checked: 0 };
                        parentNode[index] = newNode;
                        notifyChange();
                    }
                    else if (e.key.toLowerCase() === 'backspace') {
                        if (node.content === '') {
                            removeFocus();
                            parentNode.splice(index, 1);
                            notifyChange();
                        }
                    }
                }} value={node.content}></input>
            </div>
            <div className='pl-6'>
                <TodoNodes {...{ content: node.children, notifyChange }} />
            </div>
        </>
    )
}
export default TodoPage