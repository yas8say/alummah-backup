import React, { createContext, useState, useEffect, useContext } from "react";
import * as Notifications from "expo-notifications";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  // Function to send a local notification in the foreground
  const sendLocalNotification = async (title, message) => {
    await Notifications.presentNotificationAsync({
      title: title,
      body: message,
      data: { extraData: "some data" }, // You can pass additional data here if needed
    });
  };

  useEffect(() => {
    const foregroundListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
        const { title, body } = notification.request.content;
        sendLocalNotification(title, body); // Display local notification
      }
    );

    const backgroundListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("User interacted with the notification", response);
      }
    );

    // Register for push notifications (this is usually in another function)
    const registerForPushNotifications = async () => {
      // Your logic for registering push notifications here
    };

    registerForPushNotifications();

    return () => {
      foregroundListener.remove();
      backgroundListener.remove();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, error }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use Notification Context in other components
export const useNotification = () => {
  return useContext(NotificationContext);
};
