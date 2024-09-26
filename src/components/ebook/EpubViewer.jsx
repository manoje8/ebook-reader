import { useCallback, useEffect, useState } from "react";
import ePub from 'epubjs'
import { useBook } from "../../context/bookContext";
import './EpubViewer.css'
import { useNavigate } from "react-router-dom";

const EpubViewer = () => {
    const {selectedBook, setSelectedBook} = useBook()
    const [book, setBook] = useState(null);
    const [content, setContent] = useState('');
    const [toc, setToc] = useState([]);
    const [rendition, setRendition] = useState(null);
    const [isDoublePage, setIsDoublePage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showTOC, setShowTOC] = useState(false);
    const [currentChapter, setCurrentChapter] = useState(null);
    const navigate = useNavigate()

    const fetchEbook = useCallback(async(file) => {
        if (!file) return;

        // Load the book
        const book = ePub(file);
        setBook(book);

        // Load the Table of Contents (TOC)
        const tableOfContents = await book.loaded.navigation;
        setToc(tableOfContents.toc);

        const rendition = book.renderTo('viewer', {
        width: '100%',
        height: '100%',
        spread: 'auto',
        flow: 'paginated',
        });

        setRendition(rendition);

        // Set current page on relocation
        rendition.on('relocated', async (location) => {

            // Todo last location

            const section = await book.section(location.start.index);
            setCurrentPage(section);

            const content = await section.render();
            setContent(content)

            // Get the current chapter based on the location
            const current = book.navigation.toc.find((chapter) => {
                return location.start.href.includes(chapter.href);
            });

            if (current) 
            {
                setCurrentChapter(current.href); // Update the current chapter
            }
        });

        // Display the book
        rendition.display();

        return () => {
            rendition.destroy();
            book.destroy();
        };
    },[])

    useEffect(() => {
        if (selectedBook?.path)
        {
            fetchEbook(selectedBook?.path)
        } 

        if(book)
        {
            book.destroy()
        }

        if(rendition)
        {
            rendition.destroy()
        }

    },[selectedBook, fetchEbook]) // Only re-run when 'file' or 'fetchEbook' changes (fetchEbook is memoized)


    
    const nextPage = () => rendition.next();
    const prevPage = () => rendition.prev();

    const toggleSpread = () => {
        if(rendition)
        {
            setIsDoublePage(!isDoublePage);
            rendition.spread(isDoublePage ? 'none' : 'auto')
            rendition.resize();
        }
    }
    
    const backToLibrary = () => {
        localStorage.removeItem('path')
        localStorage.removeItem('author')
        localStorage.removeItem('title')
        localStorage.removeItem('coverImageUrl')
        localStorage.removeItem('uploadDate')
        setSelectedBook(null)
        setIsDoublePage(true)
        setShowTOC(false)
        rendition.destroy();
        book.destroy();
        navigate("/")
    };

    // Function to navigate to a specific chapter/section
    const goToChapter = (href) => {
        rendition.display(href); // Use the href of the chapter to navigate
    };

    // Listen for left and right key presses
    useEffect(() => {
        const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
            nextPage();
        } else if (event.key === 'ArrowLeft') {
            prevPage();
        }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
        window.removeEventListener('keydown', handleKeyDown);
        };
    }, [rendition]);

    

    return (
        <div className="container-fluid">
            <div className="viewer-header">
                <span className="divider">
                    <i className="bi bi-box-arrow-left mr-2 h-6" onClick= {backToLibrary}></i>
                    <i className={showTOC ? "bi bi-x-lg" :"bi bi-list h-6"} onClick={() => (setShowTOC(!showTOC))}></i>
                </span>

                <small className="text-center">{selectedBook?.title}</small>
                
                <div className="divider">
                    <i className={isDoublePage ? "bi bi-book-half" : "bi bi-journal"} onClick={toggleSpread}></i>
                    <div>
                        <i class="bi bi-caret-left" onClick={prevPage}></i>
                        <i class="bi bi-caret-right" onClick={nextPage}></i>
                    </div>
                    <small>Chapter: {currentPage.index}</small>
                </div>

            </div>
            <div className={`table-of-content ${showTOC ? '' : 'hidden'}`}>
                <ul className="list-group list-group-flush">
                    {toc.map((chapter, index) => (
                        <li key={index} className={`list-group-item ${currentChapter === chapter.href ? 'active' : ''}`} onClick={() => goToChapter(chapter.href)}>
                            {chapter.label}
                        </li>
                    ))}
                </ul>
            </div>
            <div id="viewer" className="viewer-container"></div>
        </div>
    )
}
export default EpubViewer