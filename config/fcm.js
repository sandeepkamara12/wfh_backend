const admin = require('firebase-admin');
const serviceAccount = require('../config/dayschallenge.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function sendNotification(tokens, title, body, data = {}) {
  if (!Array.isArray(tokens) || tokens.length === 0) {
    console.error('❌ No FCM tokens provided');
    return;
  }

  for (const token of tokens) {
    const message = {
      token,
      notification: { title, body },
      data: Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      )
    };

    try {
      console.log('📦 Sending to:', token);
      console.log('    message:', JSON.stringify(message));
      const resp = await admin.messaging().send(message);
      console.log(`✅ Sent to ${token}:`, resp);
    } catch (err) {
      console.error(`❌ Failed for ${token}:`, err);
    }
  }
}




module.exports = sendNotification;
