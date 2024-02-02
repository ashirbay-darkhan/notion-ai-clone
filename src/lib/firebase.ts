// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, ref, uploadBytes} from "@firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "notion-ai-clone.firebaseapp.com",
  projectId: "notion-ai-clone",
  storageBucket: "notion-ai-clone.appspot.com",
  messagingSenderId: "560962440510",
  appId: "1:560962440510:web:c1d324988c24e3dbaab06f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

export async function uploadFileToFirebase(image_url: string, name: string) {
  try {
    const response = await fetch(image_url);
    const buffer = await response.arrayBuffer();
    const file_name = name.replace(" ", "") + Date.now + ".jpeg";
    const storageRef = ref(storage, file_name);
    await uploadBytes(storageRef, buffer, {
      contentType: "image/jpeg",
    });
    const firebase_url = await getDownloadURL(storageRef);
    return firebase_url;
  } catch (error) {
    console.error(error);
  }
}