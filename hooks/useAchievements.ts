import { useState } from 'react';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const useAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  const fetchAchievements = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn('No user logged in to fetch achievements.');
      setAchievements([]);
      return;
    }
    setError(null);

    setIsLoading(true);
    try {
      const achievementsRef = collection(db, 'achievements');
      const q = query(achievementsRef, where('userId', '==', currentUser.uid), orderBy('earnedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedAchievements = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAchievements(fetchedAchievements as any[]); // Type assertion as doc.data() is unknown
    } catch (error) {
      setError(error);
      console.error('Error fetching achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    achievements,
    fetchAchievements,
    isLoading,
    error
  };
};