// Example: Sending Push Notifications with Firebase Admin SDK
// This is a Node.js server example for sending push notifications

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Download your service account key from Firebase Console > Project Settings > Service Accounts
const serviceAccount = require('./path/to/your/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Function to send notification to a specific user
async function sendNotificationToUser(fcmToken, title, body, data = {}) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    data: {
      // Custom data payload
      ...data,
      timestamp: Date.now().toString(),
    },
    token: fcmToken,
    webpush: {
      notification: {
        icon: '/PUE_logo.png',
        badge: '/PUE_logo.png',
        requireInteraction: true,
        actions: [
          {
            action: 'open',
            title: 'Open App',
            icon: '/PUE_logo.png'
          },
          {
            action: 'close',
            title: 'Close',
            icon: '/PUE_logo.png'
          }
        ]
      }
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return { success: true, messageId: response };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: error.message };
  }
}

// Function to send notification to multiple users
async function sendNotificationToMultipleUsers(fcmTokens, title, body, data = {}) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    data: {
      ...data,
      timestamp: Date.now().toString(),
    },
    tokens: fcmTokens,
    webpush: {
      notification: {
        icon: '/PUE_logo.png',
        badge: '/PUE_logo.png',
        requireInteraction: true,
        actions: [
          {
            action: 'open',
            title: 'Open App',
            icon: '/PUE_logo.png'
          },
          {
            action: 'close',
            title: 'Close',
            icon: '/PUE_logo.png'
          }
        ]
      }
    }
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log('Successfully sent messages:', response);
    return { 
      success: true, 
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses
    };
  } catch (error) {
    console.error('Error sending messages:', error);
    return { success: false, error: error.message };
  }
}

// Function to send notification to all users in a topic
async function sendNotificationToTopic(topic, title, body, data = {}) {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    data: {
      ...data,
      timestamp: Date.now().toString(),
    },
    topic: topic,
    webpush: {
      notification: {
        icon: '/PUE_logo.png',
        badge: '/PUE_logo.png',
        requireInteraction: true,
        actions: [
          {
            action: 'open',
            title: 'Open App',
            icon: '/PUE_logo.png'
          },
          {
            action: 'close',
            title: 'Close',
            icon: '/PUE_logo.png'
          }
        ]
      }
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message to topic:', response);
    return { success: true, messageId: response };
  } catch (error) {
    console.error('Error sending message to topic:', error);
    return { success: false, error: error.message };
  }
}

// Example usage
async function exampleUsage() {
  // Example 1: Send to a specific user
  const userToken = 'user_fcm_token_here';
  await sendNotificationToUser(
    userToken,
    'New Event Available!',
    'Check out the latest events in your area',
    { eventId: '123', type: 'new_event' }
  );

  // Example 2: Send to multiple users
  const userTokens = ['token1', 'token2', 'token3'];
  await sendNotificationToMultipleUsers(
    userTokens,
    'Weekly Event Summary',
    'Here are this week\'s featured events',
    { type: 'weekly_summary' }
  );

  // Example 3: Send to a topic (all users subscribed to 'events' topic)
  await sendNotificationToTopic(
    'events',
    'Special Event Alert',
    'Don\'t miss out on our special event this weekend!',
    { type: 'special_event', eventId: '456' }
  );
}

// Express.js route example
const express = require('express');
const app = express();

app.use(express.json());

// Route to send notification to a user
app.post('/send-notification', async (req, res) => {
  const { fcmToken, title, body, data } = req.body;
  
  if (!fcmToken || !title || !body) {
    return res.status(400).json({ 
      error: 'Missing required fields: fcmToken, title, body' 
    });
  }

  const result = await sendNotificationToUser(fcmToken, title, body, data);
  
  if (result.success) {
    res.json({ success: true, messageId: result.messageId });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});

// Route to send notification to all users
app.post('/send-notification-all', async (req, res) => {
  const { fcmTokens, title, body, data } = req.body;
  
  if (!fcmTokens || !Array.isArray(fcmTokens) || !title || !body) {
    return res.status(400).json({ 
      error: 'Missing required fields: fcmTokens (array), title, body' 
    });
  }

  const result = await sendNotificationToMultipleUsers(fcmTokens, title, body, data);
  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = {
  sendNotificationToUser,
  sendNotificationToMultipleUsers,
  sendNotificationToTopic
};
