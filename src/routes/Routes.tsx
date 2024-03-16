import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RequireAuth from '../middlewares/RequireAuth';
import NotFound from '../pages/NotFound';
import TodoPage from '../pages/TodoPage';
import TumbalTodo from '../pages/TumbalTodo';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <RequireAuth><HomePage></HomePage></RequireAuth> },
            { path: "login", element: <LoginPage /> },
            { path: "pages/:pageId", element: <RequireAuth><TodoPage /></RequireAuth> },
            { path: "*", element: <TumbalTodo /> }
        ]
    }
]);