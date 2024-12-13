import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "../pages/CommonPages/Login";
import Home from "../pages/user/Schedule/Home"
import ManageLayout from '../layouts/LayoutManagement';
import LayoutDefault from '../layouts/LayoutDefault';
import ManageSchedule from '../pages/manage/schedule/schedule';
import ManageClass from '../pages/manage/class/class';

const AppRoutes = () => {
  const routes = [
    //Login Zone //
    { path: "/", component: Login, layout: LayoutDefault },

    //User Zone //
    { path: "/home", component: Home, layout: ManageLayout },

    //Manange Zone //
    { path: "/manageClass", component: ManageClass, layout: ManageLayout },

    { path: "/manageSchedule", component: ManageSchedule, layout: ManageLayout },

    



];
  return (
    <Router>
        <Routes>
            {routes.map(({ path, component: Component, layout: Layout }) => (
                <Route
                    key={path}
                    path={path}
                    element={
                        <Layout>
                            <Component />
                        </Layout>
                    }
                />
            ))}
        </Routes>
    </Router>
);
};

export default AppRoutes;