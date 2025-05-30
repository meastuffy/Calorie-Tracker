import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Camera as CameraIcon, Image as ImageIcon, Send, ChevronLeft, X } from 'lucide-react-native';
import { analyzeTextMeal, analyzeImageMeal, logMeal } from '@/services/ai';
import { useRouter } from 'expo-router';
import { MealCamera } from '@/components/MealCamera';
import { NutritionCard } from '@/components/NutritionCard';
import { MealType, AnalyzedMeal } from '@/types';

export default function LogMealScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [mealText, setMealText] = useState('');
  const [cameraMode, setCameraMode] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedMeal, setAnalyzedMeal] = useState<AnalyzedMeal | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handleCameraToggle = () => {
    setCameraMode(!cameraMode);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      handleImageAnalysis(result.assets[0].uri);
    }
  };

  const handleImageAnalysis = async (imageUri: string) => {
    setAnalyzing(true);
    try {
      const result = await analyzeImageMeal(imageUri);
      setAnalyzedMeal(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setAnalyzing(false);
    }
  };
  
  const handleSubmitText = async () => {
    if (!mealText.trim()) return;
    
    setAnalyzing(true);
    try {
      const result = await analyzeTextMeal(mealText);
      setAnalyzedMeal(result);
    } catch (error) {
      console.error('Error analyzing meal:', error);
    } finally {
      setAnalyzing(false);
    }
  };
  
  const handleImageCapture = (imageUri: string) => {
    setCameraMode(false);
    setSelectedImage(imageUri);
    handleImageAnalysis(imageUri);
  };
  
  const handleSaveMeal = async () => {
    if (!analyzedMeal) return;
    
    setSaving(true);
    try {
      await logMeal({
        type: mealType,
        items: analyzedMeal.items,
        totals: analyzedMeal.totals,
        date: new Date().toISOString(),
        image: selectedImage
      });
      
      router.back();
    } catch (error) {
      console.error('Error saving meal:', error);
      setSaving(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setAnalyzedMeal(null);
  };
  
  if (cameraMode) {
    return (
      <MealCamera 
        onCapture={handleImageCapture}
        onClose={handleCameraToggle}
      />
    );
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Meal</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.mealTypeSelector}>
          <TouchableOpacity
            style={[styles.mealTypeButton, mealType === 'breakfast' && styles.selectedMealType]}
            onPress={() => setMealType('breakfast')}
          >
            <Text style={[styles.mealTypeText, mealType === 'breakfast' && styles.selectedMealTypeText]}>
              Breakfast
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mealTypeButton, mealType === 'lunch' && styles.selectedMealType]}
            onPress={() => setMealType('lunch')}
          >
            <Text style={[styles.mealTypeText, mealType === 'lunch' && styles.selectedMealTypeText]}>
              Lunch
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mealTypeButton, mealType === 'dinner' && styles.selectedMealType]}
            onPress={() => setMealType('dinner')}
          >
            <Text style={[styles.mealTypeText, mealType === 'dinner' && styles.selectedMealTypeText]}>
              Dinner
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mealTypeButton, mealType === 'snack' && styles.selectedMealType]}
            onPress={() => setMealType('snack')}
          >
            <Text style={[styles.mealTypeText, mealType === 'snack' && styles.selectedMealTypeText]}>
              Snack
            </Text>
          </TouchableOpacity>
        </View>

        {selectedImage && (
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity style={styles.clearImageButton} onPress={clearImage}>
              <X size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Describe what you ate (e.g., 2 eggs and toast, chicken salad)"
            value={mealText}
            onChangeText={setMealText}
            multiline
            maxLength={200}
          />
          
          <View style={styles.inputActions}>
            <View style={styles.mediaButtons}>
              <TouchableOpacity style={styles.mediaButton} onPress={handleCameraToggle}>
                <CameraIcon size={24} color="#22c55e" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
                <ImageIcon size={24} color="#22c55e" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.analyzeButton, !mealText.trim() && styles.disabledButton]}
              onPress={handleSubmitText}
              disabled={!mealText.trim() || analyzing}
            >
              {analyzing ? (
                <ActivityIndicator size="small\" color="#fff" />
              ) : (
                <>
                  <Send size={20} color="#fff" />
                  <Text style={styles.analyzeButtonText}>Analyze</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {analyzedMeal && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Analysis Result</Text>
            
            <NutritionCard 
              calories={analyzedMeal.totals.calories}
              protein={analyzedMeal.totals.protein}
              carbs={analyzedMeal.totals.carbs}
              fat={analyzedMeal.totals.fat}
            />
            
            <View style={styles.itemsContainer}>
              <Text style={styles.itemsTitle}>Items Detected:</Text>
              {analyzedMeal.items.map((item, index) => (
                <View key={index} style={styles.foodItem}>
                  <Text style={styles.foodItemName}>{item.name}</Text>
                  <Text style={styles.foodItemCalories}>{item.calories} cal</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveMeal}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small\" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Meal</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  mealTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  mealTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  selectedMealType: {
    backgroundColor: '#dcfce7',
  },
  mealTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  selectedMealTypeText: {
    color: '#22c55e',
  },
  selectedImageContainer: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  clearImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  textInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    padding: 8,
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaButton: {
    padding: 8,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  analyzeButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 16,
  },
  itemsContainer: {
    marginTop: 20,
  },
  itemsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginBottom: 12,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  foodItemName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  foodItemCalories: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  saveButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});