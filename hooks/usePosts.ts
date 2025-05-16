import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getFirestore, collection, query, orderBy, limit, getDocs, startAfter, doc, updateDoc, arrayUnion, arrayRemove, addDoc, FieldValue, runTransaction, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from '../config/firebase';
import { initializeApp, getApps } from 'firebase/app';

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();

export const usePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const [lastPost, setLastPost] = useState(null);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const POSTS_PER_PAGE = 10; // Adjust as needed

  const fetchPosts = async () => {
    setError(null);
    setIsLoading(true);
    try {
      // Ensure the fetched post data includes the `missionId` field if it exists in the Firestore document.
      const postsCollection = collection(db, 'posts');
      const firstPageQuery = query(postsCollection, orderBy('timestamp', 'desc'), limit(POSTS_PER_PAGE));
      const documentSnapshots = await getDocs(firstPageQuery); // Fetch likeCount here

      const postsData = documentSnapshots.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString(), // Convert timestamp
      }));

      setPosts(postsData);
      setLastPost(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      setHasMorePosts(documentSnapshots.docs.length === POSTS_PER_PAGE);
    } catch (error) {
      setError(error);
      console.error('Error fetching initial posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for initial posts if needed during development
  const INITIAL_POSTS: any[] = [];

  const fetchMorePosts = async () => {
    if (!lastPost || !hasMorePosts || isLoading) return;
    // Ensure the fetched post data includes the `missionId` field if it exists in the Firestore document.

    setError(null);
    setIsLoading(true);
    const nextPageQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), startAfter(lastPost), limit(POSTS_PER_PAGE));
    try {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder createPost function (needs actual implementation if used)
  const createPost = async (postData: { content: string, imageURL?: string, missionId?: string, achievementId?: string }) => {
    setError(null);
    setIsCreatingPost(true); // Start loading for post creation
    try {
      // Add post to Firestore
      const newPost = {
        user: {
          // Ensure user is available from auth context
          id: user!.uid,
          displayName: user.displayName,
          photoURL: user.photoURL
        },
        content: postData.content,
        imageURL: imageURL || null,
        timestamp: new Date().toISOString(),
        likes: [],
        likeCount: 0, // Initialize like count
        missionId: postData.missionId || null, // Add missionId if applicable
        achievementId: postData.achievementId || null, // Add achievementId if applicable
      };

      await addDoc(collection(db, 'posts'), newPost);

      // If missionId or achievementId are provided, include them in the document
      return true;
    } catch (error) {
      setError(error);
      console.error('Error creating post:', error);
      throw error;
    } finally {
      setIsCreatingPost(false); // End loading for post creation
    }
  };

  const likePost = async (postId: string) => {
    if (!user?.uid) return; // Ensure user is logged in

    setError(null);
    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      if (!postDoc.exists()) {
        throw new Error("Post does not exist!");
      }

      const currentLikedBy = postDoc.data().likedBy || [];
      const isLiked = currentLikedBy.includes(userId);

      const batch = writeBatch(db);

      if (isLiked) {
        batch.update(postRef, { likedBy: arrayRemove(userId), likeCount: FieldValue.increment(-1) });
      } else {
        batch.update(postRef, { likedBy: arrayUnion(userId), likeCount: FieldValue.increment(1) });
      }

      await batch.commit();

      // Optimistically update local state to reflect the change immediately
      setPosts(prevPosts => prevPosts.map((post: any) => {
        return post;
      }));
    } catch (error) {
      setError(error);
      console.error('Error liking post:', error);
    }
  };

  return {
    posts,
    fetchPosts,
    fetchMorePosts,
    createPost,
    likePost,
    isLoading,
    isCreatingPost,
    hasMorePosts,
    error,
  };
};