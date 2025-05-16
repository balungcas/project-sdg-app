import React, { memo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, Check } from 'lucide-react-native';

interface MissionStep {
  id: string;
  description: string;
  completed: boolean;
}

interface SDG {
  id: number;
  title: string;
  colorCode: string;
  iconUrl: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  steps: MissionStep[];
  sdg: SDG;
  type: string;
  completed: boolean;
  impact?: string;
}

interface MissionCardProps {
  mission: Mission;
  type: string;
}

function MissionCard({ mission, type }: MissionCardProps) {
  const completedSteps = mission.steps.filter(step => step.completed).length;
  const totalSteps = mission.steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const handlePress = () => {
    router.push(`/mission/${mission.id}?type=${type}`);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        mission.completed && styles.completedCard
      ]}
      onPress={handlePress}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View 
            style={[
              styles.sdgBadge, 
              { backgroundColor: mission.sdg.colorCode }
            ]}
          >
            <Image 
              source={{ uri: mission.sdg.iconUrl }} 
              style={styles.sdgIcon} 
            />
            <Text style={styles.sdgText}>Goal {mission.sdg.id}</Text>
          </View>
          
          {mission.completed ? (
            <View style={styles.completedBadge}>
              <Check size={14} color="#FFFFFF" />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          ) : (
            <Text style={styles.missionType}>
              {type === 'daily' ? 'Daily' : 'Weekly'}
            </Text>
          )}
        </View>
        
        <Text style={styles.title}>{mission.title}</Text>
        
        <Text 
          style={styles.description}
          numberOfLines={2}
        >
          {mission.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {completedSteps}/{totalSteps} steps
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
          </View>
          
          <ChevronRight size={20} color="#666666" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
    overflow: 'hidden',
  },
  completedCard: {
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sdgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  sdgIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  sdgText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  missionType: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#666666',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  completedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    marginRight: 16,
  },
  progressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E90FF',
    borderRadius: 2,
  },
});

export default memo(MissionCard);