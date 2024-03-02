import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { DarkModeContext } from './contexts/DarkModeContext';


function App() {
  const [isDarkMode, setDarkMode] = useState(localStorage.isDarkMode === 'true' ? true : false);

  useEffect(() => {
    localStorage.isDarkMode = isDarkMode ? 'true' : 'false';
  }, [isDarkMode])

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setDarkMode }}>
      <div className={(isDarkMode ? 'dark ' : 'dark ') + 'app w-full h-full bg-white dark:bg-slate-900 text-slate-300'}>
        <Outlet />
      </div>
    </DarkModeContext.Provider>
  )
}

export default App
