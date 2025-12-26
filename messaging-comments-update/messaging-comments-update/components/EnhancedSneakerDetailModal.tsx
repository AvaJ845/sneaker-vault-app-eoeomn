
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import {
  CollectionItem,
  MaintenanceLog,
  ConditionHistory,
  SneakerPhoto,
  AuthenticationDocument,
} from '@/types/collection';

interface EnhancedSneakerDetailModalProps {
  visible: boolean;
  collectionItemId: string | null;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

type TabType = 'overview' | 'tracking' | 'photos' | 'verification' | 'maintenance';

export default function EnhancedSneakerDetailModal({
  visible,
  collectionItemId,
  onClose,
}: EnhancedSneakerDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [collectionItem, setCollectionItem] = useState<any>(null);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [conditionHistory, setConditionHistory] = useState<ConditionHistory[]>([]);
  const [photos, setPhotos] = useState<SneakerPhoto[]>([]);
  const [documents, setDocuments] = useState<AuthenticationDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Tracking form state
  const [wearCount, setWearCount] = useState(0);
  const [storageLocation, setStorageLocation] = useState('');
  const [fitNotes, setFitNotes] = useState('');

  useEffect(() => {
    if (visible && collectionItemId) {
      loadCollectionItem();
    }
  }, [visible, collectionItemId]);

  const loadCollectionItem = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_collections')
        .select(`
          *,
          sneakers (
            id,
            brand,
            model,
            colorway,
            image_url,
            estimated_value,
            retail_price,
            sku,
            release_date,
            category,
            silhouette
          )
        `)
        .eq('id', collectionItemId)
        .single();

      if (error) {
        console.error('Error loading collection item:', error);
        return;
      }

      setCollectionItem(data);
      setWearCount(data.wear_count || 0);
      setStorageLocation(data.storage_location || '');
      setFitNotes(data.fit_notes || '');

      // Load related data
      await Promise.all([
        loadMaintenanceLogs(),
        loadConditionHistory(),
        loadPhotos(),
        loadDocuments(),
      ]);
    } catch (error) {
      console.error('Error loading collection item:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMaintenanceLogs = async () => {
    const { data, error } = await supabase
      .from('maintenance_logs')
      .select('*')
      .eq('collection_item_id', collectionItemId)
      .order('performed_date', { ascending: false });

    if (!error && data) {
      setMaintenanceLogs(data);
    }
  };

  const loadConditionHistory = async () => {
    const { data, error } = await supabase
      .from('condition_history')
      .select('*')
      .eq('collection_item_id', collectionItemId)
      .order('recorded_date', { ascending: false });

    if (!error && data) {
      setConditionHistory(data);
    }
  };

  const loadPhotos = async () => {
    const { data, error } = await supabase
      .from('sneaker_photos')
      .select('*')
      .eq('collection_item_id', collectionItemId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPhotos(data);
    }
  };

  const loadDocuments = async () => {
    const { data, error } = await supabase
      .from('authentication_documents')
      .select('*')
      .eq('collection_item_id', collectionItemId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDocuments(data);
    }
  };

  const updateTracking = async () => {
    try {
      const { error } = await supabase
        .from('user_collections')
        .update({
          wear_count: wearCount,
          storage_location: storageLocation,
          fit_notes: fitNotes,
        })
        .eq('id', collectionItemId);

      if (error) {
        console.error('Error updating tracking:', error);
        Alert.alert('Error', 'Failed to update tracking information');
        return;
      }

      Alert.alert('Success', 'Tracking information updated');
    } catch (error) {
      console.error('Error updating tracking:', error);
      Alert.alert('Error', 'Failed to update tracking information');
    }
  };

  const addPhoto = async (photoType: SneakerPhoto['photo_type']) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to upload photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const image = result.assets[0];
        
        // Upload to Supabase Storage
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const fileExt = image.uri.split('.').pop();
        const fileName = `${user.id}/${collectionItemId}/${Date.now()}.${fileExt}`;
        
        const formData = new FormData();
        formData.append('file', {
          uri: image.uri,
          type: `image/${fileExt}`,
          name: fileName,
        } as any);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('sneaker-photos')
          .upload(fileName, formData);

        if (uploadError) {
          console.error('Error uploading photo:', uploadError);
          Alert.alert('Error', 'Failed to upload photo');
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('sneaker-photos')
          .getPublicUrl(fileName);

        // Save to database
        const { error: dbError } = await supabase.from('sneaker_photos').insert({
          collection_item_id: collectionItemId,
          user_id: user.id,
          photo_url: publicUrl,
          photo_type: photoType,
          is_primary: photos.length === 0,
        });

        if (dbError) {
          console.error('Error saving photo:', dbError);
          Alert.alert('Error', 'Failed to save photo');
          return;
        }

        await loadPhotos();
        Alert.alert('Success', 'Photo added successfully');
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      Alert.alert('Error', 'Failed to add photo');
    }
  };

