import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';

export default function WelcomeScreen() {
  const { user } = useAuth();
  
  useEffect(() => {
    // If user is already authenticated, redirect to main app
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#19376D', '#0B2447']}
        style={styles.background}
      />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3760790/pexels-photo-3760790.jpeg' }}
            style={styles.logoImage}
          />
          <Text style={styles.appName}>Impact Steps</Text>
          <Text style={styles.tagline}>Small actions, big impact</Text>
        </View>
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Join the movement to support the UN Sustainable Development Goals through simple daily actions
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.buttonText}>Login</Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.registerButton]}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.buttonText}>Create Account</Text>
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  appName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#E0E0E0',
  },
  descriptionContainer: {
    marginVertical: 40,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
});