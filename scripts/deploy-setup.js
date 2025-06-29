#!/usr/bin/env node

/**
 * Deployment Setup Script for Vachon UX Design Studio
 * 
 * This script helps prepare your application for production deployment
 * by checking configuration and providing setup guidance.
 */

const fs = require('fs');
const path = require('path');

console.log(`
🚀 Vachon UX Design Studio - Deployment Setup
==============================================
`);

// Check if we're in demo mode
function checkDemoMode() {
  const configPath = path.join(__dirname, '../lib/supabase-config.ts');
  const config = fs.readFileSync(configPath, 'utf8');
  
  if (config.includes('demo-project.supabase.co')) {
    console.log('⚠️  DEMO MODE DETECTED');
    console.log('   Update /lib/supabase-config.ts with your real Supabase credentials');
    console.log('   Follow the deployment guide for setup instructions\n');
    return true;
  }
  
  console.log('✅ Production configuration detected\n');
  return false;
}

// Check environment files
function checkEnvironmentFiles() {
  const envLocal = path.join(__dirname, '../.env.local');
  const envExample = path.join(__dirname, '../.env.local.example');
  
  if (!fs.existsSync(envLocal)) {
    console.log('⚠️  .env.local not found');
    if (fs.existsSync(envExample)) {
      console.log('   Copy .env.local.example to .env.local and fill in your values');
    }
    return false;
  }
  
  console.log('✅ Environment file found');
  return true;
}

// Check package.json for required scripts
function checkPackageScripts() {
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const requiredScripts = ['build', 'start', 'dev'];
  const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
  
  if (missingScripts.length > 0) {
    console.log(`⚠️  Missing scripts: ${missingScripts.join(', ')}`);
    return false;
  }
  
  console.log('✅ Required npm scripts found');
  return true;
}

// Check Next.js configuration
function checkNextConfig() {
  const nextConfigPath = path.join(__dirname, '../next.config.js');
  
  if (!fs.existsSync(nextConfigPath)) {
    console.log('⚠️  next.config.js not found');
    return false;
  }
  
  console.log('✅ Next.js configuration found');
  return true;
}

// Check database migrations
function checkMigrations() {
  const migrationsPath = path.join(__dirname, '../supabase/migrations');
  
  if (!fs.existsSync(migrationsPath)) {
    console.log('⚠️  Database migrations not found');
    return false;
  }
  
  const migrations = fs.readdirSync(migrationsPath).filter(file => file.endsWith('.sql'));
  
  if (migrations.length === 0) {
    console.log('⚠️  No SQL migration files found');
    return false;
  }
  
  console.log(`✅ Found ${migrations.length} database migration(s)`);
  return true;
}

// Main setup check
function runSetupCheck() {
  console.log('🔍 Checking deployment readiness...\n');
  
  const checks = [
    { name: 'Demo Mode', check: checkDemoMode, critical: false },
    { name: 'Environment Files', check: checkEnvironmentFiles, critical: true },
    { name: 'Package Scripts', check: checkPackageScripts, critical: true },
    { name: 'Next.js Config', check: checkNextConfig, critical: true },
    { name: 'Database Migrations', check: checkMigrations, critical: true }
  ];
  
  let criticalIssues = 0;
  let warnings = 0;
  
  checks.forEach(({ name, check, critical }) => {
    try {
      const result = check();
      if (!result) {
        if (critical) {
          criticalIssues++;
        } else {
          warnings++;
        }
      }
    } catch (error) {
      console.log(`❌ Error checking ${name}: ${error.message}`);
      if (critical) criticalIssues++;
    }
  });
  
  console.log('\n📊 DEPLOYMENT READINESS SUMMARY');
  console.log('================================');
  
  if (criticalIssues === 0) {
    console.log('🎉 Ready for deployment!');
    console.log('   Follow the deployment guide to deploy your application');
  } else {
    console.log(`❌ ${criticalIssues} critical issue(s) need to be resolved before deployment`);
  }
  
  if (warnings > 0) {
    console.log(`⚠️  ${warnings} warning(s) - deployment possible but recommended to address`);
  }
  
  console.log('\n📖 Next Steps:');
  console.log('1. Read DEPLOYMENT_GUIDE.md for complete instructions');
  console.log('2. Set up your Supabase project');
  console.log('3. Configure environment variables');
  console.log('4. Deploy to your preferred platform');
  console.log('\n🚀 Happy deploying!');
}

// Run the setup check
runSetupCheck();