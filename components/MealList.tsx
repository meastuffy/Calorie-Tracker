import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Meal } from '@/types';
import { ChevronRight } from 'lucide-react-native';

interface MealListProps {
  meals: Meal[];
}

export function MealList({ meals }: MealListProps) {
  if (meals.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No meals logged today</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Meal</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const getMealIcon = (type: string) => {
    const icons: Record<string, string> = {
      breakfast: '🍳',
      lunch: '🥗',
      dinner: '🍲',
      snack: '🍎',
    };
    
    return icons[type] || '🍽';
  };
  
  return (
    <View style={styles.container}>
      {meals.map((meal, index) => (
        <TouchableOpacity key={index} style={styles.mealItem}>
          <View style={styles.mealInfo}>
            <Text style={styles.mealIcon}>{getMealIcon(meal.type)}</Text>
            <View>
              <Text style={styles.mealType}>
                {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
              </Text>
              <Text style={styles.mealTime}>
                {new Date(meal.date).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          </View>
          
          <View style={styles.mealCalories}>
            <Text style={styles.caloriesText}>{meal.totals.calories} cal</Text>
            <ChevronRight size={16} color="#9ca3af" />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  mealType: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  mealTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  mealCalories: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginRight: 8,
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 16,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#22c55e',
  },
});