const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Load .env variables
const envPath = 'c:\\Users\\AMOS\\Documents\\DATA\\.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    if (key && !key.startsWith('#')) {
      env[key] = val;
    }
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('--- Supabase Credentials Check ---');
console.log('URL:', url);
console.log('Anon Key Present:', key ? 'YES' : 'NO');
console.log('Placeholder URL:', url.includes('placeholder'));

if (!url || url.includes('placeholder') || !key || key.includes('placeholder')) {
  console.log('\n[RESULT]: Supabase credentials in .env are currently using placeholder values.');
  console.log('Please paste your real Supabase Project URL and Anon API key into .env to complete full migration.');
  process.exit(0);
}

const supabase = createClient(url, key);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      console.log('Connection test result:', error.message);
    } else {
      console.log('Connection successful! Found users:', data);
    }
  } catch (err) {
    console.error('Error connecting to Supabase:', err.message);
  }
}

testConnection();
