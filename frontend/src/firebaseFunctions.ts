// src/firebaseFunctions.ts
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const fetchTrackedItems = async () => {
  try {
    const q = query(collection(db, 'trackedItems'));
    const querySnapshot = await getDocs(q);
    const trackedItems = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as {
        startDate: any;
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
