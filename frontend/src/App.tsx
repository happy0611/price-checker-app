import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Settings from './components/Settings';
import { fetchTrackedItems, } from './firebaseFunctions'; // Firebaseからのデータ取得関数をインポート
import { doc, setDoc } from "firebase/firestore";
import { db } from './firebase'; // 先ほど作成したfirebase.tsをインポート

interface Book {
  alt_text: string;
  price: string;
  image_url: string;
}

interface TrackedItem {
  id: string;
  startDate: any;
  remainingDays: number;
  interval: number;
  image: string;
  altText: string;
  price: string;
}

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [trackingPeriod, setTrackingPeriod] = useState<number>(7);
  const [updateInterval, setUpdateInterval] = useState<number>(5);
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationTimeout, setNotificationTimeout] = useState<number | null>(null);

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

  useEffect(() => {
    fetchTrackedItems()
      .then(data => setTrackedItems(data))
      .catch(error => console.error('Error fetching tracked items:', error));
  }, []);

  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  const handleSaveSettings = async (period: number, interval: number, image: string, alt_text: string, price: string) => {
    setTrackingPeriod(period);
    setUpdateInterval(interval);

    try {
        const response = await fetch('http://127.0.0.1:5000/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                period: period,
                interval: interval,
                image: image,
                alt_text: alt_text,
                price: price
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('設定がサーバーに保存されました:', data);
        setNotification('トラッキングを開始しました。');

        // 5秒後に通知を閉じる
        if (notificationTimeout !== null) {
            clearTimeout(notificationTimeout);
        }
        const timeoutId = window.setTimeout(() => {
            setNotification(null);
        }, 5000);
        setNotificationTimeout(timeoutId);

        closeSettings();
        setTrackedItems(await fetchTrackedItems()); // トラッキングデータのリストを更新
    } catch (error) {
        console.error('設定保存中のエラー:', error);
        setNotification('設定保存中にエラーが発生しました。');
    }
};


  const handleCloseNotification = () => {
    setNotification(null);
    if (notificationTimeout !== null) {
      clearTimeout(notificationTimeout);
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="ui container">
        <h1 className="ui header">Amazon Bestsellers</h1>
        <Settings
          open={settingsOpen}
          onClose={closeSettings}
          trackingPeriod={trackingPeriod}
          updateInterval={updateInterval}
          onSave={handleSaveSettings}
        />
        {notification && (
          <div className="ui message">
            {notification}
            <button className="ui button" onClick={handleCloseNotification}>
              閉じる
            </button>
          </div>
        )}
        <div className="ui three column grid">
          {books.map((book, index) => (
            <div key={index} className="column">
              <div className="ui card" onClick={openSettings}>
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
        <h2 className="ui header">追跡中の商品</h2>
        <div className="ui list">
          {trackedItems.map((item) => (
            <div key={item.id} className="item">
              <div className="image">
                <img src={item.image} alt={item.altText} />
              </div>
              <div className="content">
                <div className="header">{item.altText}</div>
                <div className="meta">
                  <span>価格: {item.price}</span>
                  <br />
                  <span>追跡開始日: {item.startDate.toDate().toLocaleDateString()}</span>
                  <br />
                  <span>残り日数: {item.remainingDays}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
