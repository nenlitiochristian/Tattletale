import React, { useEffect, useState } from 'react'
import { TodoCheckedState, TodoNode, TodoPage } from '../models/TodoPage'
import { MdOutlineCheckBoxOutlineBlank, MdOutlineIndeterminateCheckBox } from 'react-icons/md'
import { RiCheckboxLine } from 'react-icons/ri'

type Props = {}

const TumbalTodo = (props: Props) => {
    const [todoPage, setTodoPage] = useState<TodoPage>({
        name: 'Tumbal',
        content: [],
        id: '2',
        ownerId: '2'
    })

    const handleChange = () => {
        console.log(todoPage);
        setTodoPage({ ...todoPage });
    }

    return (
        <div className='p-5'>
            <p>{todoPage.name}</p>
            <hr className='my-3'></hr>
            <TodoNodes notifyChange={handleChange} content={todoPage.content} />
        </div>
    )
}



const TodoNodes = ({ content, notifyChange }: { content: TodoNode[], notifyChange: () => void }) => {
    const [showAddButton, setShowAddButton] = useState(false);

    return (
        <div className='flex flex-col min-h-1'
            onMouseEnter={() => setShowAddButton(true)}
            onMouseLeave={() => setShowAddButton(false)}>
            {content.map((node, index) => <div className='flex gap-2' key={index}>
                <div className='flex gap-1 h-4'>
                    <button onClick={() => {
                        content.splice(index, 1);
                        notifyChange();
                    }}>-</button>
                    <button onClick={() => {
                        content.splice(index + 1, 0, {
                            children: [],
                            content: '',
                            collapsed: false,
                        })
                        notifyChange();
                    }}>+</button>
                </div>
                <div className='w-full'>
                    <Todo  {...{ node, index, notifyChange, key: index }} />
                </div>
            </div>)}
            {content.length === 0 ?
                <button className={showAddButton ? 'bg-slate-800' : 'hidden'} onClick={() => {
                    content.push({
                        children: [],
                        content: '',
                        collapsed: false,
                    })
                    notifyChange();
                }}>Add Child</button> : <></>
            }
        </div>
    )
}

const Todo = ({ node, notifyChange }: { node: TodoNode, notifyChange: () => void }) => {
    return (
        <>
            <input type='text' className='w-full outline-none py-2 bg-slate-900' onChange={(e) => {
                node.content = e.target.value;
                notifyChange();
            }} value={node.content}></input>
            <div className='px-4'>
                <TodoNodes {...{ content: node.children, notifyChange }} />
            </div>
        </>
    )
}

export default TumbalTodo