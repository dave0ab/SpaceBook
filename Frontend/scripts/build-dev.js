#!/usr/bin/env node

/**
 * Development build script
 * Loads .env.development and runs next build
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '..', '.env.development');
const envLocalFile = path.join(__dirname, '..', '.env.production.local');

// Check if .env.development exists
if (!fs.existsSync(envFile)) {
  console.error('❌ .env.development file not found!');
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
process.env.NODE_ENV = 'development';

// Temporarily rename .env.production.local if it exists to prevent Next.js from using it
let productionLocalRenamed = false;
if (fs.existsSync(envLocalFile)) {
  fs.renameSync(envLocalFile, envLocalFile + '.backup');
  productionLocalRenamed = true;
}

try {
  console.log('🔨 Building for development environment...');
  console.log(`📡 API URL: ${process.env.NEXT_PUBLIC_API_URL || 'Not set'}`);
  execSync('next build', { stdio: 'inherit', env: process.env });
  console.log('✅ Development build completed!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Restore .env.production.local if it was renamed
  if (productionLocalRenamed) {
    fs.renameSync(envLocalFile + '.backup', envLocalFile);
  }
}

