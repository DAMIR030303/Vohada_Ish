/**
 * Firebase'ga demo ishlarni qo'shish scripti
 * 
 * @usage npx ts-node scripts/seedFirebaseJobs.ts
 */

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../src/services/firebase';
import { mockJobs } from '../src/services/mockData';

async function seedJobs() {
  console.log('🌱 Firebase'ga demo ishlarni qo'shish boshlanmoqda...');
  
  try {
    for (const job of mockJobs) {
      const jobData = {
        ...job,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const docRef = await addDoc(collection(db, 'jobs'), jobData);
      console.log(`✅ Ish qo'shildi: ${job.title} (ID: ${docRef.id})`);
    }
    
    console.log(`\n🎉 Jami ${mockJobs.length} ta ish muvaffaqiyatli qo'shildi!`);
  } catch (error) {
    console.error('❌ Xatolik:', error);
  }
}

seedJobs();

