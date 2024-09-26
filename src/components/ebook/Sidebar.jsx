import axios from "axios";
import { useRef } from "react";
import { useBook } from "../../context/bookContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sidebar = (params) => {
    const { themeToggle, sortByRecent, recent , sortFav, sortByFavorite, sortByAll} = useBook()
    const {size, reload} = params
    const navigate = useNavigate()
    const fileInputRef = useRef(null);

    const handleIconClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            toast.error('Please select a file', {
                position: "bottom-center",
                autoClose: 3000,
            })
            return;
        }

        const formData = new FormData();
        formData.append('ebook', file)

        try 
        {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/ebook/upload`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            });
            const {message} = res.data
            toast.success(message, {
                position: "bottom-center",
                autoClose: 3000,
            })
            reload()
        } 
        catch (error) 
        {
            toast.error('File upload failed', {
                position: "bottom-center",
                autoClose: 3000,
            })
            
        }
    };

    const handleLogout = () => {
        localStorage.clear()
        toast.success('Logged Out', {
            position: "bottom-center",
            autoClose: 3000,
        })
        navigate("/auth/login")
    }


    return (
        <div className="col-3 left-panel d-flex flex-column" id='panel'>
            <div className='library-header'>
                <p className='lead'>Virtual Library</p>
                <h4>
                    <i className="bi bi-plus-circle fileIcon" onClick={handleIconClick}></i>
                    <input type="file" style={{display: 'none'}} onChange={handleFileChange} ref={fileInputRef} accept=".epub, .pdf"/>
                </h4>
                <h4 className='theme' onClick={themeToggle}><i className="bi bi-brilliance"></i></h4>
            </div>
            <hr />
            <ul className="list-group">
                <li className="form-control form-control-sm list-panel" onClick={sortByAll}>
                    All Books
                    <span className="badge badge-info badge-pill">{size}</span>
                </li>
                <li className={`form-control form-control-sm list-panel ${recent ? 'bg-secondary text-light' : ''}`} onClick={sortByRecent}>
                    Recent
                </li>
                <li className={`form-control form-control-sm list-panel ${sortFav ? 'bg-secondary text-light' : ''}`} onClick={sortByFavorite}>
                    Favorite
                </li>
            </ul>
            <div className="d-flex justify-content-around border mt-auto">
                <h4><a href="/auth/login"><i className="bi bi-person-fill"></i></a></h4>
                <h4><i className="bi bi-box-arrow-up" onClick={handleLogout}></i></h4>
            </div>
        </div>
    )
}

export default Sidebar