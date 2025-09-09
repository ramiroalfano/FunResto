
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyD18P_ysxh44PZPT10xkfR0Ifq2BSMQh-Q",
  authDomain: "funfood-371b5.firebaseapp.com",
  projectId: "funfood-371b5",
  storageBucket: "funfood-371b5.appspot.com",
  messagingSenderId: "901586123943",
  appId: "1:901586123943:web:b10e1ae4b3b23527ed6f82",
  measurementId: "G-0S7HV74RFB",
  databaseURL: "https://funfood-371b5-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function testConnection() {
  try {
    const testRef = ref(db, 'test-connection');
    await push(testRef, { timestamp: new Date().toISOString() });
    console.log('Successfully wrote to the database.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to write to the database:', error.message);
    process.exit(1);
  }
}

testConnection();
