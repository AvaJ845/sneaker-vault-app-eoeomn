
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors, typography, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import CollectionManager from '@/components/CollectionManager';
import TagManager from '@/components/TagManager';
import AlertsPanel from '@/components/AlertsPanel';
import { useAlerts } from '@/hooks/useAlerts';

type Tab = 'collections' | 'tags' | 'alerts' | 'tools';

export default function OrganizeScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('collections');
  const { unreadCount } = useAlerts();

  const tabs = [
    { id: 'collections', label: 'Collections', icon: 'folder.fill', androidIcon: 'folder' },
    { id: 'tags', label: 'Tags', icon: 'tag.fill', androidIcon: 'label' },
    { id: 'alerts', label: 'Alerts', icon: 'bell.fill', androidIcon: 'notifications', badge: unreadCount },
    { id: 'tools', label: 'Tools', icon: 'wrench.fill', androidIcon: 'build' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'collections':
        return <CollectionManager />;
      case 'tags':
        return <TagManager />;
      case 'alerts':
        return <AlertsPanel />;
      case 'tools':
        return <ToolsPanel />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Organization</Text>
        <Text style={styles.subtitle}>Manage your collection efficiently</Text>
      </View>

      <View style={styles.tabBar}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tab,
                activeTab === tab.id && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab.id as Tab)}
            >
              <View style={styles.tabIconContainer}>
                <IconSymbol 
                  ios_icon_name={tab.icon} 
                  android_material_icon_name={tab.androidIcon} 
                  size={20} 
                  color={activeTab === tab.id ? colors.primary : colors.textSecondary} 
                />
                {tab.badge && tab.badge > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={[
                styles.tabLabel,
                activeTab === tab.id && styles.tabLabelActive,
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
}

function ToolsPanel() {
  const tools = [
    {
      title: 'Batch Operations',
      description: 'Update multiple items at once',
      icon: 'square.stack.3d.up.fill',
      androidIcon: 'layers',
      color: colors.primary,
      action: () => console.log('Batch operations'),
    },
    {
      title: 'Insurance Report',
      description: 'Generate PDF for insurance',
      icon: 'doc.text.fill',
      androidIcon: 'description',
      color: colors.success,
      action: () => console.log('Insurance report'),
    },
    {
      title: 'Market Intelligence',
      description: 'View price trends and charts',
      icon: 'chart.line.uptrend.xyaxis',
      androidIcon: 'trending_up',
      color: colors.secondary,
      action: () => console.log('Market intelligence'),
    },
    {
      title: 'Trade Manager',
      description: 'Manage trades and swaps',
      icon: 'arrow.left.arrow.right',
      androidIcon: 'swap_horiz',
      color: colors.warning,
      action: () => console.log('Trade manager'),
    },
    {
      title: 'Size Run Tracker',
      description: 'Track complete size runs',
      icon: 'ruler.fill',
      androidIcon: 'straighten',
      color: '#4ECDC4',
      action: () => console.log('Size run tracker'),
    },
    {
      title: 'Business Tools',
      description: 'Tax and reseller features',
      icon: 'briefcase.fill',
      androidIcon: 'work',
      color: '#F7B731',
      action: () => console.log('Business tools'),
    },
    {
      title: 'Social Network',
      description: 'Connect with collectors',
      icon: 'person.3.fill',
      androidIcon: 'people',
      color: '#5F27CD',
      action: () => console.log('Social network'),
    },
    {
      title: 'Advanced Filters',
      description: 'Filter and sort collection',
      icon: 'line.3.horizontal.decrease.circle.fill',
      androidIcon: 'filter_list',
      color: '#00D2D3',
      action: () => console.log('Advanced filters'),
    },
  ];

  return (
    <View style={styles.toolsContainer}>
      <ScrollView 
        style={styles.toolsList}
        contentContainerStyle={styles.toolsListContent}
        showsVerticalScrollIndicator={false}
      >
        {tools.map((tool, index) => (
          <TouchableOpacity
            key={index}
            style={styles.toolCard}
            onPress={tool.action}
          >
            <View style={[styles.toolIcon, { backgroundColor: tool.color + '20' }]}>
              <IconSymbol 
                ios_icon_name={tool.icon} 
                android_material_icon_name={tool.androidIcon} 
                size={28} 
                color={tool.color} 
              />
            </View>
            <View style={styles.toolContent}>
              <Text style={styles.toolTitle}>{tool.title}</Text>
              <Text style={styles.toolDescription}>{tool.description}</Text>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron_right" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.appName,
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.caption,
    fontSize: 14,
  },
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabBarContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabIconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 16,
    alignItems: 'center',
  },
  tabBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  tabLabel: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  toolsContainer: {
    flex: 1,
  },
  toolsList: {
    flex: 1,
  },
  toolsListContent: {
    padding: 16,
  },
  toolCard: {
    ...commonStyles.card,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
  },
  toolIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  toolContent: {
    flex: 1,
  },
  toolTitle: {
    ...typography.username,
    fontSize: 16,
    marginBottom: 4,
  },
  toolDescription: {
    ...typography.caption,
    fontSize: 13,
  },
});
