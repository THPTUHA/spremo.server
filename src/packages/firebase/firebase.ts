/// <reference lib="dom" />
import admin from 'firebase-admin'
import {initializeApp} from 'firebase/app'
import serviceAccount from './serviceAccountKey.json';
import serviceAccountProduct from './serviceAccountKey.product.json';
import { FIREBASE_CONFIG } from '../../Constants';

initializeApp(FIREBASE_CONFIG);

admin.initializeApp({
    credential: admin.credential.cert(process.env.NODE_ENV !== "production" ? (serviceAccount as any) : serviceAccountProduct)
});

admin.firestore().settings({ ignoreUndefinedProperties: true })
export const firebase_db = admin.firestore();

