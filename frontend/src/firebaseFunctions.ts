// src/firebaseFunctions.ts
import { collection, getDocs, query, QuerySnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

// トラッキング項目の型定義
interface TrackedItem {
  id: string;
  startDate: string; // Firestore から取得する日付が ISO 形式で保存されていることを想定
  remainingDays: number;
  interval: number;
  image: string;
  altText: string;
  price: string;
}

// トラッキング項目を取得する関数
export const fetchTrackedItems = async (): Promise<TrackedItem[]> => {
  try {
    // トラッキングアイテムのコレクションを取得するクエリを作成
    const q = query(collection(db, 'trackedItems'));
    
    // ドキュメントを取得
    const querySnapshot: QuerySnapshot = await getDocs(q);
    
    // ドキュメントからデータを取得し、TrackedItem 型の配列を作成
    const trackedItems: TrackedItem[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as {
        startDate: string; // Firestore から取得する日付が文字列で保存されていることを想定
        remainingDays: number;
        interval: number;
        image: string;
        altText: string;
        price: string;
      }
    }));
    
    return trackedItems;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    return [];
  }
};