  const addMaintenanceLog = () => {
    Alert.alert(
      'Add Maintenance Log',
      'Choose maintenance type:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Cleaning', onPress: () => createMaintenanceLog('cleaning') },
        { text: 'Sole Swap', onPress: () => createMaintenanceLog('sole_swap') },
        { text: 'Repair', onPress: () => createMaintenanceLog('repair') },
        { text: 'Restoration', onPress: () => createMaintenanceLog('restoration') },
      ]
    );
  };

  const createMaintenanceLog = async (type: MaintenanceLog['maintenance_type']) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('maintenance_logs').insert({
        collection_item_id: collectionItemId,
        user_id: user.id,
        maintenance_type: type,
        performed_date: new Date().toISOString().split('T')[0],
      });

      if (error) {
        console.error('Error creating maintenance log:', error);
        Alert.alert('Error', 'Failed to create maintenance log');
        return;
      }

      await loadMaintenanceLogs();
      Alert.alert('Success', 'Maintenance log created');
    } catch (error) {
      console.error('Error creating maintenance log:', error);
      Alert.alert('Error', 'Failed to create maintenance log');
    }
  };

  const recordCondition = () => {
    Alert.alert(
      'Record Condition',
      'Choose condition rating:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'DS (Deadstock)', onPress: () => createConditionRecord('DS') },
        { text: 'VNDS (Very Near Deadstock)', onPress: () => createConditionRecord('VNDS') },
        { text: '9/10', onPress: () => createConditionRecord('9/10') },
        { text: '8/10', onPress: () => createConditionRecord('8/10') },
        { text: '7/10', onPress: () => createConditionRecord('7/10') },
      ]
    );
  };

  const createConditionRecord = async (rating: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('condition_history').insert({
        collection_item_id: collectionItemId,
        user_id: user.id,
        condition_rating: rating,
        recorded_date: new Date().toISOString().split('T')[0],
      });

      if (error) {
        console.error('Error recording condition:', error);
        Alert.alert('Error', 'Failed to record condition');
        return;
      }

      await loadConditionHistory();
      Alert.alert('Success', 'Condition recorded');
    } catch (error) {
      console.error('Error recording condition:', error);
      Alert.alert('Error', 'Failed to record condition');
    }
  };

  if (!collectionItem) {
    return null;
  }

  const sneaker = collectionItem.sneakers;
  const gain = sneaker.estimated_value - (collectionItem.cost_basis || collectionItem.purchase_price || 0);
  const roi = collectionItem.cost_basis || collectionItem.purchase_price
    ? ((gain / (collectionItem.cost_basis || collectionItem.purchase_price)) * 100).toFixed(1)
    : '0.0';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol
              ios_icon_name="xmark"
              android_material_icon_name="close"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collection Details</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(['overview', 'tracking', 'photos', 'verification', 'maintenance'] as TabType[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <View>
              <Image source={{ uri: sneaker.image_url }} style={styles.image} />
              <View style={styles.mainInfo}>
                <Text style={styles.brand}>{sneaker.brand}</Text>
                <Text style={styles.model}>{sneaker.model}</Text>
                <Text style={styles.colorway}>{sneaker.colorway}</Text>
              </View>

              <View style={styles.statsCard}>
                <View style={styles.statRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Purchase Price</Text>
                    <Text style={styles.statValue}>${collectionItem.purchase_price}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Current Value</Text>
                    <Text style={[styles.statValue, styles.valuePositive]}>
                      ${sneaker.estimated_value}
                    </Text>
                  </View>
                </View>
                <View style={styles.roiContainer}>
                  <Text style={[styles.roiText, gain >= 0 ? styles.gainPositive : styles.gainNegative]}>
                    {gain >= 0 ? '+' : ''}${Math.abs(gain).toLocaleString()} ({gain >= 0 ? '+' : ''}{roi}%)
                  </Text>
                </View>
              </View>

              <View style={styles.detailsCard}>
                <Text style={styles.cardTitle}>Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Size</Text>
                  <Text style={styles.detailValue}>{collectionItem.size}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Condition</Text>
                  <Text style={styles.detailValue}>{collectionItem.condition}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Purchase Date</Text>
                  <Text style={styles.detailValue}>
                    {new Date(collectionItem.purchase_date).toLocaleDateString()}
                  </Text>
                </View>
                {collectionItem.notes && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Notes</Text>
                    <Text style={styles.detailValue}>{collectionItem.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Tracking Tab */}
          {activeTab === 'tracking' && (
            <View style={styles.tabContent}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Wear Tracking</Text>
                <View style={styles.wearCountContainer}>
                  <TouchableOpacity
                    style={styles.wearButton}
                    onPress={() => setWearCount(Math.max(0, wearCount - 1))}
                  >
                    <IconSymbol
                      ios_icon_name="minus.circle.fill"
                      android_material_icon_name="remove-circle"
                      size={32}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                  <View style={styles.wearCountDisplay}>
                    <Text style={styles.wearCountNumber}>{wearCount}</Text>
                    <Text style={styles.wearCountLabel}>times worn</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.wearButton}
                    onPress={() => setWearCount(wearCount + 1)}
                  >
                    <IconSymbol
                      ios_icon_name="plus.circle.fill"
                      android_material_icon_name="add-circle"
                      size={32}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Storage Location</Text>
                <TextInput
                  style={styles.input}
                  value={storageLocation}
                  onChangeText={setStorageLocation}
                  placeholder="e.g., Box 3, Shelf 2, Storage Unit A"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Fit Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={fitNotes}
                  onChangeText={setFitNotes}
                  placeholder="How do they fit? TTS, runs small, runs large?"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={updateTracking}>
                <Text style={styles.saveButtonText}>Save Tracking Info</Text>
              </TouchableOpacity>

              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Condition History</Text>
                  <TouchableOpacity onPress={recordCondition}>
                    <IconSymbol
                      ios_icon_name="plus.circle.fill"
                      android_material_icon_name="add-circle"
                      size={24}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                {conditionHistory.length === 0 ? (
                  <Text style={styles.emptyText}>No condition records yet</Text>
                ) : (
                  conditionHistory.map((record) => (
                    <View key={record.id} style={styles.historyItem}>
                      <View style={styles.historyDot} />
                      <View style={styles.historyContent}>
                        <Text style={styles.historyRating}>{record.condition_rating}</Text>
                        <Text style={styles.historyDate}>
                          {new Date(record.recorded_date).toLocaleDateString()}
                        </Text>
                        {record.notes && (
                          <Text style={styles.historyNotes}>{record.notes}</Text>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <View style={styles.tabContent}>
              <View style={styles.photoGrid}>
                {(['main', 'side', 'top', 'bottom', 'box', 'receipt', 'uv_light'] as const).map((type) => {
                  const photo = photos.find((p) => p.photo_type === type);
                  return (
                    <TouchableOpacity
                      key={type}
                      style={styles.photoCard}
                      onPress={() => addPhoto(type)}
                    >
                      {photo ? (
                        <Image source={{ uri: photo.photo_url }} style={styles.photoImage} />
                      ) : (
                        <View style={styles.photoPlaceholder}>
                          <IconSymbol
                            ios_icon_name="camera.fill"
                            android_material_icon_name="add-a-photo"
                            size={32}
                            color={colors.textSecondary}
                          />
                        </View>
                      )}
                      <Text style={styles.photoLabel}>
                        {type.replace('_', ' ').toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Verification Tab */}
          {activeTab === 'verification' && (
            <View style={styles.tabContent}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Authentication Documents</Text>
                <Text style={styles.cardSubtitle}>
                  Upload receipts, invoices, and authentication certificates
                </Text>
                {documents.length === 0 ? (
                  <Text style={styles.emptyText}>No documents uploaded yet</Text>
                ) : (
                  documents.map((doc) => (
                    <View key={doc.id} style={styles.documentItem}>
                      <IconSymbol
                        ios_icon_name="doc.fill"
                        android_material_icon_name="description"
                        size={24}
                        color={colors.primary}
                      />
                      <View style={styles.documentInfo}>
                        <Text style={styles.documentType}>
                          {doc.document_type.replace('_', ' ').toUpperCase()}
                        </Text>
                        {doc.issuer && (
                          <Text style={styles.documentIssuer}>Issued by: {doc.issuer}</Text>
                        )}
                      </View>
                    </View>
                  ))
                )}
                <TouchableOpacity style={styles.uploadButton}>
                  <IconSymbol
                    ios_icon_name="plus.circle.fill"
                    android_material_icon_name="add-circle"
                    size={20}
                    color={colors.text}
                  />
                  <Text style={styles.uploadButtonText}>Upload Document</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Blockchain Verification</Text>
                <Text style={styles.cardSubtitle}>
                  Create an NFT certificate on the XRP Ledger
                </Text>
                <TouchableOpacity style={styles.blockchainButton}>
                  <IconSymbol
                    ios_icon_name="checkmark.shield.fill"
                    android_material_icon_name="verified-user"
                    size={20}
                    color={colors.text}
                  />
                  <Text style={styles.blockchainButtonText}>Generate NFT Certificate</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <View style={styles.tabContent}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Maintenance History</Text>
                  <TouchableOpacity onPress={addMaintenanceLog}>
                    <IconSymbol
                      ios_icon_name="plus.circle.fill"
                      android_material_icon_name="add-circle"
                      size={24}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                {maintenanceLogs.length === 0 ? (
                  <Text style={styles.emptyText}>No maintenance logs yet</Text>
                ) : (
                  maintenanceLogs.map((log) => (
                    <View key={log.id} style={styles.maintenanceItem}>
                      <View style={styles.maintenanceDot} />
                      <View style={styles.maintenanceContent}>
                        <Text style={styles.maintenanceType}>
                          {log.maintenance_type.replace('_', ' ').toUpperCase()}
                        </Text>
                        <Text style={styles.maintenanceDate}>
                          {new Date(log.performed_date).toLocaleDateString()}
                        </Text>
                        {log.description && (
                          <Text style={styles.maintenanceDescription}>{log.description}</Text>
                        )}
                        {log.cost && (
                          <Text style={styles.maintenanceCost}>Cost: ${log.cost}</Text>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  placeholder: {
    width: 32,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: width,
    height: width,
    backgroundColor: colors.backgroundSecondary,
  },
  mainInfo: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  brand: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  model: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  colorway: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  valuePositive: {
    color: colors.success,
  },
  roiContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  roiText: {
    fontSize: 18,
    fontWeight: '800',
  },
  gainPositive: {
    color: colors.success,
  },
  gainNegative: {
    color: colors.error,
  },
  detailsCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  tabContent: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  wearCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  wearButton: {
    padding: 8,
  },
  wearCountDisplay: {
    alignItems: 'center',
  },
  wearCountNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.text,
  },
  wearCountLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 4,
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyRating: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  historyDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyNotes: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoCard: {
    width: (width - 64) / 3,
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoImage: {
    width: '100%',
    height: '80%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  photoLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 4,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentType: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  documentIssuer: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  blockchainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  blockchainButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  maintenanceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  maintenanceDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    marginTop: 4,
    marginRight: 12,
  },
  maintenanceContent: {
    flex: 1,
  },
  maintenanceType: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  maintenanceDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  maintenanceDescription: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  maintenanceCost: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
  },
  bottomSpacer: {
    height: 40,
  },
});
