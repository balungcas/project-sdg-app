import React, { createContext, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const db = getFirestore();
export const MissionContext = createContext({
  missions: { daily: [], weekly: [] },
  missionsBySDG: [],
  completedMissions: [],
  fetchDailyMissions: async () => {},
  fetchWeeklyMissions: async () => {},
  fetchMissionsBySDG: async (sdgId: number) => {},
  fetchCompletedMissions: async () => {},
  getMissionById: (id: string, type?: string) => null,
  completeMission: async (id: string, type: string) => {},
  updateMissionStep: async (missionId: string, stepId: string, type: string) => {},
  isLoading: false,
});

export const MissionProvider = ({ children }) => {
  const [missions, setMissions] = useState({ daily: [], weekly: [] });
  const [missionsBySDG, setMissionsBySDG] = useState([]);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, these would fetch from Firebase
  const fetchDailyMissions = async () => {
    setIsLoading(true);
    try {
      const missionsCollection = collection(db, 'missions');
      const q = query(missionsCollection, where('frequency', '==', 'daily'), where('is_active', '==', true));
      const querySnapshot = await getDocs(q);
      const dailyMissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMissions(prev => ({ ...prev, daily: dailyMissions }));
    } catch (error) {
      // @ts-ignore
      console.error('Error fetching daily missions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeeklyMissions = async () => {
    setIsLoading(true);
    try {
      const missionsCollection = collection(db, 'missions');
      const q = query(missionsCollection, where('frequency', '==', 'weekly'), where('is_active', '==', true));
      const querySnapshot = await getDocs(q);
      const weeklyMissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMissions(prev => ({ ...prev, weekly: weeklyMissions }));
    } catch (error) {
      // @ts-ignore
      console.error('Error fetching weekly missions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMissionsBySDG = async (sdgId: number) => {
    setIsLoading(true);
    try {
      const missionsCollection = collection(db, 'missions');
      const q = query(missionsCollection, where('sdgId', '==', sdgId), where('is_active', '==', true));
      const querySnapshot = await getDocs(q);
      const missions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMissionsBySDG(missions);
    } catch (error) {
      // @ts-ignore
      console.error('Error fetching missions by SDG:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // This function fetches completed missions for the currently logged-in user
  // You'll need to get the user's UID from your AuthContext
  const fetchCompletedMissions = async () => {
    setIsLoading(true);
    try {
      // Replace 'userId' with the actual logged-in user's ID
      const userId = 'CURRENT_USER_ID'; // TODO: Get actual user ID from AuthContext
      if (!userId) {
        setCompletedMissions([]);
        setIsLoading(false);
        return;
      }

      const completedMissionsCollection = collection(db, `users/${userId}/completedMissions`);
      const querySnapshot = await getDocs(completedMissionsCollection);
      const completed = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompletedMissions(completed);
    } catch (error) {
      // @ts-ignore
      console.error('Error fetching completed missions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMissionById = async (id: string) => {
    try {
      const missionDocRef = doc(db, 'missions', id);
      const missionSnapshot = await getDocs(missionDocRef);
      if (missionSnapshot.exists()) {
        return { id: missionSnapshot.id, ...missionSnapshot.data() };
      }
      return null;
    } catch (error) {
      // @ts-ignore
      console.error('Error getting mission by id:', error);
      return null;
    }
  };

  // This function marks a mission as complete for the currently logged-in user
  const completeMission = async (id: string) => {
    try {
      // Replace 'userId' with the actual logged-in user's ID
      const userId = 'CURRENT_USER_ID'; // TODO: Get actual user ID from AuthContext
      if (!userId) throw new Error("User not logged in");

      const userMissionDocRef = doc(db, `users/${userId}/completedMissions`, id);
      await updateDoc(userMissionDocRef, {
        completed: true,
        completedAt: new Date(),
      });
      fetchCompletedMissions(); // Refresh completed missions
      return true;
    } catch (error) {
      // @ts-ignore
      console.error('Error completing mission:', error);
      return false;
    }
  };

  // This function updates a step within a mission for the currently logged-in user
  const updateMissionStep = async (missionId: string, stepId: string) => {
    try {
      // Replace 'userId' with the actual logged-in user's ID
      const userId = 'CURRENT_USER_ID'; // TODO: Get actual user ID from AuthContext
      if (!userId) throw new Error("User not logged in");

      const userMissionDocRef = doc(db, `users/${userId}/completedMissions`, missionId);
      // This assumes steps are stored as an array of objects with a 'completed' field
      // You might need to adjust this based on your actual data structure
      // A transaction might be better here to ensure atomicity if you have complex updates
      const missionSnapshot = await getDocs(userMissionDocRef);
      if (missionSnapshot.exists()) {
        const missionData = missionSnapshot.data();
        const updatedSteps = missionData.steps.map(step => {
          if (step.id === stepId) {
            return { ...step, completed: !step.completed };
          }
          return step;
        });
        await updateDoc(userMissionDocRef, { steps: updatedSteps });
      }

      return true;
    } catch (error) {
      // @ts-ignore
      console.error('Error updating mission step:', error);
      return false;
    }
  };

  return (
    <MissionContext.Provider
      value={{
        missions,
        missionsBySDG,
        completedMissions,
        fetchDailyMissions,
        fetchWeeklyMissions,
        fetchMissionsBySDG,
        fetchCompletedMissions,
        getMissionById,
        completeMission,
        updateMissionStep,
        isLoading,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};