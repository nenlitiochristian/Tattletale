import { addDoc, collection, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { IoArrowBack } from 'react-icons/io5';
import { PiCircle, PiCircleFill, PiCircleHalfFill } from 'react-icons/pi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { TodoCheckedState, TodoNode, TodoPage } from '../models/TodoPage';
import ContentEditable from 'react-contenteditable';
import sanitizeHtml from 'sanitize-html';
import { User } from 'firebase/auth';
import NotFound from './NotFound';
import { useAuth } from '../middlewares/RequireAuth';

interface CurrentFocusType {
    currentPos: string;
    setCurrentPos: (value: string) => void;
}

const CurrentFocusContext = createContext<CurrentFocusType | null>(null);

const useCurrentFocusContext = () => {
    const context = useContext(CurrentFocusContext);
    if (!context) {
        throw new Error('useCurrentFocusContext must be used within a BooleanProvider');
    }
    return context;
};

const CurrentFocusProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentPos, setCurrentPos] = useState<string>('root-0');

    return (
        <CurrentFocusContext.Provider value={{ currentPos, setCurrentPos }}>
            {children}
        </CurrentFocusContext.Provider>
    );
};

const EditTodoPage = () => {
    const [loading, setLoading] = useState(true);
    const [todo, setTodo] = useState<null | TodoPage>(null);
    const { pageId } = useParams();
    const { user } = useAuth();

    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Cleanup function to clear timeout on component unmount or when todo changes
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId, todo]);

    const handleChange = () => {
        if (timeoutId) {
            clearTimeout(timeoutId); // Clear the previous timeout
        }
        if (todo) {
            setTodo({ ...todo });
            const newTimeoutId = setTimeout(() => {
                const { id: _, ...pureTodo } = todo;
                setDoc(doc(db, 'pages', todo.id), pureTodo);
            }, 1000); // 1 sec delay
            setTimeoutId(newTimeoutId);
        }
    };

    useEffect(() => {
        (async () => {
            const id = pageId ? pageId : '';
            const docRef = doc(db, "pages", id);
            getDoc(docRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const todoPage = { id: id, ...docSnap.data() } as TodoPage;
                    setTodo(todoPage);
                }
            }).finally(() => { setLoading(false) });
        })();
    }, []);

    if (loading) {
        return <></>
    }

    if (!todo) {
        console.log('notfound');
        return <NotFound />
    }

    if (todo.content.length === 0) {
        todo.content.push({
            children: [],
            content: '',
            collapsed: false,
        })
    }

    return (
        <CurrentFocusProvider>
            <div className="container mx-auto py-6 px-16 lg:px-64 divide-y-2 font-sans">
                <Header {...{ todo, notifyChange: handleChange, user }} />
                <div className='text-lg py-4 text-slate-100'>
                    <TodoNodes notifyChange={handleChange} content={todo.content} position='root' />
                </div>
            </div>
        </CurrentFocusProvider>
    )
}

const Header = ({ todo, notifyChange, user }: { todo: TodoPage, notifyChange: () => void, user: User }) => {
    const navigate = useNavigate();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showCreateTemplate, setShowCreateTemplate] = useState(false);
    const [templateUrl, setTemplateUrl] = useState('');

    const sanitizeConf = {
        allowedTags: ["b", "i"],
    };

    let totalTodosCount = 0;
    let halfDoneCount = 0;
    let doneCount = 0;

    const todoCounter = (nodes: TodoNode[]) => {
        nodes.map((node) => {
            if ('checked' in node) {
                totalTodosCount++;
                if (node.checked === 0.5) {
                    halfDoneCount++;
                }
                else if (node.checked === 1) {
                    doneCount++;
                }
            }
            todoCounter(node.children);
        })
    }

    todoCounter(todo.content);

    return (
        <div className='w-full flex flex-wrap items-center mb-4'>
            {showDeleteConfirmation ?
                <div className='absolute left-0 right-0 top-0 bottom-0 bg-black/50 z-50 flex justify-center items-center text-center'>
                    <div className='bg-slate-800 p-8 flex flex-col rounded-xl'>
                        <p className='text-2xl'>Are you sure you want to delete this page?</p>
                        <p className='text-xl text-red-500'>This action is permanent</p>
                        <div className='flex justify-center gap-3 mt-2'>
                            <button className='bg-indigo-500 rounded-md text-xl p-2'
                                onClick={() => { setShowDeleteConfirmation(false) }}>
                                Cancel
                            </button>
                            <button className='bg-red-500 rounded-md text-xl p-2'
                                onClick={() => {
                                    deleteDoc(doc(db, 'pages', todo.id)).finally(() => { navigate('/') });
                                }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                : <></>
            }
            {showCreateTemplate ?
                <div className='absolute left-0 right-0 top-0 bottom-0 bg-black/50 z-50 flex justify-center items-center text-center'>
                    <div className='bg-slate-800 p-8 flex flex-col rounded-xl'>
                        <p className='text-2xl'>Here's the link to your template:</p>
                        <p className='text-xl text-indigo-500'>{templateUrl}</p>
                    </div>
                </div>
                : <></>
            }
            <Link to='/' className='flex items-stretch mr-4 aspect-square size-4 lg:size-8'><IoArrowBack className='h-full w-full' /></Link>
            <div className=''>
                <ContentEditable
                    className=' w-full outline-none bg-slate-900 text-3xl lg:text-5xl text-white font-bold mb-2'
                    onChange={(e) => {
                        todo.name = e.target.value;
                        notifyChange();
                    }}
                    html={sanitizeHtml(todo.name, sanitizeConf)} />
                <div className='w-full flex gap-3'>
                    <Link to={'/pages/' + todo.id} className='text-blue-500 text-lg underline'>
                        View
                    </Link>
                    <button onClick={() => {
                        const { id: _, ...pureTodo } = todo;
                        addDoc(collection(db, 'templates'), { ...pureTodo, ownerId: user.uid }).then((data) => {
                            setShowCreateTemplate(true);
                            setTemplateUrl(window.location.hostname + '/templates/' + data.id);
                        })
                    }} className='text-indigo-500 text-lg underline'>
                        Share Template
                    </button>
                    <button onClick={() => {
                        setShowDeleteConfirmation(true);
                    }} className='text-red-500 text-lg underline'>
                        Delete
                    </button>
                </div>
                <div className='w-full flex gap-2'>
                    <p>Total Todo-Items: {totalTodosCount}</p>
                    <p>Half-Done: {halfDoneCount}</p>
                    <p>Done: {doneCount}</p>
                    <p>Progress: {totalTodosCount <= 0 ? 'N/A' : (Math.round((halfDoneCount * 0.5 + doneCount) / totalTodosCount * 10000)) / 100 + '%'}</p>
                </div>
            </div>
        </div>
    )
}

