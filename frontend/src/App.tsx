import React, { useState, useEffect } from 'react';
import './App.css';

interface Book {
  alt_text: string;  
  price: string;
  image_url: string;  
}

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/books')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setBooks(data))
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  return (
    <div className="ui container">
      <h1 className="ui header">Amazon Bestsellers</h1>
      <div className="ui three column grid">
        {books.map((book, index) => (
          <div key={index} className="column">
            <div className="ui card">
              <div className="image">
                <img src={book.image_url} alt={book.alt_text} />
              </div>
              <div className="content">
                <div className="header">{book.alt_text}</div>
                <div className="meta">{book.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
