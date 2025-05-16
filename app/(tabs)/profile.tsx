import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useMissions } from '@/hooks/useMissions';
import { useAchievements } from '@/hooks/useAchievements';
import { router, useFocusEffect } from 'expo-router';
import { LogOut, Settings, Edit2, Shield, Award, Trophy, Clock } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { completedMissions, fetchCompletedMissions, isLoading: isLoadingMissions, error: missionsError } = useMissions();
  const { achievements, fetchAchievements } = useAchievements();
  const [activeTab, setActiveTab] = useState('achievements');

  useEffect(() => {
    loadUserData();
    // Fetch achievements when the Achievements tab is active
    if (activeTab === 'achievements') {
      fetchAchievements();
    }
  }, []);

  const loadUserData = async () => {
    await Promise.all([
      fetchCompletedMissions(),
      fetchAchievements()
    ]);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: async () => {
            await logout();
            router.replace('/(auth)');
          },
          style: "destructive"
        }
      ]
    );
  };

  const getCompletedMissionsCount = () => {
    return completedMissions?.length || 0;
  };

  const getAchievementsCount = () => {
    return achievements?.length || 0;
  };

  // Calculate user's impact score based on completed missions and achievements
  const calculateImpactScore = () => {
    const missionsScore = getCompletedMissionsCount() * 10;
    const achievementsScore = getAchievementsCount() * 25;
    return missionsScore + achievementsScore;
  };

  // Determine user level based on impact score
  const getUserLevel = () => {
    const score = calculateImpactScore();
    if (score < 100) return "Beginner";
    if (score < 500) return "Activist";
    if (score < 1000) return "Change Maker";
    if (score < 2000) return "Impact Leader";
    return "Sustainability Champion";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Profile</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/settings')}
          >
            <Settings size={20} color="#333333" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#333333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: user?.photoURL || 'https://images.pexels.com/photos/5212650/pexels-photo-5212650.jpeg' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editButton}>
                <Edit2 size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.displayName}</Text>
              <View style={styles.levelBadge}>
                <Shield size={14} color="#1E90FF" />
                <Text style={styles.levelText}>{getUserLevel()}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getCompletedMissionsCount()}</Text>
              <Text style={styles.statLabel}>Missions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getAchievementsCount()}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{calculateImpactScore()}</Text>
              <Text style={styles.statLabel}>Impact Score</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
            onPress={() => setActiveTab('achievements')}
          >
            <Award size={18} color={activeTab === 'achievements' ? '#1E90FF' : '#666666'} />
            <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
              Achievements
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Clock size={18} color={activeTab === 'history' ? '#1E90FF' : '#666666'} />
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              History
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'achievements' ? (
          <View style={styles.achievementsContainer}>
            {isLoadingAchievements ? (
              <ActivityIndicator size="large" color="#1E90FF" style={{ marginTop: 20 }} />
 ) : achievementsError ? (
              <Text style={styles.errorText}>Error loading achievements: {achievementsError.message}</Text>
            ) : achievements && achievements.length > 0 ? (
              achievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementCard}>
                  <View style={styles.achievementIconContainer}>
                    <Trophy size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                    <Text style={styles.achievementDate}>
                      Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/7376/startup-photos.jpg' }}
                  style={styles.emptyStateImage}
                />
                <Text style={styles.emptyStateTitle}>No Achievements Yet</Text>
                <Text style={styles.emptyStateText}>
                  Complete missions to earn achievements and badges that showcase your impact.
                </Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={() => router.push('/')}
                >
                  <Text style={styles.emptyStateButtonText}>Explore Missions</Text>
                </TouchableOpacity>
              </View>
            )}
          </View> : (
          <View style={styles.historyContainer}> {/* History Tab */}
            {completedMissions && completedMissions.length > 0 ? (
              completedMissions.map((mission) => (
                // Consider using FlatList for potentially long lists for better performance
                <View key={mission.id} style={styles.historyCard}> {/* Completed Mission Card */}
                  <View
                    style={[
                      styles.historyCardBadge,
                      { backgroundColor: mission.sdg?.colorCode || '#1E90FF' }
                    ]}
                    <Text style={styles.historyCardBadgeText}>Goal {mission.sdg?.id || '?'}</Text>
                  </View>
                  <Text style={styles.historyCardTitle}>{mission.title}</Text>
                  <Text style={styles.historyCardDate}>
                    Completed on {new Date(mission.completedAt).toLocaleDateString()}
                  </Text>
                </View>
 ))
 : isLoadingMissions ? (
 <ActivityIndicator size="large" color="#1E90FF" style={{ marginTop: 20 }} />
            ) : missionsError ? (
 <Text style={styles.errorText}>Error loading completed missions: {missionsError.message}</Text>

            ) : (
              <View style={styles.emptyState}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg' }}
                  style={styles.emptyStateImage}
                />
                <Text style={styles.emptyStateTitle}>No Completed Missions</Text>
                <Text style={styles.emptyStateText}>
                  Your completed mission history will appear here. Get started by completing your first mission.
                </Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={() => router.push('/')}
                >
                  <Text style={styles.emptyStateButtonText}>View Missions</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  screenTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333333',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F9FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1E90FF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333333',
    marginBottom: 4,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F1FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#1E90FF',
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#333333',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#F0F2F5',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1E90FF',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#1E90FF',
  },
  achievementsContainer: {
    padding: 20,
  },
  achievementCard: {
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
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  achievementDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999999',
  },
  historyContainer: {
    padding: 20,
  },
  historyCard: {
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
  historyCardBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  historyCardBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  historyCardTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  historyCardDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999999',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  emptyStateButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});