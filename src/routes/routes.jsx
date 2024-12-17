import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "../pages/Login/Login";
import ManageLayout from '../layouts/LayoutManagement';
import LayoutDefault from '../layouts/LayoutDefault';
import ManageSchedule from '../pages/manage/schedule/schedule';
import ManageClass from '../pages/manage/class/class';
import LayoutUser from '../layouts/LayoutUser';
import StudentSchedule from '../pages/user/Schedule/StudentSchedule';
import UserHome from '../pages/user/Home/UserHome';
import StudentDetail from '../pages/user/Schedule/StudentDetail';
import StudentInClass from '../pages/manage/class/studentInClass';
import StudentActivityDetail from '../pages/user/Schedule/StudentActivityDetail';

const AppRoutes = () => {
  const routes = [
    //Login Zone //
    { path: "/", component: Login, layout: LayoutDefault },

    //User Zone (Teacher, Student )
    { path: "/home", component: UserHome, layout: LayoutUser },
    { path: "/studentSchedule", component: StudentSchedule, layout: LayoutUser },
    { path: "/studentDetail", component: StudentDetail, layout: LayoutUser },
    { path: "/studentActivityDetail", component: StudentActivityDetail, layout: LayoutUser},

    

    //Manange Zone //
    { path: "/manageClass", component: ManageClass, layout: ManageLayout },
    { path: "/studentInClass", component: StudentInClass, layout: ManageLayout },
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