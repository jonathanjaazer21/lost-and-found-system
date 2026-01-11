import { sendLostItemEmail } from './src/services/email/emailService.server';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmailNotifications() {
  console.log('='.repeat(60));
  console.log('Email Notification Test - Lost & Found System');
  console.log('='.repeat(60));
  console.log('');

  // Test data - simulating a lost item
  const testReceivers = ['test@example.com', 'admin@example.com'];

  const newItemData = {
    description: 'Black leather wallet found near the cafeteria',
    mobile_number: '09123456789',
    upload_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600',
    status: 'unclaimed' as const,
  };

  const updatedItemData = {
    description: 'Black leather wallet found near the cafeteria - Contains ID card',
    mobile_number: '09123456789',
    upload_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600',
    status: 'claimed' as const,
  };

  console.log('📧 Test 1: Sending "New Item Created" email notification...');
  console.log(`Recipients: ${testReceivers.join(', ')}`);
  console.log('');

  try {
    await sendLostItemEmail(testReceivers, newItemData, 'created');
    console.log('✅ "Created" email sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send "created" email:', error);
    process.exit(1);
  }

  console.log('');
  console.log('-'.repeat(60));
  console.log('');

  console.log('📧 Test 2: Sending "Item Updated" email notification...');
  console.log(`Recipients: ${testReceivers.join(', ')}`);
  console.log('');

  try {
    await sendLostItemEmail(testReceivers, updatedItemData, 'updated');
    console.log('✅ "Updated" email sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send "updated" email:', error);
    process.exit(1);
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('✅ All Email Notification Tests Completed!');
  console.log('='.repeat(60));
  console.log('');

  if (process.env.NODE_ENV === 'development') {
    console.log('💡 Note: In development mode, check the console output above');
    console.log('   for preview URLs to view the emails in Ethereal Email.');
  } else {
    console.log('💡 Note: In production mode, check your inbox for the test emails.');
  }
}

// Run the test
testEmailNotifications().catch(console.error);
