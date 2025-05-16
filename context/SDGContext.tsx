import React, { createContext, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebase } from '@/config/firebase'; // Assuming firebase is exported from your config

export const SDGContext = createContext<{
  sdgs: [],
  fetchSDGs: () => {},
  getSDGById: (id: number) => null,
  isLoading: false,
});

export const SDGProvider = ({ children }) => {
  const [sdgs, setSDGs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const db = getFirestore(firebase);

  const fetchSDGs = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'sdgs'));
      const sdgsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSDGs(sdgsList as any); // Cast to any for now, you might want a more specific type
    } catch (error) {
      console.error('Error fetching SDGs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSDGById = (id) => {
    return sdgData.find(sdg => sdg.id === id) || null;
  };

  return (
    <SDGContext.Provider
      value={{
        sdgs,
        fetchSDGs,
        getSDGById,
        isLoading,
      }}
    >
      {children}
    </SDGContext.Provider>
  );
};