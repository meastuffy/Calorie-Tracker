import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUserMealHistory, getWeeklyCalorieSummary } from '@/services/data';
import { HistoryMealItem } from '@/components/HistoryMealItem';
import { CalorieChart } from '@/components/CalorieChart';
import { formatDate, getDayName } from '@/utils/dateUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [mealHistory, setMealHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, [selectedDate]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const weeklyCalories = await getWeeklyCalorieSummary(selectedDate);
      const meals = await getUserMealHistory(selectedDate);
      
      setWeeklyData(weeklyCalories);
      setMealHistory(meals);
    } catch (error) {
      console.error('Error loading history data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };
  
  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const renderWeekDays = () => {
    const today = new Date();
    const days = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === today.toDateString();
      
      days.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.dayButton,
            isSelected && styles.selectedDay,
          ]}
          onPress={() => handleDateSelect(date)}
        >
          <Text style={[styles.dayName, isSelected && styles.selectedDayText]}>
            {getDayName(date).slice(0, 3)}
          </Text>
          <Text style={[styles.dayNumber, isSelected && styles.selectedDayText, isToday && styles.todayText]}>
            {date.getDate()}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return days;
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nutrition History</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.chartSection}>
          <View style={styles.weekSelector}>
            <TouchableOpacity style={styles.weekNavButton} onPress={handlePreviousWeek}>
              <ChevronLeft size={24} color="#333" />
            </TouchableOpacity>
            
            <Text style={styles.weekTitle}>
              {formatDate(selectedDate)}
            </Text>
            
            <TouchableOpacity 
              style={styles.weekNavButton} 
              onPress={handleNextWeek}
              disabled={selectedDate >= new Date()}
            >
              <ChevronRight size={24} color={selectedDate >= new Date() ? '#ccc' : '#333'} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.calorieChartContainer}>
            {loading ? (
              <ActivityIndicator size="large\" color="#22c55e\" style={styles.loader} />
            ) : (
              <CalorieChart data={weeklyData} width={screenWidth - 48} />
            )}
          </View>
        </View>
        
        <View style={styles.daysContainer}>
          {renderWeekDays()}
        </View>
        
        <View style={styles.mealsContainer}>
          <Text style={styles.mealsTitle}>
            Meals on {formatDate(selectedDate, 'long')}
          </Text>
          
          {loading ? (
            <ActivityIndicator size="small" color="#22c55e" style={styles.mealsLoader} />
          ) : mealHistory.length > 0 ? (
            mealHistory.map((meal, index) => (
              <HistoryMealItem key={index} meal={meal} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No meals logged for this day</Text>
              <TouchableOpacity style={styles.addMealButton}>
                <Text style={styles.addMealButtonText}>Add a meal</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
  chartSection: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  weekSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weekNavButton: {
    padding: 8,
  },
  weekTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  calorieChartContainer: {
    height: 200,
    justifyContent: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dayButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  selectedDay: {
    backgroundColor: '#22c55e',
  },
  dayName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  selectedDayText: {
    color: '#fff',
  },
  todayText: {
    color: '#22c55e',
    fontFamily: 'Inter-Bold',
  },
  mealsContainer: {
    padding: 24,
  },
  mealsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  mealsLoader: {
    marginTop: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 16,
  },
  addMealButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
  },
  addMealButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#22c55e',
  },
});