import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { getUserProfile, getUserDailySummary } from '@/services/data';
import { DailySummary } from '@/components/DailySummary';
import { MealList } from '@/components/MealList';
import { NutritionProgressBar } from '@/components/NutritionProgressBar';
import { UserProfile, DailyData, Meal } from '@/types';
import { Plus } from 'lucide-react-native';

export default function DashboardScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profileData = await getUserProfile();
      const dailySummary = await getUserDailySummary();
      
      setProfile(profileData);
      setDailyData(dailySummary);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleAddMeal = () => {
    router.push('/log-meal');
  };

  if (loading && !dailyData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your nutrition data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22c55e" />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {profile ? `Hello, ${profile.name}` : 'Hello'}
            </Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {dailyData && (
          <>
            <DailySummary 
              calories={dailyData.totalCalories} 
              calorieGoal={dailyData.calorieGoal}
              protein={dailyData.macros.protein}
              carbs={dailyData.macros.carbs}
              fat={dailyData.macros.fat}
            />
            
            <View style={styles.macrosSection}>
              <Text style={styles.sectionTitle}>Macronutrients</Text>
              <View style={styles.macrosList}>
                <NutritionProgressBar 
                  label="Protein"
                  current={dailyData.macros.protein}
                  goal={dailyData.macroGoals.protein}
                  color="#4f46e5"
                />
                <NutritionProgressBar 
                  label="Carbs"
                  current={dailyData.macros.carbs}
                  goal={dailyData.macroGoals.carbs}
                  color="#f59e0b"
                />
                <NutritionProgressBar 
                  label="Fat"
                  current={dailyData.macros.fat}
                  goal={dailyData.macroGoals.fat}
                  color="#ef4444"
                />
              </View>
            </View>
            
            <View style={styles.mealsSection}>
              <Text style={styles.sectionTitle}>Today's Meals</Text>
              <MealList meals={dailyData.meals} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  macrosSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  macrosList: {
    gap: 16,
  },
  mealsSection: {
    padding: 24,
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
});