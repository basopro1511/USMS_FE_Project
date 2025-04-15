import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import ProtectedRoute from '../pages/Login/ProtectedRoute';
import RoleProtectedRoute from '../pages/Login/RoleProtectedRoute';
import NotAuthorized from '../pages/Login/UnAuthorize';
import TeacherActivityDetail from '../pages/user/Teacher/TeacherActivityDetail';
import TeacherRequestNotifications from '../pages/user/Teacher/TeacherViewRequest';
import ScheduleManagement from '../pages/manage/schedule/schedule2';


// Danh sách các đường dẫn công khai
const publicPaths = ["/", "/forgotPassword", "/sentOTP", "/resetPassword"];

const AppRoutes = () => {
  const routes = [
    // Admin Zone
    { path: "/manageStaff", component: ManageStaff, layout: LayoutAdmin, allowedRoles: [1] },

    // Login Zone (Public)
    { path: "/", component: Login, layout: LayoutDefault },
    { path: "/form", component: FormDetailRoom, layout: LayoutDefault },
    { path: "/forgotPassword", component: ForgotPassword, layout: LayoutDefault },
    { path: "/sentOTP", component: SentOTP, layout: LayoutDefault },
    { path: "/resetPassword", component: ResetPassword, layout: LayoutDefault },

    // User Zone (Teacher, Student) - Protected
    { path: "/home", component: UserHome, layout: LayoutUser, allowedRoles: [4, 5] },
    { path: "/studentSchedule", component: StudentSchedule, layout: LayoutUser, allowedRoles: [5 ] },
    { path: "/studentDetail", component: StudentDetail, layout: LayoutUser, allowedRoles: [5] },
    { path: "/studentActivityDetail/:classScheduleId", component: StudentActivityDetail, layout: LayoutUser, allowedRoles: [5] },
    { path: "/detailClass/:classSubjectId", component: StudentDetailClass, layout: LayoutUser, allowedRoles: [4,5] },
    { path: "/studentViewExam", component: StudentViewExam, layout: LayoutUser, allowedRoles: [5] },
    { path: "/teacherDetailClass", component: TeacherDetailClass, layout: LayoutUser, allowedRoles: [4] },
    { path: "/teacherViewExam", component: TeacherViewExam, layout: LayoutUser, allowedRoles: [4] },
    { path: "/teacherSendRequest", component: TeacherSendRequest, layout: LayoutUser, allowedRoles: [4]  },
    { path: "/teacherSchedule", component: TeacherSchedule, layout: LayoutUser, allowedRoles: [4] },
    { path: "/teacherDetail", component: TeacherDetailInformation, layout: LayoutUser, allowedRoles: [4, 5] },
    { path: "/teacherActivityDetail/:classScheduleId", component: TeacherActivityDetail, layout: LayoutUser, allowedRoles: [4] },
    { path: "/teacherViewRequest", component: TeacherRequestNotifications, layout: LayoutUser, allowedRoles: [4] },

    // Manage Zone - Protected
    { path: "/manageClass", component: ManageClass, layout: ManageLayout, allowedRoles: [2] },
    { path: "/studentInClass/:classSubjectId/:classId/:subjectId", component: StudentInClass, layout: ManageLayout, allowedRoles: [2] },
    // { path: "/manageSchedule", component: ManageSchedule, layout: ManageLayout, allowedRoles: [2] },
    { path: "/manageRoom", component: ManageRoom, layout: ManageLayout, allowedRoles: [2] },
    { path: "/manageSemester", component: ManageSemester, layout: ManageLayout, allowedRoles: [2] },
    { path: "/manageTeacher", component: ManageTeacher, layout: ManageLayout, allowedRoles: [2] },
    { path: "/manageSubject", component: ManageSubject, layout: ManageLayout, allowedRoles: [2] },
    { path: "/manageStudent", component: ManageStudent, layout: ManageLayout, allowedRoles: [2] },
    { path: "/manageSlot", component: ManageSlot, layout: ManageLayout, allowedRoles: [2] },
    { path: "/manageNotification", component: Notification, layout: ManageLayout, allowedRoles: [2] },
    { path: "/manageExamSchedule", component: ManageExamSchedule, layout: ManageLayout, allowedRoles: [2] },
    { path: "/studentInExamSchedule/:examScheduleId/:subjectId", component: StudentInExamSchedule, layout: ManageLayout, allowedRoles: [2] },
    { path: "/manageInformation", component: PersonalInformation, layout: ManageLayout, allowedRoles: [2] },
    { path: "/manageSchedule", component: ScheduleManagement, layout: ManageLayout, allowedRoles: [2] },

  ];

  return (
    <Router>
      <Routes>
        {routes.map(
          ({ path, component: Component, layout: Layout, allowedRoles }) => {
            // Kiểm tra xem route có nằm trong publicPaths không
            const isPublic = publicPaths.includes(path);
            // Khởi tạo element của route bao bọc bởi layout
            let element = (
              <Layout>
                <Component />
              </Layout>
            );
            if (path === "/" && localStorage.getItem("token")) {
              const roleId = localStorage.getItem("roleId");
              if (roleId === "5"  || roleId === "4") {
                element = <Navigate to="/home" replace />;
              } else if (roleId === "2") {
                element = <Navigate to="/manageClass" replace />;
              } else {
                element = null; // Không render gì cả, giữ nguyên trang hiện tại
              }
            }
            // Nếu route không là public, bọc bởi ProtectedRoute
            if (!isPublic) {
              element = <ProtectedRoute>{element}</ProtectedRoute>;
            }
            // Nếu route có yêu cầu kiểm tra role, bọc thêm bởi RoleProtectedRoute
            if (allowedRoles) {
              element = (
                <RoleProtectedRoute allowedRoles={allowedRoles}>
                  {element}
                </RoleProtectedRoute>
              );
            }

            return <Route key={path} path={path} element={element} />;
          }
        )}

        {/* Route cho trang Not Authorized */}
        <Route
          path="/not-authorized"
          element={
            <LayoutDefault>
              <NotAuthorized />
            </LayoutDefault>
          }
        />
      </Routes>
    </Router>
  );
};


export default AppRoutes;
