import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSDGs } from '@/hooks/useSDGs';
import { Search } from 'lucide-react-native';

export default function SDGsScreen() {
  const { sdgs, fetchSDGs, isLoading, error } = useSDGs();

  useEffect(() => {
    fetchSDGs();
  }, []);

  const renderSDGItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.sdgCard, { backgroundColor: item.colorCode }]}
      onPress={() => router.push(`/sdg/${item.id}`)}
    >
      <Image source={{ uri: item.iconUrl }} style={styles.sdgIcon} />
      <View style={styles.sdgInfo}>
        <Text style={styles.sdgNumber}>Goal {item.id}</Text>
        <Text style={styles.sdgTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sustainable Development Goals</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="#333333" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        The 17 SDGs are integrated—action in one area will affect outcomes in others
      </Text>

      <View style={styles.sdgList}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E90FF" />
          </View>
        ) : error ? ( // Add condition for displaying error
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading SDGs: {error.message}</Text>
          </View>
        ) : (
          <FlatList
            data={sdgs}
            renderItem={renderSDGItem}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333333',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    lineHeight: 20,
  },
  sdgList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  sdgCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  sdgIcon: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  sdgInfo: {
    flex: 1,
  },
  sdgNumber: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  sdgTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
  },
  // Add styles for error display
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'red', // Or a more appropriate error color
    textAlign: 'center',
  },
});