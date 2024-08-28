import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Settings from './components/Settings';  // Settingsコンポーネントをインポート

interface Book {
  alt_text: string;
  price: string;
  image_url: string;
}

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [trackingMessage, setTrackingMessage] = useState<string | null>(null);

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

  const handleSaveSettings = (period: number, interval: number) => {
    fetch('http://127.0.0.1:5000/setting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ period, interval }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTrackingMessage('トラッキングを開始しました');
        setTimeout(() => setTrackingMessage(null), 5000);  // 5秒後にメッセージを非表示
      })
      .catch((error) => console.error('Error saving settings:', error));
  };

  return (
    <div className='App'>
      <Header />
      <div className="ui container">
        <h1 className="ui header">Amazon Bestsellers</h1>
        <div className="ui three column grid">
          {books.map((book, index) => (
            <div key={index} className="column">
              <div className="ui card" onClick={() => setSettingsOpen(true)}>
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
        {trackingMessage && (
          <div className="ui message">
            <div className="header">{trackingMessage}</div>
          </div>
        )}
        <Settings
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          trackingPeriod={24} // デフォルト値を設定
          updateInterval={1}  // デフォルト値を設定
          onSave={handleSaveSettings}
        />
      </div>
    </div>
  );
};

export default App;
