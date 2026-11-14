#!/usr/bin/env node

/**
 * TOURMS WORKFORCE — OFFLINE ADMINISTRATIVE CLAIMS PROVISIONING SCRIPT
 *
 * PURPOSE:
 * This script runs strictly in a trusted backend/offline environment using the
 * Firebase Admin SDK. It provisions administrative custom claims (`role: 'admin'`)
 * and creates the administrative document in Cloud Firestore.
 *
 * CRITICAL SECURITY ARCHITECTURE:
 * - Browser clients CANNOT assign administrative privileges or modify custom claims.
 * - Client-side code cannot call `setCustomUserClaims`.
 * - Administrative authorization is enforced by Firebase Auth custom token claims
 *   and checked in `firestore.rules` via:
 *     `request.auth.token.role == 'admin'`
 *
 * PREREQUISITES:
 * 1. Download your service account private key from the Firebase Console:
 *    Project Settings -> Service accounts -> Generate new private key
 * 2. Set the environment variable:
 *    export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/serviceAccountKey.json"
 * 3. Run:
 *    npm install firebase-admin
 *    node scripts/setAdminClaims.js <admin-email> [subRole]
 *
 * USAGE EXAMPLES:
 *    node scripts/setAdminClaims.js admin@tourmsworkforce.com.ng super_admin
 *    node scripts/setAdminClaims.js verifications@tourmsworkforce.com.ng verification
 *    node scripts/setAdminClaims.js ops@tourmsworkforce.com.ng operations
 */

const fs = require('fs');
const path = require('path');

async function main() {
  const args = process.argv.slice(2);
  const targetEmail = args[0];
  const targetSubRole = args[1] || 'super_admin';

  const validSubRoles = ['super_admin', 'verifier', 'moderator', 'support_lead'];

  if (!targetEmail) {
    console.error('❌ Error: Target administrator email is required.\n');
    console.log('Usage: node scripts/setAdminClaims.js <admin-email> [subRole]');
    console.log(`Allowed subRoles: ${validSubRoles.join(', ')} (default: super_admin)`);
    process.exit(1);
  }

  if (!validSubRoles.includes(targetSubRole)) {
    console.error(`❌ Error: Invalid subRole "${targetSubRole}". Allowed: ${validSubRoles.join(', ')}`);
    process.exit(1);
  }

  console.log('================================================================');
  console.log('  TOURMS WORKFORCE — ADMIN PROVISIONING');
  console.log('================================================================');
  console.log(`Target Email    : ${targetEmail}`);
  console.log(`Assigned SubRole: ${targetSubRole}`);
  console.log(`Timestamp       : ${new Date().toISOString()}`);
  console.log('----------------------------------------------------------------');

  let admin;
  try {
    admin = require('firebase-admin');
  } catch (err) {
    console.error('❌ firebase-admin is not installed in the current environment.');
    console.log('To run this provisioning script on your development/admin workstation:');
    console.log('   npm install --save-dev firebase-admin');
    console.log('Then retry this command.');
    process.exit(1);
  }

  // Check for credentials
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath || !fs.existsSync(credPath)) {
    console.warn('⚠️  Notice: GOOGLE_APPLICATION_CREDENTIALS environment variable not set or file not found.');
    console.log('Attempting default application credentials initialization...');
  }

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: credPath && fs.existsSync(credPath)
          ? admin.credential.cert(require(path.resolve(credPath)))
          : admin.credential.applicationDefault()
      });
    }

    const auth = admin.auth();
    const db = admin.firestore();

    // 1. Fetch user by email
    console.log(`\n🔍 Looking up user account for "${targetEmail}"...`);
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(targetEmail);
      console.log(`✓ Found user UID: ${userRecord.uid}`);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        console.error(`❌ No user account exists with email "${targetEmail}".`);
        console.log('Please register this user first via the web portal or Firebase Auth Console.');
        process.exit(1);
      }
      throw err;
    }

    // 2. Set Custom User Claims on Firebase Auth
    console.log('\n🔐 Setting Firebase Auth Custom User Claims:');
    const customClaims = {
      role: 'admin',
      adminRole: targetSubRole,
      subRole: targetSubRole,
      adminSince: Date.now()
    };
    await auth.setCustomUserClaims(userRecord.uid, customClaims);
    console.log(`✓ Custom claims applied: ${JSON.stringify(customClaims)}`);

    // 3. Write record to admins/{uid} and users/{uid} in Firestore
    console.log('\n📄 Synchronizing administrative registry document in Cloud Firestore...');
    const now = new Date().toISOString();
    
    await db.collection('admins').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: targetEmail,
      role: targetSubRole,
      subRole: targetSubRole,
      updatedAt: now,
      provisionedBy: 'setAdminClaims.js'
    }, { merge: true });
    console.log(`✓ Created/Updated document: admins/${userRecord.uid}`);

    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: targetEmail,
      role: 'admin',
      subRole: targetSubRole,
      updatedAt: now
    }, { merge: true });
    console.log(`✓ Synchronized document: users/${userRecord.uid}`);

    console.log('\n================================================================');
    console.log('✅ ADMINISTRATIVE PRIVILEGES SUCCESSFULLY PROVISIONED');
    console.log('================================================================');
    console.log('Next Steps for Administrator:');
    console.log('1. If the administrator is currently signed in, have them sign out');
    console.log('   and sign in again to refresh their ID token claims.');
    console.log('2. The administrator can now access: /admin');
    console.log('3. All security rules will recognize `request.auth.token.role == "admin"`.');
    console.log('================================================================\n');

  } catch (error) {
    console.error('\n❌ Execution failed:', error.message);
    process.exit(1);
  }
}

main();
