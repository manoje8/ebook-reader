import './App.css';
import BookProvider from './context/bookContext';

function App({children}) {
  return (
    <div className='App'>
      <BookProvider>
        {children}
      </BookProvider>
    </div>
  );
}

export default App;
