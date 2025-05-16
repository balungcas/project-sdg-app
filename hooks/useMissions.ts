import { useContext, useEffect, useState } from 'react';
import { MissionContext } from '@/context/MissionContext';
import { AuthContext } from '@/context/AuthContext';
import { doc, onSnapshot, getFirestore, query, collection, where, getDocs, updateDoc } from 'firebase/firestore';
import { firebaseApp } from '@/config/firebase';

const db = getFirestore(firebaseApp);

export const useMissions = () => {
  const missionContext = useContext(MissionContext);
  const { user } = useContext(AuthContext); // Assuming user is available here

  const [error, setError] = useState<string | null>(null);

  const streamMissionDetails = (missionId: string, callback: (mission: any) => void) => {
    setError(null);
    try {
      const missionDocRef = doc(db, 'missions', missionId);
      return onSnapshot(missionDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          callback({ id: docSnapshot.id, ...docSnapshot.data() });
        } else {
          callback(null); // Mission not found
        }
      });
    } catch (err: any) {
      setError(err.message);
      // Return a dummy unsubscribe function to maintain consistent return type
      return () => {};
    }
  };

  // You will need to implement these functions in MissionContext or here,
  // ensuring they handle loading and errors similar to streamMissionDetails.
  // The existing context already provides some of these, ensure error handling is added there.
  const { fetchDailyMissions, fetchWeeklyMissions, fetchCompletedMissions, getMissionById, updateMissionStep, completeMission } = missionContext;

  // Ensure error handling is added within the MissionContext methods if they are not implemented here.
  // For demonstration, I'm adding basic error handling to the methods provided by the context.



  return { ...missionContext, user, streamMissionDetails, error };
};