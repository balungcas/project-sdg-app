import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { MessageCircle, Heart, Share2, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native';
export default function CommunityScreen() {
  const { posts, fetchPosts, fetchMorePosts, likePost, isLoading, error, hasMorePosts } = usePosts();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    await fetchPosts();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMorePosts) {
      fetchMorePosts();
    }
  };

  const handleLike = (postId) => {
 likePost(postId, user?.uid);
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={{ uri: item.user.photoURL || 'https://images.pexels.com/photos/5212650/pexels-photo-5212650.jpeg' }}
          style={styles.userAvatar}
        />
        <View style={styles.userInfo}>
 <Text style={styles.userName}>{item.user.displayName}</Text>
 <Text style={styles.postTime}>{formatTimestamp(item.timestamp)}</Text>
        </View>
      </View>

      <View style={styles.postContent}>
 <Text style={styles.postText}>{item.content}</Text>

        {item.imageURL && (
          <Image
            source={{ uri: item.imageURL }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}

        {item.mission && (
 <View style={styles.missionInfo}>
            <View 
              style={[
                styles.missionBadge, 
                { backgroundColor: item.mission.sdg?.colorCode || '#1E90FF' }
              ]}
            >
              <Text style={styles.missionBadgeText}>
                Goal {item.mission.sdg?.id || '?'}
              </Text>
            </View>
            <Text style={styles.missionTitle}>{item.mission.title}</Text>
          </View>
        )}
      </View>

      <View style={styles.postActions}>
 <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
 <Heart
 size={18}
            color={item.likes.includes(user?.uid) ? '#F91880' : '#666666'}
 fill={item.likes.includes(user?.uid) ? '#F91880' : 'transparent'}
          />
          <Text style={styles.actionText}>{item.likes.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={18} color="#666666" />
          <Text style={styles.actionText}>{item.comments.length}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={18} color="#666666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    const now = new Date();
    const postDate = new Date(timestamp);

    const diffInMs = now - postDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

 if (error && posts.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error loading posts: {error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
 </View>
    );
  }

  if (isLoading && posts.length === 0 && !error) {
    return (<View style={styles.centeredContainer}><ActivityIndicator size="large" color="#1E90FF" /></View>);
  }
  const renderFooter = () => {
    if (!isLoading || !hasMorePosts) return null;
    return (

      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color="#1E90FF" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('/post/create')}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={item => item.id}
 showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E90FF']} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // Adjust threshold as needed
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/6146929/pexels-photo-6146929.jpeg' }}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyDescription}>
              Share your impact journey with the community by completing missions and posting your achievements.
            </Text>
 <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/post/create')}
            >
              <Text style={styles.emptyButtonText}>Create First Post</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={renderFooter()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
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
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#333333',
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  listContent: {
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
  },
  postTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
  postContent: {
    marginBottom: 16,
  },
  postText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
    marginBottom: 12,
    lineHeight: 20,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  missionInfo: {
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 8,
  },
  missionBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  missionBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  missionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
    marginBottom: 8,
  },
  emptyDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE',
  },
  retryButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  }
});