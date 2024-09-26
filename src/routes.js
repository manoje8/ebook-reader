import { Route, Routes } from "react-router-dom";
import ForgotPassword from "./components/account/ForgotPassword";
import Home from "./components/ebook/Home";
import App from "./App";
import Error404 from "./components/Error404";
import EpubViewer from "./components/ebook/EpubViewer";
import CreateAccount from "./components/account/CreateAccount";
import SignInRegister from "./components/account/SignInRegister";
import ResetPassword from "./components/account/ResetPassword";


const AppRoutes = () => (
    <App>
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/viewer" element={<EpubViewer />}/>
            <Route path="/auth/login" element= {<SignInRegister />} />
            <Route path="/auth/create" element= {<CreateAccount />}/>
            <Route path="/auth/forgot-password" element= {<ForgotPassword />}/>
            <Route path="/auth/reset-password" element= {<ResetPassword />}/>
            <Route path="*" element={<Error404 />}/>
        </Routes>
    </App>
)

export default AppRoutes