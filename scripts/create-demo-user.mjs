#!/usr/bin/env node

/**
 * Script to create a demo user in Cognito User Pool
 * Usage: node scripts/create-demo-user.mjs
 */

import { readFileSync } from 'fs';
import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';

// Demo user credentials
const DEMO_EMAIL = 'demo@chewview.local';
const DEMO_PASSWORD = 'DemoUser123!';

async function createDemoUser() {
  try {
    // Read amplify_outputs.json to get User Pool ID
    console.log('📖 Reading Amplify configuration...');
    const amplifyConfig = JSON.parse(readFileSync('amplify_outputs.json', 'utf8'));
    const userPoolId = amplifyConfig.auth?.user_pool_id;

    if (!userPoolId) {
      console.error('❌ Error: Could not find User Pool ID in amplify_outputs.json');
      console.error('Make sure you have deployed your Amplify app first.');
      process.exit(1);
    }

    // Extract region from User Pool ID (format: region_poolId)
    const region = userPoolId.split('_')[0];
    console.log(`✓ User Pool ID: ${userPoolId}`);
    console.log(`✓ Region: ${region}`);

    // Initialize Cognito client
    const client = new CognitoIdentityProviderClient({ region });

    // Create the user
    console.log(`\n👤 Creating user: ${DEMO_EMAIL}...`);

    try {
      await client.send(new AdminCreateUserCommand({
        UserPoolId: userPoolId,
        Username: DEMO_EMAIL,
        UserAttributes: [
          { Name: 'email', Value: DEMO_EMAIL },
          { Name: 'email_verified', Value: 'true' }
        ],
        MessageAction: 'SUPPRESS'
      }));
      console.log('✓ User created');
    } catch (error) {
      if (error.name === 'UsernameExistsException') {
        console.log('⚠️  User already exists, updating password...');
      } else {
        throw error;
      }
    }

    // Set permanent password
    console.log('\n🔑 Setting permanent password...');
    await client.send(new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: DEMO_EMAIL,
      Password: DEMO_PASSWORD,
      Permanent: true
    }));

    console.log('\n✅ Demo user created successfully!\n');
    console.log('═══════════════════════════════════');
    console.log('📧 Demo Credentials:');
    console.log('═══════════════════════════════════');
    console.log(`   Email:    ${DEMO_EMAIL}`);
    console.log(`   Password: ${DEMO_PASSWORD}`);
    console.log('═══════════════════════════════════');
    console.log('\n💡 This user can log in immediately without email verification.');
    console.log('   Perfect for demos and testing!\n');

  } catch (error) {
    console.error('\n❌ Error creating demo user:', error.message);
    process.exit(1);
  }
}

createDemoUser();
