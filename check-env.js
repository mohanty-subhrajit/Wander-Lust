require('dotenv').config();

console.log('🔍 ENVIRONMENT VARIABLES DIAGNOSTIC\n');

const requiredVars = [
  'GMAIL_USER',
  'GMAIL_PASSWORD', 
  'SMTP_HOST',
  'SMTP_PORT',
  'ATLASDB_URL',
  'SECRET',
  'CLOUD_NAME',
  'CLOUD_API_KEY',
  'MAP_TOKEN'
];

console.log('Required Variables Status:\n');

let missingVars = [];
let presentVars = [];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const display = value 
    ? (varName.includes('PASSWORD') || varName.includes('SECRET') || varName.includes('KEY') 
        ? '***' + value.slice(-4)
        : value.substring(0, 50) + (value.length > 50 ? '...' : ''))
    : 'NOT SET';
  
  console.log(`${status} ${varName.padEnd(20)} ${display}`);
  
  if (value) {
    presentVars.push(varName);
  } else {
    missingVars.push(varName);
  }
});

console.log('\n' + '='.repeat(60));

if (missingVars.length > 0) {
  console.log('\n⚠️  MISSING VARIABLES:\n');
  missingVars.forEach(varName => {
    console.log(`  - ${varName}`);
  });
  console.log('\n❌ These variables must be set in Render Environment!');
  console.log('\nINSTRUCTIONS:');
  console.log('1. Go to Render Dashboard: https://dashboard.render.com/');
  console.log('2. Select your service: wander-lust-project-ezj2');
  console.log('3. Go to Environment tab');
  console.log('4. Add missing variables');
  console.log('5. Click "Save Changes" to redeploy');
} else {
  console.log('\n✅ ALL REQUIRED VARIABLES ARE SET');
  console.log('\nEmail Configuration:');
  console.log('  GMAIL_USER:', process.env.GMAIL_USER);
  console.log('  GMAIL_PASSWORD: Set ✓');
  console.log('  SMTP_HOST:', process.env.SMTP_HOST);
  console.log('  SMTP_PORT:', process.env.SMTP_PORT);
}

console.log('\n' + '='.repeat(60));
