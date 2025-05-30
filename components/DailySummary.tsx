import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Circle } from 'lucide-react-native';

interface DailySummaryProps {
  calories: number;
  calorieGoal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function DailySummary({ calories, calorieGoal, protein, carbs, fat }: DailySummaryProps) {
  const percentage = Math.min(Math.round((calories / calorieGoal) * 100), 100);
  const remaining = calorieGoal - calories;
  
  return (
    <View style={styles.container}>
      <View style={styles.calorieContainer}>
        <View style={styles.calorieHeader}>
          <Text style={styles.calorieTitle}>Calories</Text>
          <Text style={styles.calorieSubtitle}>Today</Text>
        </View>
        
        <View style={styles.calorieContent}>
          <View style={styles.calorieMeter}>
            <Text style={styles.calorieCount}>{calories}</Text>
            <Text style={styles.calorieGoal}>of {calorieGoal}</Text>
          </View>
          
          <View style={styles.circleProgress}>
            <View style={styles.progressCircle}>
              <View style={styles.progressInner}>
                <Text style={styles.progressText}>{percentage}%</Text>
              </View>
            </View>
          </View>
        </View>
        
        <Text style={styles.calorieRemaining}>
          {remaining > 0 
            ? `${remaining} cal remaining` 
            : 'Daily goal reached'}
        </Text>
      </View>
      
      <View style={styles.macrosContainer}>
        <View style={styles.macroItem}>
          <View style={styles.macroIcon}>
            <Circle size={16} color="#4f46e5" fill="#4f46e5" />
          </View>
          <View>
            <Text style={styles.macroValue}>{protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
        </View>
        
        <View style={styles.macroItem}>
          <View style={styles.macroIcon}>
            <Circle size={16} color="#f59e0b" fill="#f59e0b" />
          </View>
          <View>
            <Text style={styles.macroValue}>{carbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
        </View>
        
        <View style={styles.macroItem}>
          <View style={styles.macroIcon}>
            <Circle size={16} color="#ef4444" fill="#ef4444" />
          </View>
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
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 24,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  calorieContainer: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  calorieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calorieTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  calorieSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  calorieContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calorieMeter: {
    flex: 1,
  },
  calorieCount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#22c55e',
  },
  calorieGoal: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  circleProgress: {
    width: 80,
    height: 80,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#22c55e',
  },
  calorieRemaining: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    marginTop: 16,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroIcon: {
    marginRight: 8,
  },
  macroValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  macroLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
});