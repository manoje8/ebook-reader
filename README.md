# EPUB Reader

An interactive EPUB reader built with the MERN stack. It allows users to upload, store, and read EPUB books, displaying metadata (title, author, cover image) and rendering the contents for reading. EPUB files are stored on the server, and metadata is stored in MongoDB.

## Features

- **Upload and Read ePub Files**: Users can upload their ePub books and read them directly in the browser.
- **Interactive Reading Interface**: Navigate between chapters, pages, and bookmarks with ease.
- **Customization**: Adjust switch between light and dark themes, and control line spacing for a personalized reading experience.

## Features

- Upload EPUB books
- Extract and display book metadata (title, author, cover image)
- Read EPUB content
- Store books and metadata in MongoDB
- Responsive reader interface
- Store book files locally 

## Technologies Used

- **Frontend**: React.js, Axios, EPUB.js (for rendering EPUB files)
- **Backend**: Node.js, Express.js, Multer (for file uploads), EPUB-parser
- **Database**: MongoDB, Mongoose
- **Storage**: Local filesystem 
- **Styling**: Bootstrap / custom CSS

### File Upload

1. Click on the "Upload EPUB / Add icon" button in the frontend to choose a file.
2. The backend will parse the EPUB, extract metadata, and save it in MongoDB.
3. The book cover (if available) and metadata will be displayed on the frontend.

### Installation

1. Clone the repository and navigate to the `client` folder:

```
git clone https://github.com/your-username/ebook-reader.git	
cd ebook-reader
```

2. Install the dependencies:

```
npm install
```


3. Start the development server:

```
npm start
```
  
The frontend will be available at `http://localhost:3000`.

### Future Improvements

- **Pagination for large libraries**
- **Full-text search within EPUB content**
- **Highlighting and bookmarking for readers**
- **Cloud storage integration (AWS S3, etc.)**
- **User authentication for personalized libraries**