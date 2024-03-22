import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RequireAuth from '../middlewares/RequireAuth';
import NotFound from '../pages/NotFound';
import TodoPage from '../pages/TodoPage';
import EditTodoPage from '../pages/EditTodoPage';
import ViewTemplatePage from '../pages/ViewTemplatePage';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <RequireAuth><HomePage></HomePage></RequireAuth> },
            { path: "login", element: <LoginPage /> },
            { path: "pages/:pageId/edit", element: <RequireAuth><EditTodoPage /></RequireAuth> },
            { path: "pages/:pageId", element: <RequireAuth><TodoPage /></RequireAuth> },
            { path: "templates/:templateId", element: <RequireAuth><ViewTemplatePage /></RequireAuth> },
            { path: "*", element: <NotFound /> }
        ]
    }
]);