import OpenAI from 'openai';
import Constants from 'expo-constants';

const openai = new OpenAI({
  apiKey: Constants.expoConfig?.extra?.OPENAI_API_KEY || 'MISSING_API_KEY',
  dangerouslyAllowBrowser: true
});

// Mock database of common meals for image analysis
const mockImageAnalysis = {
  'breakfast': {
    items: [
      {
        name: "Oatmeal with Berries",
        calories: 350,
        protein: 12,
        carbs: 65,
        fat: 6
      },
      {
        name: "Banana",
        calories: 105,
        protein: 1,
        carbs: 27,
        fat: 0
      }
    ]
  },
  'lunch': {
    items: [
      {
        name: "Grilled Chicken Salad",
        calories: 420,
        protein: 35,
        carbs: 25,
        fat: 22
      },
      {
        name: "Olive Oil Dressing",
        calories: 120,
        protein: 0,
        carbs: 0,
        fat: 14
      }
    ]
  },
  'dinner': {
    items: [
      {
        name: "Salmon Fillet",
        calories: 367,
        protein: 34,
        carbs: 0,
        fat: 24
      },
      {
        name: "Brown Rice",
        calories: 216,
        protein: 5,
        carbs: 45,
        fat: 2
      },
      {
        name: "Steamed Vegetables",
        calories: 75,
        protein: 3,
        carbs: 15,
        fat: 1
      }
    ]
  }
};

export async function analyzeFoodWithGPT(input: { type: 'text' | 'image', content: string }): Promise<{
  items: Array<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
} | null> {
  try {
    if (!Constants.expoConfig?.extra?.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return null;
    }

    // Handle image analysis with mock data
    if (input.type === 'image') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly select a meal type for demonstration
      const mealTypes = ['breakfast', 'lunch', 'dinner'];
      const randomMeal = mockImageAnalysis[mealTypes[Math.floor(Math.random() * mealTypes.length)]];
      
      // Calculate totals
      const totals = randomMeal.items.reduce((acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

      return {
        items: randomMeal.items,
        totals: {
          calories: Math.round(totals.calories),
          protein: Math.round(totals.protein),
          carbs: Math.round(totals.carbs),
          fat: Math.round(totals.fat)
        }
      };
    }

    // Handle text analysis with GPT-3.5-turbo
    const messages = [
      {
        role: "system",
        content: `You are a nutrition expert AI. Analyze the food description and provide detailed nutritional information.
        Return the response in this exact JSON format:
        {
          "items": [
            {
              "name": "Food item name",
              "calories": number,
              "protein": number in grams,
              "carbs": number in grams,
              "fat": number in grams
            }
          ],
          "totals": {
            "calories": total calories,
            "protein": total protein in grams,
            "carbs": total carbs in grams,
            "fat": total fat in grams
          }
        }`
      },
      {
        role: "user",
        content: `Analyze the nutritional content of: ${input.content}`
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Ensure numbers are rounded
    result.items = result.items.map((item: any) => ({
      ...item,
      calories: Math.round(item.calories),
      protein: Math.round(item.protein),
      carbs: Math.round(item.carbs),
      fat: Math.round(item.fat)
    }));

    result.totals = {
      calories: Math.round(result.totals.calories),
      protein: Math.round(result.totals.protein),
      carbs: Math.round(result.totals.carbs),
      fat: Math.round(result.totals.fat)
    };

    return result;
  } catch (error) {
    console.error('Error analyzing food with GPT:', error);
    return null;
  }
}