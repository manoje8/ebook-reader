import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"

const ResetPassword = () => {
    const navigate = useNavigate()
    const [values, setValues] = useState({
        otp: "",
        email: "",
        newPassword: "",
        confirmPassword: ""
    })

    const handleChange = ({target: {name, value}}) => {
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(values.newPassword !== values.confirmPassword)
        {
            toast.error("Password not matched")
            return;
        }
        try 
        {
            const response = await axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}/auth/reset-password`,
                data: {
                    otp: values.otp,
                    email: values.email,
                    newPassword: values.newPassword
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
            <h1 className="title">Account</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input name="otp" className="form-control" onChange={handleChange} placeholder="OTP" required/>
                </div>
                <div className="form-group">
                    <input name="email" type="email" className="form-control" onChange={handleChange} placeholder="Email" required/>
                </div>
                <div className="form-group">
                    <input name="newPassword" type="password" className="form-control" onChange={handleChange} placeholder="New Password" required/>
                </div>
                <div className="form-group">
                    <input name="confirmPassword" type="password" className="form-control" onChange={handleChange} placeholder="OConfirm PasswordTP" required/>
                </div>
                <button type="submit" className="btn btn-primary btn-block" >Rest Password</button>
            </form>
        </section>
    </div>
    )
}

export default ResetPassword