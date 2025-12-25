
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, typography, commonStyles } from '@/styles/commonStyles';
import { useAlerts } from '@/hooks/useAlerts';
import { IconSymbol } from './IconSymbol';

export default function AlertsPanel() {
  const { alerts, unreadCount, loading, markAsRead, markAllAsRead, deleteAlert } = useAlerts();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price_drop':
        return { ios: 'arrow.down.circle.fill', android: 'trending_down' };
      case 'new_release':
        return { ios: 'sparkles', android: 'new_releases' };
      case 'milestone':
        return { ios: 'trophy.fill', android: 'emoji_events' };
      case 'trade_offer':
        return { ios: 'arrow.left.arrow.right', android: 'swap_horiz' };
      case 'maintenance_due':
        return { ios: 'wrench.fill', android: 'build' };
      default:
        return { ios: 'bell.fill', android: 'notifications' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return colors.error;
      case 'high':
        return colors.warning;
      case 'normal':
        return colors.primary;
      case 'low':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Alerts</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllButton}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.alertList} showsVerticalScrollIndicator={false}>
        {alerts.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol ios_icon_name="bell.slash" android_material_icon_name="notifications_off" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No alerts yet</Text>
            <Text style={styles.emptySubtext}>We&apos;ll notify you about important updates</Text>
          </View>
        ) : (
          alerts.map((alert, index) => {
            const icon = getAlertIcon(alert.alert_type);
            const priorityColor = getPriorityColor(alert.priority);

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.alertCard,
                  !alert.is_read && styles.alertCardUnread,
                ]}
                onPress={() => !alert.is_read && markAsRead(alert.id)}
              >
                <View style={[styles.alertIcon, { backgroundColor: priorityColor + '20' }]}>
                  <IconSymbol 
                    ios_icon_name={icon.ios} 
                    android_material_icon_name={icon.android} 
                    size={24} 
                    color={priorityColor} 
                  />
                </View>
                <View style={styles.alertContent}>
                  <View style={styles.alertHeader}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <TouchableOpacity onPress={() => deleteAlert(alert.id)}>
                      <IconSymbol ios_icon_name="xmark" android_material_icon_name="close" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  {alert.message && (
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                  )}
                  <Text style={styles.alertTime}>{formatTime(alert.created_at)}</Text>
                </View>
                {!alert.is_read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    ...typography.username,
    fontSize: 24,
  },
  badge: {
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  markAllButton: {
    ...typography.username,
    fontSize: 14,
    color: colors.primary,
  },
  alertList: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    ...typography.username,
    fontSize: 18,
    marginTop: 16,
  },
  emptySubtext: {
    ...typography.caption,
    marginTop: 8,
  },
  alertCard: {
    ...commonStyles.card,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    position: 'relative',
  },
  alertCardUnread: {
    backgroundColor: colors.cardElevated,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  alertIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  alertTitle: {
    ...typography.username,
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  alertMessage: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  alertTime: {
    ...typography.caption,
    fontSize: 12,
  },
  unreadDot: {
    position: 'absolute',
    top: 20,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
