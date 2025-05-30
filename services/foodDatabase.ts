import AsyncStorage from '@react-native-async-storage/async-storage';
import { analyzeFoodWithGPT } from './chatgpt';

// Basic food database with common items (as fallback)
const DEFAULT_FOODS: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
  'egg': { calories: 78, protein: 6, carbs: 0.6, fat: 5.3 },
  'boiled egg': { calories: 78, protein: 6, carbs: 0.6, fat: 5.3 },
  'fried egg': { calories: 90, protein: 6.2, carbs: 0.4, fat: 7 },
  'bread': { calories: 75, protein: 2, carbs: 13, fat: 1 },
  'toast': { calories: 75, protein: 2, carbs: 13, fat: 1 },
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  'banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  'apple': { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  'milk': { calories: 60, protein: 3.2, carbs: 4.8, fat: 3.2 },
};

export interface FoodMatch {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity?: number;
}

function extractQuantity(text: string): { quantity: number; foodName: string } {
  const match = text.match(/^(\d+)\s+(.+)$/);
  if (match) {
    return {
      quantity: parseInt(match[1], 10),
      foodName: match[2].toLowerCase().trim()
    };
  }
  return {
    quantity: 1,
    foodName: text.toLowerCase().trim()
  };
}

export async function findFood(text: string): Promise<FoodMatch | null> {
  const { quantity, foodName } = extractQuantity(text);
  
  // First check custom foods
  try {
    const customFoods = await AsyncStorage.getItem('customFoods');
    const customFoodsData = customFoods ? JSON.parse(customFoods) : {};
    
    if (customFoodsData[foodName]) {
      const food = customFoodsData[foodName];
      return {
        name: text,
        calories: food.calories * quantity,
        protein: food.protein * quantity,
        carbs: food.carbs * quantity,
        fat: food.fat * quantity,
        quantity
      };
    }
  } catch (error) {
    console.error('Error reading custom foods:', error);
  }
  
  // Then check default foods
  if (DEFAULT_FOODS[foodName]) {
    const food = DEFAULT_FOODS[foodName];
    return {
      name: text,
      calories: food.calories * quantity,
      protein: food.protein * quantity,
      carbs: food.carbs * quantity,
      fat: food.fat * quantity,
      quantity
    };
  }

  // If not found in database, use ChatGPT
  try {
    const gptResult = await analyzeFoodWithGPT(text);
    if (gptResult) {
      return {
        name: text,
        ...gptResult,
        quantity: 1 // GPT already accounts for quantity in analysis
      };
    }
  } catch (error) {
    console.error('Error getting food data from GPT:', error);
  }
  
  return null;
}

export async function addCustomFood(
  name: string,
  data: { calories: number; protein: number; carbs: number; fat: number }
) {
  try {
    const customFoods = await AsyncStorage.getItem('customFoods');
    const customFoodsData = customFoods ? JSON.parse(customFoods) : {};
    
    customFoodsData[name.toLowerCase()] = data;
    await AsyncStorage.setItem('customFoods', JSON.stringify(customFoodsData));
  } catch (error) {
    console.error('Error saving custom food:', error);
  }
}