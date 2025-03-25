import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "../pages/Login/Login";
import ManageLayout from '../layouts/LayoutManagement';
import LayoutDefault from '../layouts/LayoutDefault';
import ManageSchedule from '../pages/manage/schedule/schedule';
import ManageClass from '../pages/manage/class/class';
import LayoutUser from '../layouts/LayoutUser';
import StudentSchedule from '../pages/user/Student/StudentSchedule';
import UserHome from '../pages/user/Home/UserHome';
import StudentDetail from '../pages/user/Student/StudentDetail';
import StudentInClass from '../pages/manage/class/studentInClass';
import StudentActivityDetail from '../pages/user/Student/StudentActivityDetail';
import ManageRoom from '../pages/manage/room/room';
import FormDetailRoom from '../components/management/Room/FormDetailRoom';
import ForgotPassword from '../pages/Login/ForgotPassword';
import SentOTP from '../pages/Login/SentOTP';
import ResetPassword from '../pages/Login/ResetPassword';
import ManageSemester from '../pages/manage/semester/semester';
import ManageTeacher from '../pages/manage/teacher/teacher';
import ManageSubject from '../pages/manage/subject/subject';
import ManageStudent from '../pages/manage/student/student';
import StudentDetailClass from '../pages/user/Student/StudentDetailClass';
import StudentViewExam from '../pages/user/Student/StudentViewExam';
import TeacherDetailClass from '../pages/user/Teacher/TeacherDetailClass';
import TeacherViewExam from '../pages/user/Teacher/TeacherViewExam';
import ManageSlot from '../pages/manage/slot/slot';
import Notification from '../pages/manage/notification/notification';
import TeacherSendRequest from '../pages/user/Teacher/TeacherSendRequest';
import ManageExamSchedule from '../pages/manage/examSchedule/examschedule';
import StudentInExamSchedule from '../pages/manage/examSchedule/studentInExamSchedule';
import PersonalInformation from '../pages/manage/Information';
import LayoutAdmin from '../layouts/LayoutAdmin';
import TeacherDetailInformation from '../pages/user/Teacher/TeacherDetailInformation';
import ManageStaff from '../pages/admin/Staff/staff';
import TeacherSchedule from '../pages/user/Teacher/teacherSchedule';


const AppRoutes = () => {
  const routes = [
    //Admin Zone //
    { path: "/manageStaff", component: ManageStaff, layout: LayoutAdmin },

    //Login Zone //
    { path: "/", component: Login, layout: LayoutDefault },
    { path: "/form", component: FormDetailRoom, layout: LayoutDefault },
    { path: "/forgotPassword", component: ForgotPassword, layout: LayoutDefault },
    { path: "/sentOTP", component: SentOTP, layout: LayoutDefault },
    { path: "/resetPassword", component: ResetPassword, layout: LayoutDefault },

    //User Zone (Teacher, Student )
    { path: "/home", component: UserHome, layout: LayoutUser },
    { path: "/studentSchedule", component: StudentSchedule, layout: LayoutUser },
    { path: "/studentDetail", component: StudentDetail, layout: LayoutUser },
    { path: "/studentActivityDetail", component: StudentActivityDetail, layout: LayoutUser},
    { path: "/studentDetailClass", component: StudentDetailClass, layout: LayoutUser},
    { path: "/studentViewExam", component: StudentViewExam, layout: LayoutUser},
    { path: "/teacherDetailClass", component: TeacherDetailClass, layout: LayoutUser},
    { path: "/teacherViewExam", component: TeacherViewExam, layout: LayoutUser},
    { path: "/teacherSendRequest", component: TeacherSendRequest, layout: LayoutUser},
    { path: "/teacherSchedule", component: TeacherSchedule, layout: LayoutUser},
    { path: "/teacherDetail", component: TeacherDetailInformation, layout: LayoutUser },

    //Manange Zone //
    { path: "/manageClass", component: ManageClass, layout: ManageLayout },
    { path: "/studentInClass/:classSubjectId/:classId", component: StudentInClass, layout: ManageLayout },
    { path: "/manageSchedule", component: ManageSchedule, layout: ManageLayout },
    { path: "/manageRoom", component: ManageRoom, layout: ManageLayout },
    { path: "/manageSemester", component: ManageSemester, layout: ManageLayout },
    { path: "/manageTeacher", component: ManageTeacher, layout: ManageLayout },
    { path: "/manageSubject", component: ManageSubject, layout: ManageLayout },
    { path: "/manageStudent", component: ManageStudent, layout: ManageLayout },
    { path: "/manageSlot", component: ManageSlot, layout: ManageLayout },
    { path: "/manageNotification", component: Notification, layout: ManageLayout},
    { path: "/manageExamSchedule", component: ManageExamSchedule, layout: ManageLayout},
    { path: "/studentInExamSchedule/:examScheduleId/:subjectId", component: StudentInExamSchedule, layout: ManageLayout },
    { path: "/manageInformation", component: PersonalInformation, layout: ManageLayout},

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