const admin = require("firebase-admin");
const path = require("path");

// Read service account JSON from env var SERVICE_ACCOUNT_KEY, either as JSON or base64 encoded JSON
let serviceAccount;
if (process.env.SERVICE_ACCOUNT_KEY) {
  try {
    const envVal = process.env.SERVICE_ACCOUNT_KEY;
    serviceAccount = envVal.trim().startsWith('{') ? JSON.parse(envVal) : JSON.parse(Buffer.from(envVal, 'base64').toString('utf8'));
  } catch (err) {
    console.error('Error parsing SERVICE_ACCOUNT_KEY env var:', err);
    process.exit(1);
  }
} else {
  const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
  try {
    serviceAccount = require(keyPath);
  } catch (err) {
    console.error("No se encontró 'serviceAccountKey.json' en la raíz del proyecto ni la variable SERVICE_ACCOUNT_KEY.");
    console.error("Provee la clave como variable de entorno SERVICE_ACCOUNT_KEY (JSON o base64) o coloca el archivo serviceAccountKey.json localmente.");
    process.exit(1);
  }
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
