import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Heart } from 'lucide-react-native'; // Assuming lucide-react-native for icons

interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: any; // Firestore Timestamp or Date or string
  likes: number;
  missionId?: string; // Optional missionId for shared achievements
  // Add other post properties as needed (e.g., userName, userAvatar)
  // If mission details are embedded in the post document:
  sharedMission?: {
    title: string;
    sdg?: {
      id: string;
      title: string;
      iconUrl: string;
      colorCode: string;
    };
    // Add other relevant mission details you want to display
  };
}

interface PostCardProps {
  post: Post; // Assume post includes `likeCount`
  currentUserId: string | null; // Pass the current user ID
  onLike: (postId: string) => void; // Placeholder for like action
  // Add other props as needed (e.g., navigation)
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const isSharedMission = !!post.missionId;

  // Check if the current user has liked the post (assuming post.likedBy exists and is an array)
  const isLiked = post.likedBy?.includes(currentUserId);

  const handleLike = () => {
    onLike(post.id);
};

  return (
    <View style={[styles.card, isSharedMission && styles.sharedMissionCard]}>
      {/* Optional: Display user info (avatar, name) */}
      {/* <View style={styles.userInfo}>
        <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
        <Text style={styles.userName}>{post.userName}</Text>
      </View> */}

      {isSharedMission && (
        <View style={styles.sharedMissionIndicator}>
          <Text style={styles.sharedMissionText}>Shared a Completed Mission:</Text>
          {post.sharedMission?.sdg && (
            <View style={[styles.sdgInfo, { backgroundColor: post.sharedMission.sdg.colorCode }]}>
              <Image source={{ uri: post.sharedMission.sdg.iconUrl }} style={styles.sdgIcon} />
              <Text style={styles.sdgTitle}>Goal {post.sharedMission.sdg.id}: {post.sharedMission.sdg.title}</Text>
            </View>
          )}
           {post.sharedMission?.title && (
             <Text style={styles.sharedMissionTitle}>{post.sharedMission.title}</Text>
           )}
        </View>
      )}

      <Text style={styles.postContent}>{post.content}</Text>

      {/* Optional: Display image or other media */}

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
          <Heart size={20} color={isLiked ? '#FF6347' : '#666666'} fill={isLiked ? '#FF6347' : 'none'} /> {/* Change color and fill based on liked status */}
          <Text style={styles.likeCount}>{post.likes}</Text>
        </TouchableOpacity>
        {/* Add other actions like comments, share within the app */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  sharedMissionCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#1E90FF', // Example highlight color
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  userName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333333',
  },
  sharedMissionIndicator: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sharedMissionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#1E90FF', // Match highlight color
    marginBottom: 4,
  },
   sharedMissionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333333',
    marginTop: 4,
  },
  sdgInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'flex-start', // To not stretch across the full width
  },
  sdgIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  sdgTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
  },
  postContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Align actions to the right
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4, // Add some padding for easier tapping
  },
  likeCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    // Optionally add styling for liked state color here too
    color: '#666666',
    marginLeft: 4,
  },
});

export default PostCard;