const TodoNodes = ({ content, notifyChange, position }: { content: TodoNode[], notifyChange: () => void, position: string }) => {
    return (
        content.map((node, index) => <div className='w-full' key={index} >
            <Todo  {...{ node, index, notifyChange, key: index, parentNode: content, position }} />
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

const Todo = ({ node, notifyChange, parentNode, index, position }: { node: TodoNode, notifyChange: () => void, parentNode: TodoNode[], index: number, position: string }) => {
    const isTodo = ('checked' in node);
    const [showActions, setShowActions] = useState(false);
    const { currentPos, setCurrentPos } = useCurrentFocusContext();

    const sanitizeConf = {
        allowedTags: ["b", "i"],
    };

    const textColor = !isTodo ? '' : node.checked === 0 ? 'text-white' : node.checked === 0.5 ? 'text-slate-400' : 'text-slate-400 line-through'
    const remove = (index: number) => {
        parentNode.splice(index, 1);
        notifyChange();
    }
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current && currentPos === (position + '-' + index)) {
            inputRef.current.focus();
        }
    }, [inputRef.current, currentPos, inputRef])


    function reduceLevel(str: string) {
        const parts = str.split('-');
        const lastPart = parseInt(parts[parts.length - 1], 10);

        if (lastPart > 0) {
            parts[parts.length - 1] = (lastPart - 1).toString();
        } else {
            parts.pop();
        }

        return parts.join('-');
    }

    const gap = isTodo ? ' -left-20' : ' -left-14'

    return (
        <>
            <div className='flex relative'
                onMouseEnter={() => { setShowActions(true) }}
                onMouseLeave={() => { setShowActions(false) }}>
                <div className={(showActions ? '' : 'opacity-0') + ' flex gap-1 h-7 absolute px-1 ' + gap}>
                    <button onClick={() => {
                        node.children.splice(0, 0, {
                            children: [],
                            content: '',
                            collapsed: false,
                        })
                        setCurrentPos(position + '-' + (index) + '-0');
                        notifyChange();
                    }} className='flex items-center justify-center'><IoIosAddCircleOutline /></button>
                    <button onClick={() => { remove(index) }} className='flex items-center justify-center'><FaRegTrashCan></FaRegTrashCan></button>
                </div>
                {isTodo ?
                    <button className='mr-2 -ml-6' onClick={() => {
                        node.checked = AddCheckedState(node.checked);
                        notifyChange();
                    }}><TodoCheckButton value={node.checked} className='size-5' /></button>
                    : <></>}
                <ContentEditable
                    onChange={(e) => {
                        node.content = e.target.value;
                        notifyChange();
                    }}

                    onFocus={() => {
                        setCurrentPos(position + '-' + index);
                    }}

                    onBlur={() => {
                        setCurrentPos('none');
                    }}

                    onKeyDown={(e) => {
                        if (e.key.toLowerCase() === "enter") {
                            e.preventDefault();
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
                            setCurrentPos(position + '-' + (index + 1));
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
                                if (currentPos !== (position + '-' + index)) return;
                                e.preventDefault();
                                setCurrentPos(reduceLevel(position + '-' + index))
                                parentNode.splice(index, 1);
                                notifyChange();
                            }
                        }
                    }}
                    innerRef={inputRef}
                    className={textColor + ' w-full outline-none bg-slate-900'}
                    html={sanitizeHtml(node.content, sanitizeConf)} />
            </div>
            <div className='pl-6'>
                <TodoNodes {...{ content: node.children, notifyChange, position: position + '-' + index }} />
            </div>
        </>
    )
}
export default EditTodoPage