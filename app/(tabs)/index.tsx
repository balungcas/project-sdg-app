import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { CircleCheck as CheckCircle2, SquareCheck as CheckSquare, Square, ChevronRight } from 'lucide-react-native';
import MissionCard from '@/components/MissionCard';

export default function HomeScreen() {
  const { user } = useAuth();
  const { fetchDailyMissions, fetchWeeklyMissions, missions, isLoading, error } = useMissions();
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    await Promise.all([
      fetchDailyMissions(),
      fetchWeeklyMissions()
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMissions();
    setRefreshing(false);
  };

  // Get current completed missions count
  const completedDailyCount = missions.daily?.filter(mission => mission.completed).length || 0;
  const completedWeeklyCount = missions.weekly?.filter(mission => mission.completed).length || 0;
  
  // Get first name from display name
  const firstName = user?.displayName?.split(' ')[0] || 'Friend';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E90FF']} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {firstName}!</Text>
            <Text style={styles.subtitle}>Ready to make an impact today?</Text>
          </View>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: user?.photoURL || 'https://images.pexels.com/photos/5212650/pexels-photo-5212650.jpeg' }}
              style={styles.profileImage}
            />
          </View>
        </View>

        <View style={styles.progressOverview}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          
          <View style={styles.progressCards}>
            <View style={styles.progressCard}>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressLabel}>Daily Missions</Text>
                <Text style={styles.progressCount}>
                  <Text style={styles.progressHighlight}>{completedDailyCount}</Text>
                  {missions.daily ? '/' + missions.daily.length : '/0'}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: missions.daily?.length 
                        ? `${(completedDailyCount / missions.daily.length) * 100}%` 
                        : '0%' 
                    }
                  ]} 
                />
              </View>
            </View>
            
            <View style={styles.progressCard}>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressLabel}>Weekly Missions</Text>
                <Text style={styles.progressCount}>
                  <Text style={styles.progressHighlight}>{completedWeeklyCount}</Text>
                  {missions.weekly ? '/' + missions.weekly.length : '/0'}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: missions.weekly?.length 
                        ? `${(completedWeeklyCount / missions.weekly.length) * 100}%` 
                        : '0%' 
                    }
                  ]} 
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.dailyMissionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Missions</Text>
            <TouchableOpacity
              // Disable See All button while loading or if error
              disabled={isLoading || !!error}
              style={{ opacity: isLoading || !!error ? 0.5 : 1 }}
              onPress={() => router.push('/missions/daily')}

            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Display loading indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#1E90FF" />
              <Text style={styles.loadingText}>Loading daily missions...</Text>
            </View>
          )}

          {/* Display Error Message */}
          {!isLoading && error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error loading missions: {error.message}</Text>
            </View>
          ) : (
            // Display Daily Missions
            missions.daily && missions.daily.length > 0 ? (
            <View style={styles.missionsContainer}>
              {missions.daily.slice(0, 2).map((mission) => (
                <MissionCard key={mission.id} mission={mission} type="daily" />
              ))}
            </View>
          ) : (
 !isLoading && <View style={styles.emptyContainer}><Text style={styles.emptyText}>No daily missions found.</Text></View>
 )}
        </View>
        <View style={styles.weeklyMissionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Missions</Text>
            <TouchableOpacity
              // Disable See All button while loading or if error
              disabled={isLoading || !!error}
              style={{ opacity: isLoading || !!error ? 0.5 : 1 }}
              onPress={() => router.push('/missions/weekly')}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Display loading indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#1E90FF" />
              <Text style={styles.loadingText}>Loading weekly missions...</Text>
            </View>
          )}

          {/* Display Weekly Missions */}
          {!isLoading && missions.weekly && missions.weekly.length > 0 ? (
            <View style={styles.missionsContainer}>
              {missions.weekly.slice(0, 2).map((mission) => (
                <MissionCard key={mission.id} mission={mission} type="weekly" />
              ))}
            </View>
          ) : (
 !isLoading && <View style={styles.emptyContainer}><Text style={styles.emptyText}>No weekly missions found.</Text></View>
 )}
 </View>

        <TouchableOpacity
          style={styles.featuredSDGContainer}
          onPress={() => router.push('/sdgs')}
        >
          <View style={styles.featuredSDGContent}>
            <Text style={styles.featuredSDGTitle}>Explore All SDGs</Text>
            <Text style={styles.featuredSDGDescription}>
              Discover all 17 Sustainable Development Goals and find missions aligned with your interests
            </Text>
            <View style={styles.featuredSDGButton}>
              <Text style={styles.featuredSDGButtonText}>Explore Now</Text>
              <ChevronRight size={16} color="#FFFFFF" />
            </View>
          </View>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1546901/pexels-photo-1546901.jpeg' }}
            style={styles.featuredSDGImage}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  profileImageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  progressOverview: {
    marginBottom: 24,
  },
  progressCards: {
    marginTop: 12,
  },
  progressCard: {
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
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
  },
  progressCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  progressHighlight: {
    fontFamily: 'Inter-Bold',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E90FF',
  },
  dailyMissionsSection: {
    marginBottom: 24,
  },
  weeklyMissionsSection: {
    marginBottom: 24,
  },
  missionsContainer: {
    gap: 12,
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  errorContainer: {
    backgroundColor: '#FFEDED', // Light red background
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
 color: '#D32F2F', // Dark red text
    fontSize: 14,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  featuredSDGContainer: {
    backgroundColor: '#19376D',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: 160,
    marginBottom: 20,
  },
  featuredSDGContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  featuredSDGTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featuredSDGDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  featuredSDGButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredSDGButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: 4,
  },
  featuredSDGImage: {
    width: 120,
    height: '100%',
  },
});