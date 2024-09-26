import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Spinner from "../Spinner"
import { toast } from "react-toastify"


const CreateAccount = () => {
    const navigate = useNavigate()
    // For spinner
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({
        name:"",
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
        setLoading(true)
        try 
        {
            const response = await axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}/auth/register`,
                data: {
                  name: values.name,
                  email: values.email,
                  password: values.password
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
            if(status === 400 || status === 204)
            {
                toast.error(data.message, {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: true
                })
            }
        }
        finally
        {
            setLoading(false)
        }
    }

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center ">
            <section className="col-md-5 p-4 border rounded">
                <h1 className="title mb-3">Create your account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input name="name" className="form-control" onChange={handleChange} placeholder="Name" required/>
                    </div>
                    <div className="form-group">
                        <input name="email" type="email" className="form-control" onChange={handleChange} placeholder="Email" required/>
                    </div>
                    <div className="form-group">
                        <input name="password" type="password" className="form-control" onChange={handleChange} placeholder="Password" required/>
                    </div>
                    {!loading ? 
                    <button type="submit" className="btn btn-primary btn-block mt-3" >Create an account</button> 
                    :
                    <Spinner buttonName={"Create an account"}/>
                    }
                    <a className="btn btn-link mt-3" href="/auth/login">Back to Login</a>
                </form>
            </section>
        </div>
)}

export default CreateAccount