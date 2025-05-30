import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUserProfile, updateUserSettings, signOut } from '@/services/auth';
import { useRouter } from 'expo-router';
import { Moon, Bell, User, Goal, Scale, Dumbbell, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isMetric, setIsMetric] = useState(true);
  
  useEffect(() => {
    loadProfile();
  }, []);
  
  const loadProfile = async () => {
    try {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
      
      // Set initial settings
      if (userProfile.settings) {
        setDarkMode(userProfile.settings.darkMode || false);
        setNotifications(userProfile.settings.notifications !== false);
        setIsMetric(userProfile.settings.units === 'metric');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };
  
  const handleToggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    await updateSettings({ darkMode: value });
  };
  
  const handleToggleNotifications = async (value: boolean) => {
    setNotifications(value);
    await updateSettings({ notifications: value });
  };
  
  const handleToggleUnits = async (value: boolean) => {
    setIsMetric(value);
    await updateSettings({ units: value ? 'metric' : 'imperial' });
  };
  
  const updateSettings = async (settings: any) => {
    try {
      await updateUserSettings(settings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };
  
  const handleSignOut = async () => {
    if (Platform.OS === 'web') {
      await signOut();
      router.replace('/login');
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Sign Out', 
            style: 'destructive',
            onPress: async () => {
              await signOut();
              router.replace('/login');
            }
          }
        ]
      );
    }
  };
  
  const navigateToScreen = (screen: string) => {
    // In a real app, this would navigate to the respective screen
    console.log(`Navigate to ${screen}`);
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {profile && (
          <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
              <View style={styles.profileInitial}>
                <Text style={styles.initialText}>
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
              
              <View>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileEmail}>{profile.email}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => navigateToScreen('profile')}
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Moon size={20} color="#64748b" />
              </View>
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: '#d1d5db', true: '#dcfce7' }}
              thumbColor={darkMode ? '#22c55e' : '#f4f4f5'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Bell size={20} color="#64748b" />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#d1d5db', true: '#dcfce7' }}
              thumbColor={notifications ? '#22c55e' : '#f4f4f5'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Scale size={20} color="#64748b" />
              </View>
              <Text style={styles.settingText}>Use Metric Units</Text>
            </View>
            <Switch
              value={isMetric}
              onValueChange={handleToggleUnits}
              trackColor={{ false: '#d1d5db', true: '#dcfce7' }}
              thumbColor={isMetric ? '#22c55e' : '#f4f4f5'}
            />
          </View>
        </View>
        
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>Nutrition</Text>
          
          <TouchableOpacity 
            style={styles.navigationItem}
            onPress={() => navigateToScreen('goals')}
          >
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Goal size={20} color="#64748b" />
              </View>
              <Text style={styles.settingText}>Nutrition Goals</Text>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navigationItem}
            onPress={() => navigateToScreen('activity')}
          >
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <Dumbbell size={20} color="#64748b" />
              </View>
              <Text style={styles.settingText}>Activity Level</Text>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.navigationItem}
            onPress={() => navigateToScreen('help')}
          >
            <View style={styles.settingInfo}>
              <View style={styles.settingIconContainer}>
                <HelpCircle size={20} color="#64748b" />
              </View>
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>NutriTrack AI v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInitial: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  initialText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#22c55e',
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  editProfileButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  editProfileText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  settingsGroup: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  groupTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  navigationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    marginHorizontal: 24,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginBottom: 24,
  },
});