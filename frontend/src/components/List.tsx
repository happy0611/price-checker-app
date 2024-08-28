import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

interface TrackedItem {
  id: string;
  startDate: string;
  remainingDays: number;
  interval: number;
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
        const querySnapshot = await getDocs(collection(db, "trackedItems"));
        const items: TrackedItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as TrackedItem);
        });
        setTrackedItems(items);
      } catch (error) {
        console.error("データ取得中のエラー:", error);
      }
    };

    fetchTrackedItems();
  }, [db]);

  return (
    <div>
      <h2>追跡中の商品</h2>
      <ul>
        {trackedItems.map(item => (
          <li key={item.id}>
            <img src={item.image} alt={item.alt_text} style={{ width: '100px' }} />
            <div>{item.alt_text}</div>
            <div>{item.price}</div>
            <div>開始日: {item.startDate}</div>
            <div>残り日数: {item.remainingDays}</div>
            <div>更新間隔: {item.interval}分</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
