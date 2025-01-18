import { useEffect, useCallback } from 'react';
import { usePlankStore } from '../store/plank-store';

export const useNotifications = () => {
  const { 
    reminderSettings, 
    updateReminderSettings,
    requestNotificationPermission,
    stats 
  } = usePlankStore();

  // Check if browser supports notifications
  const isSupported = 'Notification' in window;

  // Setup notification scheduling
  useEffect(() => {
    if (!isSupported || !reminderSettings.enabled || !reminderSettings.notificationsPermission) {
      return;
    }

    const scheduleNotification = () => {
      const now = new Date();
      const [hours, minutes] = reminderSettings.time.split(':').map(Number);
      const scheduledTime = new Date(now);
      scheduledTime.setHours(hours, minutes, 0, 0);

      // If the time has passed today, schedule for tomorrow
      if (now > scheduledTime) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime.getTime() - now.getTime();

      return setTimeout(() => {
        const notification = new Notification('Time for Your Plank!', {
          body: `Current streak: ${stats.currentStreak} days. Let's keep it going!`,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: 'plank-reminder',          
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Schedule next notification
        scheduleNotification();
      }, timeUntilNotification);
    };

    const timeoutId = scheduleNotification();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    isSupported,
    reminderSettings.enabled,
    reminderSettings.notificationsPermission,
    reminderSettings.time,
    stats.currentStreak
  ]);

  const setupNotifications = useCallback(async () => {
    if (!isSupported) {
      return false;
    }

    await requestNotificationPermission();
    return Notification.permission === 'granted';
  }, [requestNotificationPermission]);

  return {
    isSupported,
    isEnabled: reminderSettings.enabled,
    notificationsPermission: reminderSettings.notificationsPermission,
    reminderTime: reminderSettings.time,
    setupNotifications,
    updateSettings: updateReminderSettings
  };
};
