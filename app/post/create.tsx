import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Platform, ScrollView, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { useMissions } from '@/hooks/useMissions';
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react-native';

export default function CreatePostScreen() {
  const { user } = useAuth();
  const { createPost, isLoading, error } = usePosts();
  const { getMissionById, isLoading: missionsLoading, error: missionsError } = useMissions();
  const { missionId } = useLocalSearchParams();
  
  const [content, setContent] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [mission, setMission] = useState(null);

  useEffect(() => {
    if (missionId) {
      // Find the mission from the daily or weekly missions
      const foundMission = getMissionById(missionId as string, 'daily'); // Assuming daily or weekly, might need refinement
      setMission(foundMission);
      
      // Pre-populate the post content if a mission is selected
      if (foundMission && !content) { // Only pre-fill if content is empty
        // Added a check for content being empty so user edits aren't overwritten
        // Also added a more descriptive pre-fill message
        // Consider adding the mission description or impact here if it makes sense
        setContent(`I just completed the "${foundMission.title}" mission for ${foundMission.sdg?.title || 'SDG'}! 🌱 #ImpactSteps #SDG${foundMission.sdg?.id || ''}`);
      }
    }
  }, [missionId, getMissionById]);

  const handleImageAdd = () => {
    // In a real app, this would use expo-image-picker
    // For now, we'll just use a placeholder image
    setImageURL('https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg');
  };

  const handleRemoveImage = () => {
    setImageURL('');
  };

  const handlePost = async () => {
    try {
      await createPost({
        content,
        imageURL,
        mission: mission ? {
          id: mission.id,
          title: mission.title,
          sdg: mission.sdg ? {
            id: mission.sdg.id,
            title: mission.sdg.title,
            colorCode: mission.sdg.colorCode
          } : null
        } : null
        // Add achievementId here if you implement achievement sharing
      });
        // Clear input fields on success
        setContent('');
        setImageURL('');
      Alert.alert(
        "Success",
        "Your post has been shared with the community!",
        [
          { 
            text: "OK", 
            onPress: () => router.replace('/community')
          }
        ]
      );
    } catch (e) {
      // Error is handled and set in usePosts, can show a generic alert or rely on the displayed error message
      Alert.alert("Error", "Failed to create post. Please check the error message below or try again.");
    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity
            style={[
              styles.postButton,
              (!content.trim() && !imageURL) && styles.postButtonDisabled
            ]}
            onPress={handlePost}
            disabled={isLoading || (!content.trim() && !imageURL) || !user} // Disable if loading, empty, or no user
          >
            <Text style={[
              styles.postButtonText,
              (!content.trim() && !imageURL) && styles.postButtonTextDisabled
            ]}>
              {isLoading ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.userInfoContainer}>
          <Image
            source={{ uri: user?.photoURL || 'https://images.pexels.com/photos/5212650/pexels-photo-5212650.jpeg' }}
            style={styles.userAvatar}
          />
          <Text style={styles.userName}>{user?.displayName}</Text>
        </View>
        
        {missionsLoading && (
          <View style={styles.missionLoadErrorContainer}>
            <ActivityIndicator size="small" color="#1E90FF" />
            <Text style={styles.missionLoadErrorText}>Loading mission details...</Text>
          </View>
        )}

        {missionsError && (
          <View style={styles.missionLoadErrorContainer}>
            <Text style={styles.missionLoadErrorText}>Error loading mission: {missionsError.message}</Text>
          </View>
        )}
        {!missionsLoading && !missionsError && mission && (
          // Display some mission details when sharing a mission
          <View style={styles.missionBanner}>
            <View 
              style={[
                styles.missionBadge, 
                { backgroundColor: mission.sdg?.colorCode || '#1E90FF' }
              ]}
            >
              <Text style={styles.missionBadgeText}>Goal {mission.sdg?.id || '?'}</Text>
            </View>
            <Text style={styles.missionTitle}>
              Sharing Completed Mission: {mission.title}
            </Text>
            {/* Optionally display mission description or impact */}
          </View>

        )}

        {/* Display error message if creating post failed */}
        {error && (
          <Text style={[
            styles.errorMessage,
            // Add specific styling for post creation error if needed
            ]}>
            {error.message || 'An error occurred while creating the post.'}
          </Text>
        )}

        {/* Input field for post content */}
        <TextInput
          style={styles.contentInput}
          placeholder="Share your thoughts or achievement..."
          placeholderTextColor="#999"
          multiline
          value={content}
          onChangeText={setContent}
        />      
        
        {imageURL ? (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: imageURL }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={handleRemoveImage}
            >
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : null}
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={handleImageAdd}
          >
            <ImageIcon size={20} color="#1E90FF" />
            <Text style={styles.addImageText}>Add Photo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  missionLoadErrorContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  missionLoadErrorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  errorMessage: {
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333333',
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E90FF',
  },
  postButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  postButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  postButtonTextDisabled: {
    color: '#A0A0A0',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333333',
  },
  missionBanner: {
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
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
  contentInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  imagePreviewContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    marginTop: 8,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addImageText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E90FF',
    marginLeft: 8,
  },
});