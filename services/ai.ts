import { AnalyzedMeal, Meal } from '@/types';
import { analyzeFoodWithGPT } from './chatgpt';

export async function analyzeTextMeal(text: string): Promise<AnalyzedMeal> {
  try {
    const result = await analyzeFoodWithGPT({ type: 'text', content: text });
    
    if (!result) {
      throw new Error('Failed to analyze meal');
    }

    return {
      items: result.items,
      totals: result.totals
    };
  } catch (error) {
    console.error('Error analyzing text meal:', error);
    throw error;
  }
}

export async function analyzeImageMeal(imageUri: string): Promise<AnalyzedMeal> {
  try {
    const result = await analyzeFoodWithGPT({ type: 'image', content: imageUri });
    
    if (!result) {
      throw new Error('Failed to analyze meal image');
    }

    return {
      items: result.items,
      totals: result.totals
    };
  } catch (error) {
    console.error('Error analyzing image meal:', error);
    throw error;
  }
}

export async function logMeal(meal: Meal): Promise<void> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would save to a database
  console.log('Meal logged:', meal);
}