import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nivzsdyvkdkezigvmtqx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdnpzZHl2a2RrZXppZ3ZtdHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMjIwMTAsImV4cCI6MjA1ODY5ODAxMH0.Yb9a9MkU_iNc9G7iX04Kr6lDlSbSLS2go-zb_R5cCtA';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other scripts
window.appSupabase = supabase;

// Replace handleLogin function
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  // Show loading indicator
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="material-icons animate-spin">refresh</span> Signing in...';
  submitBtn.disabled = true;
  
  try {
    // Sign in with Supabase Auth
    const { data, error } = await window.appSupabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    if (error) throw error;
    
    // Get user profile from users table
    const { data: userProfile, error: profileError } = await window.appSupabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) throw profileError;
    
    // Clear form and error
    loginForm.reset();
    loginError.classList.add('hidden');
    
    // Login the user
    await loginUser(userProfile);
  } catch (error) {
    console.error('Login error:', error);
    loginError.textContent = error.message || 'Invalid email or password';
    loginError.classList.remove('hidden');
  } finally {
    // Reset button
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
  }
}

// Replace handleRegister function
async function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  
  // Check if passwords match
  if (password !== confirmPassword) {
    registerError.textContent = 'Passwords do not match';
    registerError.classList.remove('hidden');
    return;
  }
  
  // Show loading indicator
  const submitBtn = registerForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span class="material-icons animate-spin">refresh</span> Creating account...';
  submitBtn.disabled = true;
  
  try {
    // Register with Supabase Auth
    const { data, error } = await window.appSupabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name // Store name in auth metadata
        }
      }
    });
    
    if (error) throw error;
    
    // Create user profile in users table
    const { error: profileError } = await window.appSupabase
      .from('users')
      .insert([
        { id: data.user.id, email: email, name: name }
      ]);
    
    if (profileError) throw profileError;
    
    // Clear form and show success
    registerForm.reset();
    registerError.textContent = 'Account created successfully! Please log in.';
    registerError.classList.remove('hidden');
    registerError.classList.add('text-green-500');
    
    // Switch to login tab
    loginTab.click();
  } catch (error) {
    console.error('Registration error:', error);
    registerError.textContent = error.message || 'Error creating account';
    registerError.classList.remove('hidden');
  } finally {
    // Reset button
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
  }
}

// Replace loadUserData
async function loadUserData() {
  try {
    // Load content items
    const { data: items, error: contentError } = await window.appSupabase
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (contentError) throw contentError;
    
    contentItems = items || [];
    rebuildUrlContentMap();
    
    // Load engagement data with content relationship
    const { data: engagements, error: engagementError } = await window.appSupabase
      .from('engagement_data')
      .select(`
        *,
        content:content_id (
          id, name, platform, url
        )
      `)
      .order('timestamp', { ascending: false });
    
    if (engagementError) throw engagementError;
    
    engagementData = engagements || [];
    
    // Load API config
    const { data: apiConfigs, error: configError } = await window.appSupabase
      .from('api_config')
      .select('*');
      
    if (!configError && apiConfigs) {
      apiConfig = {
        youtube: { apiKey: null },
        servicenow: { instance: null, username: null, password: null },
        linkedin: { clientId: null, clientSecret: null, accessToken: null }
      };
      
      apiConfigs.forEach(config => {
        if (config.platform === 'youtube') {
          apiConfig.youtube = config.config;
        } else if (config.platform === 'servicenow') {
          apiConfig.servicenow = config.config;
        } else if (config.platform === 'linkedin') {
          apiConfig.linkedin = config.config;
        }
      });
      
      updateApiConfigUI();
    }
    
    // Set default date to today for content form
    document.getElementById('content-published').valueAsDate = new Date();
    
    // Render data
    renderContentItems();
    renderEngagementData();
    updateStats();
    renderCharts();
  } catch (error) {
    console.error('Error loading user data:', error);
    // Show error notification
    showNotification('Error loading data: ' + error.message, 'error');
  }
}

// Initialize the app with Supabase Auth
async function initApp() {
  // Check for existing session
  const { data: { session } } = await window.appSupabase.auth.getSession();
  
  if (session) {
    // Get user profile
    const { data: userProfile, error: profileError } = await window.appSupabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (!profileError && userProfile) {
      // User is logged in
      await loginUser(userProfile);
      return;
    } else {
      // Session exists but profile not found, sign out
      await window.appSupabase.auth.signOut();
    }
  }
  
  // Set up auth event listeners
  loginTab.addEventListener('click', () => {
    // existing code...
  });
  
  // ...rest of existing initialization...
  
  // No logged in user, show auth screen
  authContent.style.display = 'block';
  mainContent.style.display = 'none';
}