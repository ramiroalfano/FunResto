const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.addAdminRole = functions.database.ref("/admins/{email}").onCreate((snapshot, context) => {
  const email = context.params.email.replace(",", ".");
  return admin.auth().getUserByEmail(email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    });
  }).then(() => {
    return {
      message: `Success! ${email} has been made an admin.`
    }
  }).catch(err => {
    return err;
  });
});

exports.cleanupOldOrders = functions.pubsub.schedule('every 360 hours').onRun(async (context) => {
  const now = Date.now();
  const fifteenDaysAgo = now - 15 * 24 * 60 * 60 * 1000; // 15 días en milisegundos

  const ordersRef = admin.database().ref('/orders');
  const snapshot = await ordersRef.once('value');

  if (!snapshot.exists()) {
    console.log("No orders found to cleanup.");
    return null;
  }

  const updates = {};
  snapshot.forEach(childSnapshot => {
    const order = childSnapshot.val();
    const orderDate = new Date(order.date).getTime();

    if (orderDate < fifteenDaysAgo) {
      updates[childSnapshot.key] = null; // Marcar para eliminación
    }
  });

  if (Object.keys(updates).length > 0) {
    await ordersRef.update(updates);
    console.log(`Deleted ${Object.keys(updates).length} old orders.`);
  } else {
    console.log("No old orders to delete.");
  }
  
  return null;
});
