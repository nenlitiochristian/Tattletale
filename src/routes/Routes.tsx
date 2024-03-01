import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RequireAuth from '../middlewares/RequireAuth';

export const router = createBrowserRouter([
    {
        path: "",
        element: <App />,
        children: [
            { path: "", element: <RequireAuth><HomePage></HomePage></RequireAuth> },
            { path: "/login", element: <LoginPage /> }
        ]
    }
]);