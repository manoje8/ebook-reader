import { createContext, useCallback, useContext, useEffect, useState } from "react";

const BookContext = createContext()

export const useBook = () => useContext(BookContext)

const BookProvider = ({children}) => {
    const [userName, setUserName] = useState(null)
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recent, setRecent] = useState(false)
    const [sortFav, setSortFav] = useState(false)

    const [selectedBook, setSelectedBook] = useState({
        path: '',
        author: '',
        title: '',
        coverImageUrl: '',
        uploadDate: ''
    })

    const [darkMode, setDarkMode] = useState(false);

    const fetchData = useCallback(async () => {
        const path = localStorage.getItem('path')
        const author = localStorage.getItem('author')
        const title = localStorage.getItem('title')
        const coverImageUrl = localStorage.getItem('coverImageUrl')
        const uploadDate = localStorage.getItem('uploadDate')

        const storedName = localStorage.getItem("name")
        setUserName(storedName)
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        setLoading(false); 

        setSelectedBook({
            path , 
            author ,
            title ,
            coverImageUrl,
            uploadDate
        });

    },[setSelectedBook])

    useEffect(() => {
        fetchData()
        
    },[fetchData])

    // Fetch theme data separately
    useEffect(() => {
        const theme = localStorage.getItem('theme');
        setDarkMode(theme === 'true');
    }, []);

    const themeToggle = () => {
        setDarkMode(!darkMode)
        localStorage.setItem('theme', darkMode)
    }

    const sortByRecent = () => {
        setRecent(!recent)
        setSortFav(false)
    }

    const sortByFavorite = () => {
        setSortFav(!sortFav)
        setRecent(false)
    }

    const sortByAll = () => {
        setRecent(false)
        setSortFav(false)
    }

    const context = {
        selectedBook,
        setSelectedBook,
        themeToggle,
        darkMode,
        token,
        setToken,
        loading,
        setLoading,
        userName,
        setUserName,
        recent,
        sortByRecent,
        sortFav,
        sortByFavorite,
        sortByAll
    }
    return <BookContext.Provider value={context}>{children}</BookContext.Provider>
}

export default BookProvider