import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useMissions } from '@/hooks/useMissions';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Check, CheckSquare, Square, Share2 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function MissionDetailsScreen() {
  const { id, type } = useLocalSearchParams();
  const { streamMissionDetails, completeMission, updateMissionStep } = useMissions();
  const { user } = useAuth();
  const [mission, setMission] = useState(null);

  useEffect(() => {
    if (id && type) {
      const unsubscribe = streamMissionDetails(id as string, (data) => {
        setMission(data);
      });
      return () => unsubscribe();
    }
  }, [id, type, streamMissionDetails]);

  const handleStepToggle = async (stepId) => {
    await updateMissionStep(mission.id, stepId, type as string);
    setRefreshKey(prev => prev + 1);
  };

  const handleCompleteMission = async () => {
    if (!mission) return;
    
    // Check if all steps are completed (real-time data will reflect toggles)
    const allStepsCompleted = mission.steps.every(step => step.completed);
    
    if (!allStepsCompleted) {
      Alert.alert(
        "Incomplete Steps",
        "Please complete all steps before marking the mission as complete.",
        [{ text: "OK" }]
      );
      return;
    }
    
    await completeMission(mission.id, type as string);
    
    Alert.alert(
      "Mission Completed!",
      "Congratulations on completing this mission and making a positive impact!",
      [
        {
          text: "Share Achievement",
          onPress: () => router.push('/post/create?missionId=' + mission.id),
        },
        {
          text: "Continue",
          onPress: () => router.back(),
          style: "default",
        }
      ]
    );
  };

  const handleShare = () => {
    router.push('/post/create?missionId=' + mission.id);
  };

  if (!mission) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading mission details...</Text>
      </View>
    );
  }

  const isCompleted = mission.completed;
  const stepCompletionCount = mission.steps.filter(step => step.completed).length;
  const totalSteps = mission.steps.length;
  const progressPercentage = totalSteps > 0 ? (stepCompletionCount / totalSteps) * 100 : 0;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: mission.sdg.colorCode }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.sdgInfo}>
            <Image source={{ uri: mission.sdg.iconUrl }} style={styles.sdgIcon} />
            <Text style={styles.sdgTitle}>Goal {mission.sdg.id}: {mission.sdg.title}</Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <Animated.View 
            entering={FadeInUp.delay(200).duration(500)}
            style={styles.missionCard}
          >
            <View style={styles.missionHeader}>
              <Text style={styles.missionTitle}>{mission.title}</Text>
              <View style={styles.missionTypeContainer}>
                <Text style={styles.missionType}>
                  {type === 'daily' ? 'Daily Mission' : 'Weekly Mission'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.missionDescription}>{mission.description}</Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressText}>
                  {stepCompletionCount} of {totalSteps} steps completed
                </Text>
                <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progressPercentage}%` }
                  ]} 
                />
              </View>
            </View>
          </Animated.View>
          
          <View style={styles.stepsSection}>
            <Text style={styles.sectionTitle}>Steps to Complete</Text>
            
            {mission.steps.map((step, index) => (
              <Animated.View 
                key={step.id}
                entering={FadeInDown.delay(300 + index * 100).duration(500)}
                style={styles.stepCard}
              >
                <TouchableOpacity
                  style={styles.stepCheckbox}
                  onPress={() => handleStepToggle(step.id)}
                  disabled={isCompleted}
                >
                  {step.completed ? (
                    <CheckSquare size={24} color="#1E90FF" />
                  ) : (
                    <Square size={24} color="#666666" />
                  )}
                </TouchableOpacity>
                <View style={styles.stepContent}>
                  <Text style={styles.stepText}>{step.description}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
          
          <View style={styles.impactSection}>
            <Text style={styles.sectionTitle}>Your Impact</Text>
            <View style={styles.impactCard}>
              <Text style={styles.impactDescription}>
                {mission.impact || 'By completing this mission, you are contributing to sustainable development and making a positive impact on the environment and society.'}
              </Text>
            </View>
          </View>
          
          <View style={styles.buttonsContainer}>
            {!isCompleted ? (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleCompleteMission}
              >
                <Check size={20} color="#FFFFFF" />
                <Text style={styles.completeButtonText}>Mark as Complete</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
              >
                <Share2 size={20} color="#FFFFFF" />
                <Text style={styles.shareButtonText}>Share Achievement</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  sdgInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sdgIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  sdgTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  content: {
    padding: 20,
  },
  missionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: -20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  missionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333333',
    flex: 1,
  },
  missionTypeContainer: {
    backgroundColor: '#E8F1FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  missionType: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#1E90FF',
  },
  missionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  progressPercentage: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#1E90FF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E90FF',
    borderRadius: 4,
  },
  stepsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 16,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  stepCheckbox: {
    marginRight: 16,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  impactSection: {
    marginBottom: 24,
  },
  impactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  impactDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  completeButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  completeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  shareButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  shareButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});