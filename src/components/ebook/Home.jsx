import { useCallback, useEffect, useState } from 'react'
import ePub from 'epubjs';
import axios from 'axios';
import { useBook } from '../../context/bookContext';
import Sidebar from './Sidebar';
import withAuth from '../../context/withAuth';
import { toast } from 'react-toastify';
import PageLoading from '../PageLoading';
import './Home.css'


const Home = () => {
    const { darkMode, recent, sortFav} = useBook()
    const [ebooks, setEbooks] = useState([]);
    const [filteredBook, setFilteredBook] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchEbooks = useCallback(async() => {
        try {
            setLoading(true)
            const response = await axios(`${process.env.REACT_APP_API_URL}/ebook`)
            const ebookMap = new Map();

            await Promise.all(
                response.data.map(async (data) => {
                    let replaceSlashOfPath = data.path.replace(/\\/g, "/");
                    const eBookPath = `${process.env.REACT_APP_API_URL}/${replaceSlashOfPath}`
                    await axios.head(eBookPath);
                    const eBookMeta = ePub(eBookPath);
        
                    // Fetch book metadata
                    const meta = await eBookMeta.loaded.metadata;
                    
                    let coverImageUrl = null;
        
                    // Fetch cover image
                    if (eBookMeta.cover) {
                        const coverBlob = await eBookMeta.archive.getBlob(eBookMeta.cover);
                        coverImageUrl = URL.createObjectURL(coverBlob);
                    }
        
                    ebookMap.set(eBookPath, {
                        ...data,
                        path: eBookPath,
                        title: meta.title,
                        author: meta.creator,
                        coverImageUrl,
                        uploadDate: data.uploadDate
                    });

                    return () => {
                        eBookMeta.destroy();
                    };
                })
            );
            // Sort or filter based on 'recent' and 'sortFav'
            let ebooksArray  = Array.from(ebookMap.values());
            if(recent)
            {
                const sortedByDate =  ebooksArray.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                setFilteredBook(sortedByDate)
                setEbooks(sortedByDate)
            }
            else if(sortFav)
            {
                const favoriteBooks = ebooksArray.filter(a => a.favorite === true);
                setFilteredBook(favoriteBooks)
                setEbooks(favoriteBooks)
            }
            else
            {   
                setFilteredBook(ebooksArray);
                setEbooks(ebooksArray);
            }
        } 
        catch (error) 
        {
            toast.error(error.message, {
                position: "bottom-center",
                autoClose: 3000,
            })
        }
        finally
        {
            setLoading(false)
        }
    },[recent, sortFav, setLoading])

    useEffect(() => {
        fetchEbooks()
    },[fetchEbooks])    
    

    const handleClick = (ebook) => {
        localStorage.setItem('path', ebook.path)
        localStorage.setItem('title', ebook.title)
        localStorage.setItem('author', ebook.author)
        localStorage.setItem('coverImageUrl', ebook.coverImageUrl)
        localStorage.setItem('uploadDate', ebook.uploadDate)
    } 

    const handleSearch = ({target:{value}}) => {
        if(value)
        {
            const searchBook = ebooks.filter((book) => book.title.toLowerCase().includes(value.toLowerCase()))
            setFilteredBook(searchBook)
        }
        else
        {
            setFilteredBook(ebooks);
        }
    }

    const handleDelete = async(bookId) => {
        try 
        {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/ebook/delete/${bookId}`)
            console.log(response);
            
            const {message } = response.data
            if(message)
            {
                toast.success(message, {
                    position: "bottom-center",
                    autoClose: 3000,
                })
            }
            fetchEbooks()
        } 
        catch (error) 
        {
            console.error(error.message);
        }
    }

    const setFavorite = async (bookId, currentFavStatus) => {
        try 
        {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/ebook/favorite/${bookId}`, {favorite:!currentFavStatus})
            
            if(response.status === 200)
            {
                fetchEbooks()
            }
            
        } 
        catch (error) 
        {
            console.error(error.message);
        }
    }
    

    return (
        <div className={`container-fluid ${darkMode ? "dark": "light"}`}>
            <div className="row">
                <Sidebar size={ebooks.length} reload={fetchEbooks}/>
                <div className="col-9 right-panel" id='panel'>
                    <div className='search-book'>
                        <input type="text" className="form-control form-control-sm search-book" 
                        placeholder='Type book name'
                        onChange={handleSearch}
                        />
                    </div>
                    <hr />
                    <div className='book-container'>
                        {
                            loading ? <PageLoading /> :
                            filteredBook.map((ebook)=> (
                                <div className="card" style={{width: '10rem', backgroundColor: "#fff", color: "#000"}} key={ebook._id}>
                                    <a href="/viewer"><img src={ebook.coverImageUrl} onClick={() => handleClick(ebook)} className="card-img-top" alt="..."/>
                                    </a>
                                    <div className='d-flex justify-content-around'>
                                        <i className={`bi bi-heart-fill ${ebook.favorite ? 'liked' : 'not-liked'}`} onClick={() => setFavorite(ebook._id, ebook.favorite)}></i>
                                        <i className="bi bi-trash3-fill" onClick={() => handleDelete(ebook._id)}></i>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default withAuth(Home)