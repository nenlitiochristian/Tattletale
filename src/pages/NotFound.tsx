import { Link } from 'react-router-dom'

type Props = {}

const NotFound = ({ }: Props) => {
    return (
        <div className='flex items-center justify-center w-full h-full text-black dark:text-white'>
            <div className='flex flex-col gap-2 items-center justify-center p-12 bg-slate-500  dark:bg-slate-800 text-base rounded-lg'>
                <h1 className='text-3xl text-black dark:text-white mb-2'>404 Not found</h1>
                <p className='text-lg text-slate-400'>You seem to be lost, <Link className='text-indigo-400' to='/'>click me to go back home!</Link></p>
            </div>
        </div >
    )
}

export default NotFound