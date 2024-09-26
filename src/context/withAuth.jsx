import { Navigate } from "react-router-dom";
import { useBook } from "./bookContext";

// Restricted access ensures only authorized users
const withAuth = (WrapperComponent) => (props) => {
    const {token, loading} = useBook()

    if(loading)
    {
        return null;
    }

    if (!token) 
    {
        return <Navigate to="/auth/login" replace />; 
    }

    return <WrapperComponent {...props}/>
}

export default withAuth