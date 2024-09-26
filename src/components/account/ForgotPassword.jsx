import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    // For spinner
    const [loading, setLoading] = useState(false)

    const handleChange = ({target: {value}}) => {
        setEmail(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try 
        {
            const response = await axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
                data: {
                  email: email
                }
            })

            const {message} = response.data;

            if(message)
            {
                toast.success(message, {
                    position: "top-center",
                    autoClose: 3000,
                })
            }
            setLoading(false)
            navigate("/auth/login")
        } catch (error) 
        {
            const {data, status}  = error.response
            if(status === 400)
            {
                toast.error(data.message, {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: true
                })
            }
        }
    }

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center">
        <section className="col-md-5 p-4 border rounded">
            <form onSubmit={handleSubmit}>
                <h3 className="title mb-3">Reset Password</h3>
                <span className="sub-title mb-">Enter your email and we will send details on how to reset your password.</span>
                <div className="form-group">
                    <input type="email" className="form-control mt-3" placeholder="Registered email address" onChange={handleChange} required/>
                </div>
                
                {!loading ? 
                <button type="submit" id="reset-button mt-3" className="btn btn-info btn-block">Send password reset link</button> 
                :
                <Spinner buttonName={"Send password reset link"}/>
                }
                
                <a className="btn btn-link mt-3" href="/auth/login">Back to Login</a>
            </form>
        </section>
    </div>
)}

export default ForgotPassword