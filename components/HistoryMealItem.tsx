import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, Platform } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Meal } from '@/types';
import { findFood } from '@/services/foodDatabase';
import debounce from 'lodash/debounce';

interface SubMealInput {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

interface HistoryMealItemProps {
  meal: Meal;
  onUpdateMeal?: (updatedMeal: Meal) => void;
}

function sumItems(items: any[]) {
  return items.reduce(
    (acc, item) => ({
      calories: acc.calories + (Number(item.calories) || 0),
      protein: acc.protein + (Number(item.protein) || 0),
      carbs: acc.carbs + (Number(item.carbs) || 0),
      fat: acc.fat + (Number(item.fat) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function HistoryMealItem({ meal, onUpdateMeal }: HistoryMealItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [subMeals, setSubMeals] = useState<SubMealInput[]>([
    { name: '', calories: '', protein: '', carbs: '', fat: '' },
  ]);

  // Debounced food lookup
  const debouncedFoodLookup = debounce(async (text: string, index: number) => {
    if (!text.trim()) return;
    
    const foodMatch = await findFood(text);
    if (foodMatch) {
      setSubMeals(prev => prev.map((meal, i) => 
        i === index ? {
          name: text,
          calories: foodMatch.calories.toString(),
          protein: foodMatch.protein.toString(),
          carbs: foodMatch.carbs.toString(),
          fat: foodMatch.fat.toString(),
        } : meal
      ));
    }
  }, 500);

  useEffect(() => {
    return () => {
      debouncedFoodLookup.cancel();
    };
  }, []);

  // Calculate totals from all items
  const totals = sumItems(meal.items);

  const handleExpand = () => {
    setExpanded((prev) => !prev);
    if (!expanded) {
      setSubMeals([{ name: '', calories: '', protein: '', carbs: '', fat: '' }]);
    }
  };

  const handleSubMealChange = (idx: number, field: keyof SubMealInput, value: string) => {
    setSubMeals((prev) =>
      prev.map((sub, i) => {
        if (i === idx) {
          const updated = { ...sub, [field]: value };
          if (field === 'name') {
            debouncedFoodLookup(value, idx);
          }
          return updated;
        }
        return sub;
      })
    );
  };

  const handleAddSubMeal = () => {
    setSubMeals((prev) => [
      ...prev,
      { name: '', calories: '', protein: '', carbs: '', fat: '' },
    ]);
  };

  const handleRemoveSubMeal = (idx: number) => {
    setSubMeals((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    // Filter out empty sub-meals
    const validSubMeals = subMeals.filter(
      (sub) =>
        sub.name.trim() ||
        sub.calories.trim() ||
        sub.protein.trim() ||
        sub.carbs.trim() ||
        sub.fat.trim()
    );

    if (validSubMeals.length === 0) {
      setExpanded(false);
      return;
    }

    const newItems = validSubMeals.map((sub) => ({
      name: sub.name || 'Manual Entry',
      calories: Number(sub.calories) || 0,
      protein: Number(sub.protein) || 0,
      carbs: Number(sub.carbs) || 0,
      fat: Number(sub.fat) || 0,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
    }));

    const updatedItems = [...meal.items, ...newItems];
    const updatedTotals = sumItems(updatedItems);

    const updatedMeal: Meal = {
      ...meal,
      totals: updatedTotals,
      items: updatedItems,
    };

    if (onUpdateMeal) {
      onUpdateMeal(updatedMeal);
    }

    setExpanded(false);
    Keyboard.dismiss();
  };

  const getMealIcon = (type: string) => {
    const icons: Record<string, string> = {
      breakfast: '🍳',
      lunch: '🥗',
      dinner: '🍲',
      snack: '🍎',
    };
    return icons[type] || '🍽';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity 
        style={styles.container} 
        activeOpacity={0.8} 
        onPress={handleExpand}
        accessibilityHint={Platform.OS === 'web' ? undefined : 'Toggle meal details'}
      >
        <View style={styles.header}>
          <View style={styles.mealInfo}>
            <Text style={styles.mealIcon}>{getMealIcon(meal.type)}</Text>
            <Text style={styles.mealType}>
              {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(meal.date)}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.calorieContainer}>
            <Text style={styles.calorieValue}>{totals.calories}</Text>
            <Text style={styles.calorieLabel}>calories</Text>
          </View>
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totals.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totals.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{totals.fat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.itemsText}>
            {meal.items.length} {meal.items.length === 1 ? 'item' : 'items'}
          </Text>
          <ChevronRight size={16} color="#9ca3af" />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Manual Meal Entry</Text>
          {subMeals.map((sub, idx) => (
            <View key={idx} style={{ marginBottom: 12 }}>
              <TextInput
                style={styles.input}
                placeholder="Meal Name"
                value={sub.name}
                onChangeText={(v) => handleSubMealChange(idx, 'name', v)}
                returnKeyType="done"
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.inputSmall]}
                  placeholder="Calories"
                  value={sub.calories}
                  onChangeText={(v) => handleSubMealChange(idx, 'calories', v)}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
                <TextInput
                  style={[styles.input, styles.inputSmall]}
                  placeholder="Protein"
                  value={sub.protein}
                  onChangeText={(v) => handleSubMealChange(idx, 'protein', v)}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.inputSmall]}
                  placeholder="Carbs"
                  value={sub.carbs}
                  onChangeText={(v) => handleSubMealChange(idx, 'carbs', v)}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
                <TextInput
                  style={[styles.input, styles.inputSmall]}
                  placeholder="Fat"
                  value={sub.fat}
                  onChangeText={(v) => handleSubMealChange(idx, 'fat', v)}
                  keyboardType="numeric"
                  returnKeyType="done"
                />
              </View>
              {subMeals.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveSubMeal(idx)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={handleAddSubMeal}>
            <Text style={styles.addButtonText}>+ Add Another</Text>
          </TouchableOpacity>
          <View style={styles.formButtonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setExpanded(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 16,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  mealType: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  timeContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  calorieContainer: {
    alignItems: 'center',
    marginRight: 24,
  },
  calorieValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#22c55e',
  },
  calorieLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  macrosContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
  },
  itemsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  formContainer: {
    backgroundColor: '#f9fafb',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  formTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    color: '#333',
    flex: 1,
  },
  inputSmall: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  formButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#333',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  addButtonText: {
    color: '#22c55e',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  removeButtonText: {
    color: '#dc2626',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
});