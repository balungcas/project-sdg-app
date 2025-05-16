import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSDGs } from '@/hooks/useSDGs';
import { useMissions } from '@/hooks/useMissions';
import { ArrowLeft, ExternalLink } from 'lucide-react-native';
import MissionCard from '@/components/MissionCard';

export default function SDGDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { getSDGById } = useSDGs();
  const { fetchMissionsBySDG, missionsBySDG, isLoading } = useMissions();
  const [sdg, setSdg] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    if (id) {
      const sdgData = getSDGById(parseInt(id as string));
      if (isMounted) {
        setSdg(sdgData);
        fetchMissionsBySDG(parseInt(id as string));
      }
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!sdg) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading SDG details...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: sdg.backgroundColor || '#F7F9FC' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: sdg.colorCode }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Image source={{ uri: sdg.iconUrl }} style={styles.sdgIcon} />
            <Text style={styles.sdgNumber}>Goal {sdg.id}</Text>
            <Text style={styles.sdgTitle}>{sdg.title}</Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this Goal</Text>
            <Text style={styles.description}>{sdg.description}</Text>
            
            <TouchableOpacity style={styles.learnMoreButton}>
              <Text style={styles.learnMoreText}>Learn More</Text>
              <ExternalLink size={16} color="#1E90FF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.targetsSection}>
            <Text style={styles.sectionTitle}>Key Targets</Text>
            {sdg.targets && sdg.targets.length > 0 ? (
              sdg.targets.map((target, index) => (
                <View key={index} style={styles.targetItem}>
                  <View style={styles.targetBullet} />
                  <Text style={styles.targetText}>{target}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noTargetsText}>No targets available</Text>
            )}
          </View>
          
          <View style={styles.localContextSection}>
            <Text style={styles.sectionTitle}>Philippine Context</Text>
            <Text style={styles.localContextText}>{sdg.localContext || 'Information about how this SDG applies to the Philippines context.'}</Text>
          </View>
          
          <View style={styles.missionsSection}>
            <Text style={styles.sectionTitle}>Available Missions</Text>
            
            {isLoading ? (
              <View style={styles.loadingMissions}>
                <Text style={styles.loadingText}>Loading missions...</Text>
              </View>
            ) : missionsBySDG && missionsBySDG.length > 0 ? (
              <View style={styles.missionsList}>
                {missionsBySDG.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} type={mission.type} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyMissions}>
                <Text style={styles.emptyMissionsText}>No missions available for this SDG yet.</Text>
              </View>
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
    paddingBottom: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  sdgIcon: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  sdgNumber: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  sdgTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  descriptionSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 16,
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E90FF',
    marginRight: 4,
  },
  targetsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  targetItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  targetBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E90FF',
    marginTop: 6,
    marginRight: 12,
  },
  targetText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  noTargetsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  localContextSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  localContextText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
  },
  missionsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  missionsList: {
    gap: 12,
  },
  loadingMissions: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyMissions: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyMissionsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
});