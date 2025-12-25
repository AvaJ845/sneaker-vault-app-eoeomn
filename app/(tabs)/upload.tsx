
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/lib/supabase';

export default function UploadScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [sneakerBrand, setSneakerBrand] = useState('');
  const [sneakerModel, setSneakerModel] = useState('');
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    console.log('Image picker result:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    console.log('Camera result:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadImageToSupabase = async (uri: string): Promise<string> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to upload images');
      }

      // Convert image to blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Generate unique filename
      const fileExt = uri.split('.').pop() || 'jpg';
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('sneaker-images')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('sneaker-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Upload error:', error);
      throw new Error(error.message || 'Failed to upload image');
    }
  };

  const handlePost = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image to post.');
      return;
    }

    if (!caption && !sneakerBrand && !sneakerModel) {
      Alert.alert('Missing Info', 'Please add a caption or sneaker details.');
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Not Logged In', 'You must be logged in to create posts.');
        setUploading(false);
        return;
      }

      // Upload image to Supabase Storage
      console.log('Uploading image...');
      const imageUrl = await uploadImageToSupabase(selectedImage);
      console.log('Image uploaded:', imageUrl);

      // Create post in database
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            image_url: imageUrl,
            caption: caption || null,
          },
        ])
        .select()
        .single();

      if (postError) {
        throw postError;
      }

      console.log('Post created:', post);

      Alert.alert('Success', 'Your post has been shared!', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedImage(null);
            setCaption('');
            setSneakerBrand('');
            setSneakerModel('');
          },
        },
      ]);
    } catch (error: any) {
      console.error('Post error:', error);
      Alert.alert('Error', error.message || 'Failed to create post. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar,
        ]}
      >
        <Text style={styles.title}>Create Post</Text>

        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={20}
            color={colors.secondary}
          />
          <Text style={styles.infoText}>
            Share your sneaker collection with the community! Upload photos from your collection.
          </Text>
        </View>

        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity 
              style={styles.removeButton} 
              onPress={() => setSelectedImage(null)}
              disabled={uploading}
            >
              <IconSymbol 
                ios_icon_name="xmark.circle.fill" 
                android_material_icon_name="cancel" 
                size={32} 
                color={colors.error} 
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <IconSymbol 
                ios_icon_name="photo" 
                android_material_icon_name="photo-library" 
                size={48} 
                color={colors.primary} 
              />
              <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
              <IconSymbol 
                ios_icon_name="camera" 
                android_material_icon_name="camera-alt" 
                size={48} 
                color={colors.primary} 
              />
              <Text style={styles.uploadButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Caption</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Write a caption..."
              placeholderTextColor={colors.textSecondary}
              value={caption}
              onChangeText={setCaption}
              multiline
              numberOfLines={4}
              editable={!uploading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sneaker Brand</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Nike, Adidas, Jordan"
              placeholderTextColor={colors.textSecondary}
              value={sneakerBrand}
              onChangeText={setSneakerBrand}
              editable={!uploading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sneaker Model</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Air Max 90, Yeezy Boost 350"
              placeholderTextColor={colors.textSecondary}
              value={sneakerModel}
              onChangeText={setSneakerModel}
              editable={!uploading}
            />
          </View>

          <TouchableOpacity
            style={[styles.postButton, (!selectedImage || uploading) && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={!selectedImage || uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={colors.card} />
            ) : (
              <Text style={styles.postButtonText}>Share Post</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  uploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  selectedImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  postButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  postButtonDisabled: {
    backgroundColor: colors.border,
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.card,
  },
});
