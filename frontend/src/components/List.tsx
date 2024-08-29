import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, Timestamp } from 'firebase/firestore';

interface TrackedItem {
  id: string;
  start_date: Date; // Date 型で保持
  remaining_days: number;
  interval: number;
  hope_money: number;
  image: string;
  alt_text: string;
  price: string;
}

const List: React.FC = () => {
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchTrackedItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tracked_items"));
        const items: TrackedItem[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const start_date = data.start_date instanceof Timestamp
            ? data.start_date.toDate()
            : new Date(); // Timestamp 型でない場合は、新しい Date を使用
          items.push({
            id: doc.id,
            start_date,
            remaining_days: data.remaining_days,
            interval: data.interval,
            hope_money: data.hope_money,
            image: data.image,
            alt_text: data.alt_text,
            price: data.price,
          } as TrackedItem);
        });
        setTrackedItems(items);
        console.log("データ取得完了:", items);
      } catch (error) {
        console.error("データ取得中のエラー:", error);
      }
    };

    fetchTrackedItems();
  }, []); // 空の依存関係配列

  // 日付をフォーマットする関数
  const formatDate = (date: Date) => {
    return date instanceof Date
      ? date.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      : ''; // date が Date 型でない場合は空文字列を返す
  };

  return (
    <div className="ui container">
      <h2 className="ui header">追跡中の商品</h2>
      {trackedItems.length > 0 ? (
        <div className="ui divided items">
          {trackedItems.map(item => (
            <div className="item" key={item.id}>
              <div className="image">
                <img src={item.image} alt={item.alt_text} style={{ width: '100px' }} />
              </div>
              <div className="content">
                <div className="header">{item.alt_text}</div>
                <div className="meta">
                  <span className="price">{item.price}</span>
                </div>
                <div className="description">
                  <p>開始日: {formatDate(item.start_date)}</p>
                  <p>希望価格: {item.hope_money}円</p>
                  <p>残り日数: {item.remaining_days}日</p>
                  <p>更新間隔: {item.interval}分</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ui message info">
          <div className="header">データがありません。</div>
          <p>現在、追跡中の商品はありません。</p>
        </div>
      )}
    </div>
  );
};

export default List;
