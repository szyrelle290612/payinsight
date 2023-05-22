import * as React from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import MainContent from "../../ui/MainContent";
import Dashboard from "../../ui/components/pages/Dashboard";
import ActivitySummary from "../../ui/components/pages/Activities/ActivitySummary";
import Attendance from "../../ui/components/pages/Activities/Attendance";
import Payroll from "../../ui/components/pages/Payroll";
import Login from "../../ui/Login";
import Signup from "../../ui/Signup";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import Settings from "../../ui/components/pages/Settings";
import RedirectUrl from "../../ui/RedirectUrl";
import EmailVerification from "../../ui/components/extra/EmailVerification";
import PayrollRelease from "../../ui/components/pages/PayrollRelease";
import ForgotPassword from "../../ui/components/accounts/ForgotPassword";
import ResetPassword from "../../ui/components/accounts/ResetPassword";




const Home = () => {
    return (
        <div className="routes">
            <ToastContainer />
            <Routes>
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/email-verification/:token" element={<EmailVerification />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/oauth" element={<RedirectUrl/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/signup" element={<Signup/>} />
                    <Route element={<MainContent allow={["admin","user"]} />}>
                        <Route path="/dashboard" element={<Dashboard/>} />
                        <Route path="/activities-summary" element={<ActivitySummary/>} />
                        <Route path="/attendance" element={<Attendance/>} />
                        <Route path="/payroll" element={<Payroll/>} />
                        <Route path="/setting" element={<Settings/>} />
                        <Route path="/payroll-release" element={<PayrollRelease/>} />
                    </Route>
            </Routes>
        </div>

    );
};

export default Home;
