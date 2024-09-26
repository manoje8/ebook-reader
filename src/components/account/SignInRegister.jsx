import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useBook } from "../../context/bookContext";
import { toast } from "react-toastify";

const SignInRegister = () => {
    const navigate = useNavigate()
    const {setToken, setUserName} = useBook()
    const [values, setValues] = useState({
        email: "",
        password: ""
    })

    const handleChange = ({target: {name, value}}) => {
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try 
        {
            const response = await axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}/auth/login`,
                data: {
                  email: values.email,
                  password: values.password
                }
            })

            const {message, accessToken, name:userName} = response.data;
            // save the response date into local storage
            setUserName(userName)
            localStorage.setItem("name", userName)
            setToken(accessToken);
            localStorage.setItem("token", accessToken)

            if(message)
            {
                toast.success(message, {
                    position: "top-center",
                    autoClose: 3000,
                })
            }
            navigate("/")
        } catch (error) 
        {
            console.error("Authentication failed:", error);
            setToken(null);
            localStorage.removeItem("token");
            
            const {data, status}  = error.response
            if(status === 400)
            {
                toast.error(data.message, {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false
                })
            }
        }
    }
    

    return (
        <div className="container d-flex justify-content-between align-items-center py-5">
        <section className="col-md-5 p-4 rounded">
            <h1 className="title mb-3">Sign In</h1>
            <span className="sub-title d-block mb-4">Sign in to access your account</span>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input name="email" type="email" className="form-control" onChange={handleChange} placeholder="Email address" required/>
                </div>
                <div className="form-group">
                    <input name="password" type="password" className="form-control" onChange={handleChange} placeholder="Password" required/>
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-3">Sign in</button>
                <p className="forgot-password mt-3">
                    <a href="/auth/forgot-password">Forgotten your password?</a>
                </p>
            </form>
        </section>
        <section id="register" className="col-md-5 p-4">
            <h1 className="title mb-3">New User?</h1>
            <span className="sub-title d-block mb-4">Creating an account is easy. By registering, you will be able to:</span>
            <ul className="list-unstyled">
                <li className="mb-2">Check out faster with your saved details</li>
                <li className="mb-2">Discover our new collections, receive news from the maison.</li>
                <li className="mb-2">Manage your profile and preferences</li>
            </ul>

            <a href="/auth/create" className="btn btn-outline-dark btn-block">Create an account</a>
        </section>
    </div>
)}

export default SignInRegister