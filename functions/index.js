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
