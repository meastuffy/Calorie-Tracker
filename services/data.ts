import { Meal, DailyData, UserProfile } from '@/types';
import { getCurrentUser } from './auth';

// Mock user profile data
export async function getUserProfile(): Promise<UserProfile> {
  const user = getCurrentUser();
  
  // If no user is signed in, return demo data
  if (!user) {
    return {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      settings: {
        darkMode: false,
        notifications: true,
        units: 'metric',
      }
    };
  }
  
  return user;
}

// Mock daily summary data
export async function getUserDailySummary(): Promise<DailyData> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    date: new Date().toISOString(),
    totalCalories: 1450,
    calorieGoal: 2000,
    macros: {
      protein: 85,
      carbs: 160,
      fat: 55
    },
    macroGoals: {
      protein: 120,
      carbs: 200,
      fat: 70
    },
    meals: [
      {
        id: '1',
        type: 'breakfast',
        date: new Date(new Date().setHours(8, 30)).toISOString(),
        items: [
          { name: 'Oatmeal with Berries', calories: 320, protein: 12, carbs: 58, fat: 6 }
        ],
        totals: {
          calories: 320,
          protein: 12,
          carbs: 58,
          fat: 6
        }
      },
      {
        id: '2',
        type: 'lunch',
        date: new Date(new Date().setHours(13, 15)).toISOString(),
        items: [
          { name: 'Chicken Salad', calories: 480, protein: 45, carbs: 25, fat: 22 }
        ],
        totals: {
          calories: 480,
          protein: 45,
          carbs: 25,
          fat: 22
        }
      },
      {
        id: '3',
        type: 'snack',
        date: new Date(new Date().setHours(16, 0)).toISOString(),
        items: [
          { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
          { name: 'Greek Yogurt', calories: 130, protein: 15, carbs: 6, fat: 4 }
        ],
        totals: {
          calories: 225,
          protein: 15.5,
          carbs: 31,
          fat: 4.3
        }
      },
      {
        id: '4',
        type: 'dinner',
        date: new Date(new Date().setHours(19, 30)).toISOString(),
        items: [
          { name: 'Salmon with Vegetables', calories: 425, protein: 38, carbs: 20, fat: 22 }
        ],
        totals: {
          calories: 425,
          protein: 38,
          carbs: 20,
          fat: 22
        }
      }
    ]
  };
}

// Mock meal history data
export async function getUserMealHistory(date: Date): Promise<Meal[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const isToday = date.toDateString() === new Date().toDateString();
  
  // For demo purposes, return meals only for today and yesterday
  if (isToday) {
    // Return today's meals from daily summary
    const dailySummary = await getUserDailySummary();
    return dailySummary.meals;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === yesterday.toDateString()) {
    // Return mock data for yesterday
    return [
      {
        id: '5',
        type: 'breakfast',
        date: new Date(yesterday.setHours(7, 45)).toISOString(),
        items: [
          { name: 'Avocado Toast', calories: 380, protein: 15, carbs: 35, fat: 20 }
        ],
        totals: {
          calories: 380,
          protein: 15,
          carbs: 35,
          fat: 20
        }
      },
      {
        id: '6',
        type: 'lunch',
        date: new Date(yesterday.setHours(12, 30)).toISOString(),
        items: [
          { name: 'Quinoa Bowl', calories: 520, protein: 22, carbs: 68, fat: 18 }
        ],
        totals: {
          calories: 520,
          protein: 22,
          carbs: 68,
          fat: 18
        }
      },
      {
        id: '7',
        type: 'dinner',
        date: new Date(yesterday.setHours(19, 0)).toISOString(),
        items: [
          { name: 'Pasta with Tomato Sauce', calories: 560, protein: 18, carbs: 92, fat: 12 }
        ],
        totals: {
          calories: 560,
          protein: 18,
          carbs: 92,
          fat: 12
        }
      }
    ];
  }
  
  // Return empty array for other days
  return [];
}

// Mock weekly calorie summary data
export async function getWeeklyCalorieSummary(date: Date): Promise<any[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const today = new Date();
  const dayOfWeek = date.getDay();
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - dayOfWeek);
  
  const calorieSummary = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    
    // Generate realistic data based on date
    const isFuture = currentDate > today;
    const isToday = currentDate.toDateString() === today.toDateString();
    const calorieGoal = 2000;
    
    // Random calories between 1500-2200 for past days, today's actual value, nothing for future
    let calories;
    if (isFuture) {
      calories = 0; // No data for future days
    } else if (isToday) {
      calories = 1450; // Today's value from daily summary
    } else {
      // Random value for past days, weekend days tend to be higher
      const isWeekend = i === 0 || i === 6;
      const base = isWeekend ? 1900 : 1700;
      const variation = Math.floor(Math.random() * 400) - 200; // -200 to +200
      calories = base + variation;
    }
    
    calorieSummary.push({
      day: dayNames[i],
      calories: isFuture ? 0 : calories,
      goal: calorieGoal
    });
  }
  
  return calorieSummary;
}

// Save a meal
export async function saveMeal(meal: Meal): Promise<void> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would save to Firebase or another backend
  console.log('Meal saved:', meal);
}