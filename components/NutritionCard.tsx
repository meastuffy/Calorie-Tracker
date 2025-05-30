import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NutritionCardProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function NutritionCard({ calories, protein, carbs, fat }: NutritionCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.calorieSection}>
        <Text style={styles.calorieValue}>{calories}</Text>
        <Text style={styles.calorieLabel}>calories</Text>
      </View>
      
      <View style={styles.macrosSection}>
        <View style={styles.macroItem}>
          <View style={[styles.macroIndicator, styles.proteinIndicator]} />
          <View>
            <Text style={styles.macroValue}>{protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
        </View>
        
        <View style={styles.macroItem}>
          <View style={[styles.macroIndicator, styles.carbsIndicator]} />
          <View>
            <Text style={styles.macroValue}>{carbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
        </View>
        
        <View style={styles.macroItem}>
          <View style={[styles.macroIndicator, styles.fatIndicator]} />
          <View>
            <Text style={styles.macroValue}>{fat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    overflow: 'hidden',
  },
  calorieSection: {
    backgroundColor: '#dcfce7',
    padding: 16,
    alignItems: 'center',
  },
  calorieValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#22c55e',
  },
  calorieLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#064e3b',
    textTransform: 'uppercase',
  },
  macrosSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  proteinIndicator: {
    backgroundColor: '#4f46e5',
  },
  carbsIndicator: {
    backgroundColor: '#f59e0b',
  },
  fatIndicator: {
    backgroundColor: '#ef4444',
  },
  macroValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  macroLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
});