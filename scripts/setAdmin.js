const admin = require("firebase-admin");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
let serviceAccount;
try {
  serviceAccount = require(keyPath);
} catch (err) {
  console.error("No se encontró 'serviceAccountKey.json' en la raíz del proyecto.");
  console.error("Descarga la clave desde Firebase Console -> Project Settings -> Service accounts");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = process.argv[2];
if (!uid) {
  console.error("Uso: node scripts/setAdmin.js <UID>");
  process.exit(1);
}

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`Rol 'admin' asignado al UID: ${uid}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error asignando rol admin:", err);
    process.exit(1);
  });
