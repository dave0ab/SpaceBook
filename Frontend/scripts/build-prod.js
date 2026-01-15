#!/usr/bin/env node

/**
 * Production build script
 * Loads .env.production and runs next build
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '..', 'environment', '.env.production');

// Check if .env.production exists
if (!fs.existsSync(envFile)) {
  console.error('❌ .env.production file not found!');
  process.exit(1);
}

// Read and set environment variables
const envContent = fs.readFileSync(envFile, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Set environment variables
Object.assign(process.env, envVars);
process.env.NODE_ENV = 'production';

try {
  console.log('🔨 Building for production environment...');
  console.log(`📡 API URL: ${process.env.NEXT_PUBLIC_API_URL || 'Not set'}`);
  execSync('next build', { stdio: 'inherit', env: process.env });
  console.log('✅ Production build completed!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

