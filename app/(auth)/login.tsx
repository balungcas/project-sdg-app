import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // Use error and isLoading from the useAuth hook
  const { login, loginWithGoogle, isLoading, error } = useAuth();

  const handleLogin = async () => {
    // Check if already loading to prevent multiple calls
    if (isLoading) return;

    // Clear any previous errors (handled in the hook now)
    // setError('');

    try {
      // Use the login function from useAuth
      await login(email, password);
      // The hook will handle navigation on successful login
    } catch (err) {
      // Error is handled and set in the hook, will be displayed by the component
      console.error('Login failed:', err);
    }
  };

  // Note: Implementing Google Login correctly requires platform-specific setup.
  const handleGoogleLogin = async () => {
    // For demo purposes, automatically "login" without Google auth
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue your impact journey</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#666" style={styles.inputIcon} />
            <TextInput style={styles.input}
              placeholder="Email"
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? (
                <EyeOff size={20} color="#666" />
              ) : (
                <Eye size={20} color="#666" />
              )}
            </TouchableOpacity>
          </View>
          
          {error && <Text style={styles.errorText}>{error.message || 'An unknown error occurred.'}</Text>} {/* Display error message if error state from hook is not null */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => {/* Handle forgot password */}}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading} /* Disable the button while loading */ >
            {isLoading ? (
 <ActivityIndicator color="#FFF" /> /* Display ActivityIndicator when loading */
            ) : (
              // Add loading indicator here if needed, though ActivityIndicator is used
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => router.push('/register')}
            >
              Sign Up
            </Text>
          </Text>
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
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
    marginBottom: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF3B30',
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1E90FF',
  },
  loginButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginHorizontal: 16,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  socialButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#333333',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
  },
  footerLink: {
    fontFamily: 'Inter-Medium',
    color: '#1E90FF',
  },
});