<template>
    <div class="pwa-installer">
      <div v-if="showInstallPrompt && !customInstructionsShown && !isStandalone" class="install-prompt">
        <div class="prompt-content">
          <div class="prompt-icon">📱</div>
          <div class="prompt-text">
            <h3>Install App</h3>
            <p>Add this app to your home screen for quick access and offline use.</p>
          </div>
        </div>
        <div class="prompt-actions">
          <button @click="installPwa" class="btn-install">Install</button>
          <button @click="dismissPrompt" class="btn-dismiss">Not Now</button>
        </div>
      </div>
      
      <div v-if="updateAvailable" class="update-prompt">
        <div class="prompt-content">
          <div class="prompt-icon">🔄</div>
          <div class="prompt-text">
            <h3>Update Available</h3>
            <p>A new version of the app is available.</p>
          </div>
        </div>
        <div class="prompt-actions">
          <button @click="updatePwa" class="btn-update">Update Now</button>
          <button @click="dismissUpdate" class="btn-dismiss">Later</button>
        </div>
      </div>
  
      <div v-if="showIOSInstructions" class="pwa-install-instructions ios">
        <div class="instruction-modal">
          <div class="instruction-header">
            <h3>Install this app on your iPhone</h3>
            <button @click="showIOSInstructions = false" class="close-btn">×</button>
          </div>
          <div class="instruction-content">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-text">Tap the <strong>Share</strong> button at the bottom of the screen</div>
              <div class="step-image">📤</div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-text">In the share menu, scroll down and tap <strong>Add to Home Screen</strong></div>
              <div class="step-image">➕</div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-text">Tap <strong>Add</strong> in the top right corner</div>
              <div class="step-image">✓</div>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="showAndroidInstructions" class="pwa-install-instructions android">
        <div class="instruction-modal">
          <div class="instruction-header">
            <h3>Install this app on your Android device</h3>
            <button @click="showAndroidInstructions = false" class="close-btn">×</button>
          </div>
          <div class="instruction-content">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-text">Tap the menu button <strong>⋮</strong> in the top right corner</div>
              <div class="step-image">⋮</div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-text">Tap <strong>Install app</strong> or <strong>Add to Home screen</strong></div>
              <div class="step-image">📱</div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-text">Tap <strong>Install</strong> in the prompt</div>
              <div class="step-image">✓</div>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="showDesktopInstructions" class="pwa-install-instructions desktop">
        <div class="instruction-modal">
          <div class="instruction-header">
            <h3>Install this app on your computer</h3>
            <button @click="showDesktopInstructions = false" class="close-btn">×</button>
          </div>
          <div class="instruction-content">
            <!-- Chrome instructions -->
            <template v-if="platformInfo.browser === 'chrome'">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-text">Click the menu button <strong>⋮</strong> in the top right corner</div>
                <div class="step-image">⋮</div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-text">Click <strong>Install this site as an app</strong></div>
                <div class="step-image">📥</div>
              </div>
            </template>
            
            <!-- Edge instructions -->
            <template v-else-if="platformInfo.browser === 'edge'">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-text">Click the menu button <strong>⋯</strong> in the top right corner</div>
                <div class="step-image">⋯</div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-text">Click <strong>Apps</strong> > <strong>Install this site as an app</strong></div>
                <div class="step-image">📥</div>
              </div>
            </template>
            
            <!-- Firefox instructions -->
            <template v-else-if="platformInfo.browser === 'firefox'">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-text">Firefox has limited PWA support. For best results, please use Chrome or Edge.</div>
                <div class="step-image">🦊</div>
              </div>
            </template>
            
            <!-- Default instructions -->
            <template v-else>
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-text">Look for an install option in your browser's menu</div>
                <div class="step-image">🔍</div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-text">For best results, please use Chrome or Edge</div>
                <div class="step-image">💡</div>
              </div>
            </template>
          </div>
        </div>
      </div>
  
      <!-- Enhanced Debug panel -->
      <div v-if="debugMode" class="debug-section">
        <div class="debug-header">
          <h3>PWA Installer Debug Panel</h3>
          <div class="status-indicator" :class="statusClass">
            <div>PWA Status: {{ statusMessage }}</div>
          </div>
        </div>
        
        <div class="debug-controls">
          <button @click="showInstallPrompt = true" class="debug-button">
            Force Install Prompt
          </button>
          <button @click="showAppropriateInstructions()" class="debug-button">
            Show Manual Instructions
          </button>
          <button @click="checkPwaEligibility()" class="debug-button">
            Check Install Eligibility
          </button>
          <button @click="simulateBeforeInstallPrompt()" class="debug-button">
            Simulate Install Prompt
          </button>
        </div>
        
        <div class="debug-info">
          <div class="debug-section-title">Environment Information</div>
          <table class="debug-table">
            <tr>
              <td>Platform:</td>
              <td>{{ platformInfo.isIOS ? 'iOS' : (platformInfo.isAndroid ? 'Android' : 'Desktop') }}</td>
            </tr>
            <tr>
              <td>Browser:</td>
              <td>{{ platformInfo.browser }} {{ platformInfo.version }}</td>
            </tr>
            <tr>
              <td>Already Installed:</td>
              <td>{{ isStandalone ? 'Yes' : 'No' }}</td>
            </tr>
            <tr>
              <td>Install Prompt Available:</td>
              <td>{{ !!deferredPrompt ? 'Yes' : 'No' }}</td>
            </tr>
            <tr>
              <td>User Engagement Level:</td>
              <td>{{ engagementLevel }}</td>
            </tr>
            <tr>
              <td>Service Worker:</td>
              <td>{{ (windowRef?.navigator && 'serviceWorker' in windowRef?.navigator) ? 'Supported' : 'Not Supported' }}</td>
            </tr>
            <tr>
              <td>Service Worker State:</td>
              <td>{{ serviceWorkerState }}</td>
            </tr>
          </table>
          
          <div v-if="issues.length > 0" class="issues-list">
            <div class="debug-section-title">Issues Detected:</div>
            <ul>
              <li v-for="(issue, index) in issues" :key="index">{{ issue }}</li>
            </ul>
          </div>
          
          <div class="debug-section-title">Event Log:</div>
          <div class="event-log">
            <div v-for="(event, index) in eventLog" :key="index" class="event-item">
              <span class="event-time">{{ event.time }}</span>
              <span class="event-type" :class="event.type">{{ event.type }}</span>
              <span class="event-message">{{ event.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // script setup lang="ts"
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

// Define props
const props = defineProps({
  debug: {
    type: Boolean,
    default: true
  },
  // Delay before showing install prompt on Chrome
  chromePromptDelay: {
    type: Number,
    default: 10000 // 10 seconds default
  },
  // Minimum engagement level before showing prompt
  minEngagementLevel: {
    type: Number, 
    default: 3
  },
  // Installation check interval (ms)
  installCheckInterval: {
    type: Number,
    default: 2000
  },
  // Whether to show debug logs in console even when debug mode is off
  consoleDebug: {
    type: Boolean,
    default: false
  },
  // Advanced options for install eligibility checks
  advancedChecks: {
    type: Boolean,
    default: true
  },
  // Number of days to wait before showing install prompt again after dismissal
  dismissalPeriod: {
    type: Number,
    default: 7
  }
});

// Define type for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}
const windowRef = ref(typeof window !== 'undefined' ? window : null);
// Extend Window interface for PWA installation
declare global {
  interface Window {
    deferredInstallPrompt?: BeforeInstallPromptEvent;
  }
  interface Navigator {
    standalone?: boolean;
    userAgentData?: {
      getHighEntropyValues: (hints: string[]) => Promise<{[key: string]: any}>;
    };
    //@ts-expect-error
    maxTouchPoints?: number;
  }
  interface WindowEventMap {
    'beforeinstallprompt': BeforeInstallPromptEvent;
    'appinstalled': Event;
  }
}

// Platform detection state
const platformInfo = ref({
  isIOS: false,
  isAndroid: false,
  isDesktop: false,
  browser: '',
  version: ''
});

// Main component state
const showInstallPrompt = ref(false);
const updateAvailable = ref(false);
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
const registration = ref<ServiceWorkerRegistration | null>(null);
const customInstructionsShown = ref(false);
const isStandalone = ref(false);
const installPromptCalled = ref(false);
const serviceWorkerState = ref('Initializing');

// Modal visibility states
const showIOSInstructions = ref(false);
const showAndroidInstructions = ref(false);
const showDesktopInstructions = ref(false);

// Debug info
const debugMode = computed(() => props.debug === true);
const statusMessage = ref('Waiting for install conditions');
const issues = ref<string[]>([]);
const engagementLevel = ref(0);
const eventLog = ref<{time: string, type: string, message: string}[]>([]);
const installEligible = ref(false);
const promptAvailable = ref(false);

// Computed property for status indicator class
const statusClass = computed(() => {
  if (deferredPrompt.value) return 'status-ready';
  if (issues.value.length > 0) return 'status-warning';
  return 'status-pending';
});

// Add event to log
const logEvent = (type: string, message: string): void => {
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
  
  // Add to UI event log in debug mode
  if (debugMode.value) {
    eventLog.value.unshift({
      time: timeString,
      type,
      message
    });
    
    // Limit log size
    if (eventLog.value.length > 100) {
      eventLog.value.pop();
    }
  }
  
  // Log to console in debug mode or if consoleDebug is enabled
  if (debugMode.value || props.consoleDebug) {
    // Color-code log messages based on type
    const styles: Record<string, string> = {
      INFO: 'color: #2196F3',        // Blue
      ERROR: 'color: #F44336',       // Red
      WARNING: 'color: #FF9800',     // Orange
      SUCCESS: 'color: #4CAF50',     // Green
      ACTION: 'color: #9C27B0',      // Purple
      SYSTEM: 'color: #607D8B',      // Blue-gray
      DEBUG: 'color: #795548',       // Brown
      CHECK: 'color: #00BCD4',       // Cyan
      ENGAGEMENT: 'color: #009688', // Teal
      SETUP: 'color: #673AB7',       // Deep Purple
      RECOVERY: 'color: #8BC34A',    // Light Green
      UPDATE: 'color: #CDDC39',      // Lime
      USER: 'color: #FFC107',        // Amber
      TIMER: 'color: #FF5722',       // Deep Orange
      SERVICE_WORKER: 'color: #3F51B5', // Indigo
      LIFECYCLE: 'color: #E91E63'    // Pink
    };
    
    const style = styles[type] || 'color: #757575'; // Default gray
    console.log(`%c[${type}]%c ${timeString} ${message}`, style, 'color: inherit');
  }
};

// Detect platform on mount with improved browser detection
const detectPlatform = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    logEvent('ERROR', 'Window or navigator not available - likely running in SSR mode');
    return;
  }
  
  const ua = window.navigator.userAgent.toLowerCase();
  
  // Feature-based detection for iOS (without using navigator.platform)
  // iOS detection using multiple signals
  const isIOS = /iphone|ipad|ipod|crios|fxios/.test(ua) || 
                // Modern approach using maxTouchPoints for iOS detection
                (navigator.maxTouchPoints && navigator.maxTouchPoints > 1 && 
                 /macintosh/i.test(ua)) || 
                // Specific check for Firefox on iOS
                /fxios/.test(ua);
  
  platformInfo.value = {
    isIOS: isIOS,
    isAndroid: /android/.test(ua),
    isDesktop: !isIOS && !/android/.test(ua),
    browser: '',
    version: ''
  };
  
  // Improved browser detection
  if (/fxios/.test(ua)) {
    platformInfo.value.browser = 'firefox';
    logEvent('INFO', 'Detected Firefox on iOS');
  } else if (/crios/.test(ua)) {
    platformInfo.value.browser = 'chrome';
    logEvent('INFO', 'Detected Chrome on iOS');
  } else if (/edg/.test(ua)) {
    platformInfo.value.browser = 'edge';
  } else if (/firefox/.test(ua)) {
    platformInfo.value.browser = 'firefox';
  } else if (/chrome|chromium/.test(ua)) {
    platformInfo.value.browser = 'chrome';
  } else if (/safari/.test(ua) && !/chrome|chromium/.test(ua)) {
    platformInfo.value.browser = 'safari';
  } else if (/opera|opr/.test(ua)) {
    platformInfo.value.browser = 'opera';
  } else if (/msie|trident/.test(ua)) {
    platformInfo.value.browser = 'ie';
  }

  // Extract version number
  let versionMatch;
  if (platformInfo.value.browser === 'firefox' && /fxios\/([\\d.]+)/.test(ua)) {
    versionMatch = ua.match(/fxios\/([\\d.]+)/);
  } else if (platformInfo.value.browser === 'chrome' && /crios\/([\\d.]+)/.test(ua)) {
    versionMatch = ua.match(/crios\/([\\d.]+)/);
  } else {
    versionMatch = ua.match(new RegExp(`${platformInfo.value.browser}\\/([\\d.]+)`));
  }
  
  if (versionMatch && versionMatch[1]) {
    platformInfo.value.version = versionMatch[1];
  }
  
  // Try to use more modern userAgentData if available
  if (navigator.userAgentData) {
    try {
      // This is a more modern API but not available in all browsers
      logEvent('INFO', 'Using modern userAgentData API for detection');
      navigator.userAgentData.getHighEntropyValues(['platform', 'platformVersion'])
        .then(data => {
          logEvent('INFO', `Platform from userAgentData: ${data.platform}`);
          // Could update with more detailed information here if needed
        })
        .catch(err => {
          logEvent('WARNING', `Failed to get high entropy values: ${err}`);
        });
    } catch (e) {
      logEvent('WARNING', `Error accessing userAgentData: ${e}`);
    }
  }
  
  logEvent('INFO', `Platform detected: ${JSON.stringify(platformInfo.value)}`);
};

// Track user engagement
const trackUserEngagement = () => {
  engagementLevel.value += 1;
  
  // Log engagement milestone events
  if (engagementLevel.value === 1 || engagementLevel.value % 5 === 0) {
    logEvent('ENGAGEMENT', `User engagement level: ${engagementLevel.value}`);
  }
  
  // Check if we've reached minimum engagement level for install prompt
  if (engagementLevel.value === props.minEngagementLevel) {
    logEvent('ENGAGEMENT', `Minimum engagement level (${props.minEngagementLevel}) reached`);
    checkPwaEligibility();
  }
};

// Check for stored preference
const hasUserDismissedPrompt = (): boolean => {
  // Check for localStorage availability (SSR safeguard)
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return false;
  }
  
  if (localStorage.getItem('pwa-prompt-dismissed') !== 'true') {
    return false;
  }
  
  // Check if dismissal period has expired
  if (hasDismissalPeriodExpired()) {
    // Clear the dismissal if period has expired
    localStorage.removeItem('pwa-prompt-dismissed');
    localStorage.removeItem('pwa-prompt-dismissed-time');
    logEvent('INFO', `Dismissal period of ${props.dismissalPeriod} days has expired, prompt can be shown again`);
    return false;
  }
  
  return true;
};

const setPromptDismissed = (): void => {
  const now = new Date().getTime();
  localStorage.setItem('pwa-prompt-dismissed', 'true');
  localStorage.setItem('pwa-prompt-dismissed-time', now.toString());
  
  logEvent('USER', `User dismissed install prompt. Will not show again for ${props.dismissalPeriod} days`);
};

// Check if the dismissal period has expired
const hasDismissalPeriodExpired = (): boolean => {
  // Check for localStorage availability (SSR safeguard)
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return true; // Default to expired in SSR context
  }
  
  const dismissedTime = localStorage.getItem('pwa-prompt-dismissed-time');
  if (!dismissedTime) return true;
  
  const now = new Date().getTime();
  const dismissedAt = parseInt(dismissedTime, 10);
  const daysSinceDismissal = (now - dismissedAt) / (24 * 60 * 60 * 1000);
  
  return daysSinceDismissal >= props.dismissalPeriod;
};

// Handle the beforeinstallprompt event
const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent): void => {
  // Prevent the default browser prompt
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt.value = e;
  promptAvailable.value = true;
  
  logEvent('SYSTEM', 'beforeinstallprompt event captured');
  logEvent('SYSTEM', 'Chrome native install prompt is now available');
  
  // Update status message
  statusMessage.value = 'Ready to install (Chrome native prompt available)';
  
  // Check if we should show the prompt
  evaluateShowPrompt();
  
  // Log additional debug info about the prompt
  if (debugMode.value) {
    logEvent('DEBUG', `Install prompt platforms: ${e.platforms.join(', ')}`);
    logEvent('DEBUG', 'Chrome is now offering to install this PWA');
  }
};

// Evaluate whether to show prompt based on conditions
const evaluateShowPrompt = (): void => {
  // Don't show if already installed
  if (isStandalone.value) {
    logEvent('INFO', 'Not showing prompt - app already installed');
    return;
  }
  
  // Don't show if user previously dismissed
  if (hasUserDismissedPrompt()) {
    logEvent('INFO', 'Not showing prompt - user previously dismissed');
    return;
  }
  
  // Don't show if we've already triggered install
  if (installPromptCalled.value) {
    logEvent('INFO', 'Not showing prompt - install already triggered');
    return;
  }
  
  // Check engagement level
  if (engagementLevel.value < props.minEngagementLevel) {
    logEvent('INFO', `Not showing prompt - insufficient engagement (${engagementLevel.value}/${props.minEngagementLevel})`);
    return;
  }
  
  // CRITICAL: Only show if we have Chrome's native prompt available
  if (!deferredPrompt.value) {
    logEvent('INFO', 'Not showing prompt - Chrome native prompt not available');
    return;
  }
  
  // All checks passed, show the prompt
  logEvent('ACTION', 'Showing installation prompt - Chrome native prompt is available');
  showInstallPrompt.value = true;
};

// Watch for prompt availability
watch(promptAvailable, (newValue) => {
  if (newValue) {
    logEvent('STATE', 'Install prompt now available');
    evaluateShowPrompt();
  }
});

// Handle app installed event
const handleAppInstalled = (): void => {
  // Hide the prompt after successful installation
  showInstallPrompt.value = false;
  deferredPrompt.value = null;
  promptAvailable.value = false;
  isStandalone.value = true;
  
  logEvent('SYSTEM', 'App was installed successfully');
  
  // Update status
  statusMessage.value = 'App installed successfully';
};

const checkIfStandalone = () => {
  if (typeof window === 'undefined') return false;
  
  // Various ways to detect standalone mode
  const isStandalone = 
    window.matchMedia('(display-mode: standalone)').matches || 
    window.matchMedia('(display-mode: fullscreen)').matches ||
    // For iOS Safari
    (navigator as any).standalone ||
    // For Android
    document.referrer.includes('android-app://');
    
  return isStandalone;
};

// Comprehensive PWA eligibility check
const checkPwaEligibility = () => {
  const diagnostics: string[] = [];
  let eligible = true;
  
  // Check for window/navigator availability (SSR safeguard)
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    diagnostics.push("Running in SSR mode - PWA features unavailable");
    issues.value = diagnostics;
    installEligible.value = false;
    statusMessage.value = 'Cannot check eligibility (SSR)';
    return false;
  }
  
  // Is app already installed?
  if (isStandalone.value) {
    diagnostics.push("App is already installed in standalone mode");
    eligible = false;
  }
  
  // Check for service worker support
  const hasServiceWorker = 'serviceWorker' in navigator;
  if (!hasServiceWorker) {
    diagnostics.push("Service Worker API not supported");
    eligible = false;
  }
  
  // Check for manifest
  const hasManifest = !!document.querySelector('link[rel="manifest"]');
  if (!hasManifest) {
    diagnostics.push("Missing web app manifest");
    eligible = false;
  }
  
  // Check for HTTPS
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    diagnostics.push("Not running on HTTPS (required for PWA)");
    eligible = false;
  }

  // Check browser support
  if (platformInfo.value.browser === 'ie') {
    diagnostics.push("Internet Explorer doesn't support PWAs");
    eligible = false;
  }
  
  // Advanced browser compatibility checks
  if (props.advancedChecks) {
    if (platformInfo.value.browser === 'safari' && !platformInfo.value.isIOS) {
      diagnostics.push("Desktop Safari has limited PWA support");
      eligible = false;
    }
    
    if (platformInfo.value.browser === 'firefox') {
      diagnostics.push("Firefox has limited PWA support");
      // Don't set eligible to false as Firefox can still install PWAs, just with limited functionality
    }
    
    // Check for Chrome/Edge version compatibility
    if (['chrome', 'edge'].includes(platformInfo.value.browser)) {
      const version = parseFloat(platformInfo.value.version);
      if (platformInfo.value.browser === 'chrome' && version < 76) {
        diagnostics.push(`Chrome version ${version} has limited PWA support (recommend v76+)`);
      } else if (platformInfo.value.browser === 'edge' && version < 79) {
        diagnostics.push(`Edge version ${version} has limited PWA support (recommend v79+)`);
      }
    }
  }
  
  // Check engagement level
  if (engagementLevel.value < props.minEngagementLevel) {
    diagnostics.push(`Insufficient user engagement (${engagementLevel.value}/${props.minEngagementLevel})`);
    eligible = false;
  }
  
  // Check if user has dismissed the prompt recently
  if (hasUserDismissedPrompt()) {
    const dismissedTime = localStorage.getItem('pwa-prompt-dismissed-time');
    if (dismissedTime) {
      const dismissedDate = new Date(parseInt(dismissedTime, 10));
      diagnostics.push(`User dismissed prompt on ${dismissedDate.toLocaleDateString()}`);
      eligible = false;
    } else {
      diagnostics.push(`User previously dismissed prompt`);
      eligible = false;
    }
  }
  
  // Update component state
  issues.value = diagnostics;
  installEligible.value = eligible;
  
  if (eligible) {
    logEvent('CHECK', 'App is eligible for installation');
    statusMessage.value = deferredPrompt.value ? 'Ready to install' : 'Waiting for browser prompt';
  } else {
    logEvent('CHECK', `App is not eligible for installation: ${diagnostics.join(', ')}`);
    statusMessage.value = 'Not eligible for installation';
  }
  
  return eligible;
};

// Show appropriate instructions based on platform
const showAppropriateInstructions = () => {
  // Don't show instructions if already in standalone mode
  if (isStandalone.value) {
    logEvent('ACTION', 'Not showing instructions - app already installed');
    return;
  }
  
  customInstructionsShown.value = true;
  
  if (platformInfo.value.isIOS) {
    logEvent('ACTION', 'Showing iOS installation instructions');
    showIOSInstructions.value = true;
    showAndroidInstructions.value = false;
    showDesktopInstructions.value = false;
  } else if (platformInfo.value.isAndroid) {
    logEvent('ACTION', 'Showing Android installation instructions');
    showIOSInstructions.value = false;
    showAndroidInstructions.value = true;
    showDesktopInstructions.value = false;
  } else if (platformInfo.value.isDesktop) {
    logEvent('ACTION', `Showing Desktop (${platformInfo.value.browser}) installation instructions`);
    showIOSInstructions.value = false;
    showAndroidInstructions.value = false;
    showDesktopInstructions.value = true;
  }
};

// Simulate beforeinstallprompt event for testing
const simulateBeforeInstallPrompt = () => {
  if (!debugMode.value) return;
  
  logEvent('DEBUG', 'Simulating beforeinstallprompt event');
  
  // Create a mock event
  const mockEvent = new Event('beforeinstallprompt') as BeforeInstallPromptEvent;
  
  // Add required properties
  Object.defineProperties(mockEvent, {
    platforms: {
      value: ['web'],
      configurable: true
    },
    prompt: {
      value: async () => {
        logEvent('DEBUG', 'Mock prompt() called');
        return Promise.resolve();
      },
      configurable: true
    },
    userChoice: {
      value: Promise.resolve({
        outcome: 'accepted',
        platform: 'web'
      }),
      configurable: true
    }
  });
  
  // Handle the mock event
  handleBeforeInstallPrompt(mockEvent);
};

// Install the PWA
const installPwa = async (): Promise<void> => {
  logEvent('ACTION', 'Install PWA function called');
  
  // For iOS - always show manual instructions
  if (platformInfo.value.isIOS) {
    logEvent('ACTION', 'iOS detected - showing manual instructions');
    showIOSInstructions.value = true;
    return;
  }
  
  // For browsers with limited PWA support - show manual instructions
  if (['firefox', 'safari'].includes(platformInfo.value.browser)) {
    logEvent('ACTION', `${platformInfo.value.browser} detected - showing manual instructions`);
    showAppropriateInstructions();
    return;
  }
  
  // For Chrome/Edge and other Chromium browsers - use the native install prompt
  if (deferredPrompt.value) {
    try {
      logEvent('ACTION', `Using native install prompt for ${platformInfo.value.browser}`);
      installPromptCalled.value = true;
      
      // Show the install prompt
      await deferredPrompt.value.prompt();
      logEvent('SYSTEM', 'Native installation prompt displayed');
      
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.value.userChoice;
      logEvent('USER', `User ${choiceResult.outcome} the installation`);
      
      // Reset prompt state
      deferredPrompt.value = null;
      promptAvailable.value = false;
      
      // Hide our UI
      showInstallPrompt.value = false;
      
      if (choiceResult.outcome === 'accepted') {
        logEvent('USER', 'User accepted the install prompt');
      } else {
        logEvent('USER', 'User dismissed the install prompt');
        setPromptDismissed();
      }
    } catch (error) {
      logEvent('ERROR', `Error showing install prompt: ${error}`);
      // Fallback to manual instructions if the prompt fails
      showAppropriateInstructions();
    }
  } else {
    // No deferred prompt available - show manual instructions
    logEvent('ACTION', 'No native install prompt available, showing manual instructions');
    showAppropriateInstructions();
    
    // Add diagnostic information
    checkPwaEligibility();
  }
};

// Dismiss the install prompt
const dismissPrompt = (): void => {
  showInstallPrompt.value = false;
  setPromptDismissed();
};

// Check for service worker updates
const checkForUpdates = async (): Promise<void> => {
  if (!registration.value) {
    logEvent('CHECK', 'Cannot check for updates - no service worker registration');
    return;
  }
  
  try {
    logEvent('CHECK', 'Checking for service worker updates');
    await registration.value.update();
    
    if (registration.value.waiting) {
      logEvent('UPDATE', 'New service worker version waiting to activate');
      updateAvailable.value = true;
    } else {
      logEvent('CHECK', 'No service worker updates available');
    }
  } catch (error) {
    logEvent('ERROR', `Failed to check for updates: ${error}`);
  }
};

// Add script to index.html to catch beforeinstallprompt before our component loads
const addEarlyEventCatcher = (): void => {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    logEvent('INFO', 'Cannot add early event catcher in SSR mode');
    return;
  }
  
  // Only add if it doesn't already exist
  if (!document.getElementById('pwa-early-event-catcher')) {
    const script = document.createElement('script');
    script.id = 'pwa-early-event-catcher';
    script.innerHTML = `
      // Catch the beforeinstallprompt event if it fires before our component loads
      window.addEventListener('beforeinstallprompt', function(e) {
        console.log('[PWA Early Catcher] Caught beforeinstallprompt event');
        e.preventDefault();
        // Store the event for later use
        window.deferredInstallPrompt = e;
      });
    `;
    
    // Add to head
    const head = document.head || document.getElementsByTagName('head')[0];
    if (head) {
      head.appendChild(script);
      logEvent('SETUP', 'Added early event catcher script to head');
    }
  }
};

// Update the PWA
const updatePwa = (): void => {
  if (!registration.value || !registration.value.waiting) {
    logEvent('ERROR', 'No waiting service worker found for update');
    return;
  }
  
  logEvent('ACTION', 'Updating service worker');
  
  // Send message to waiting service worker
  registration.value.waiting.postMessage({ type: 'SKIP_WAITING' });
  updateAvailable.value = false;
  
  // Reload the page to apply updates
  logEvent('ACTION', 'Reloading page to apply update');
  window.location.reload();
};

// Dismiss the update prompt
const dismissUpdate = (): void => {
  updateAvailable.value = false;
  logEvent('USER', 'User dismissed update prompt');
};

// Set up polling mechanism to check for browser support
const setupInstallabilityChecks = () => {
  // First check
  checkPwaEligibility();
  
  // Set up interval checks
  const checkInterval = setInterval(() => {
    if (!isStandalone.value && !installPromptCalled.value) {
      logEvent('CHECK', 'Polling for installation eligibility');

      isStandalone.value = checkIfStandalone();
      
      // Check if install conditions are met
      const isEligible = checkPwaEligibility();
      
      // If eligible but no prompt, and sufficient engagement, show our prompt
      // ONLY if we have Chrome's native prompt available
      if (isEligible && 
          engagementLevel.value >= props.minEngagementLevel && 
          !hasUserDismissedPrompt() && 
          !showInstallPrompt.value &&
          deferredPrompt.value) { // Only show if Chrome's prompt is available
        logEvent('ACTION', 'Conditions met for showing install prompt - Chrome native prompt is available');
        showInstallPrompt.value = true;
      } else if (isEligible &&
                engagementLevel.value >= props.minEngagementLevel &&
                !hasUserDismissedPrompt() &&
                !deferredPrompt.value) {
        logEvent('INFO', 'Eligible for installation but Chrome native prompt not available yet');

        if (platformInfo.value.isIOS || platformInfo.value.browser === 'firefox') {
          logEvent('ACTION', 'Showing manual installation instructions');
          showAppropriateInstructions();
        } else {
          logEvent('INFO', 'Eligible for installation but no prompt available yet');
        }
      }
    } else {
      // No need to keep checking if already installed or prompt has been handled
      clearInterval(checkInterval);
      logEvent('CHECK', 'Stopping installation eligibility polling');
    }
  }, props.installCheckInterval);
  
  // Clean up on unmount
  onUnmounted(() => {
    clearInterval(checkInterval);
  });
};

// Monitor service worker state changes
const monitorServiceWorkerState = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    serviceWorkerState.value = 'Window/Navigator not available (SSR)';
    return;
  }
  
  if (!('serviceWorker' in navigator)) {
    serviceWorkerState.value = 'Not Supported';
    logEvent('ERROR', 'Service Worker API not supported - PWA installation will not be available');
    return;
  }
  
  // Initial state
  if (navigator.serviceWorker.controller) {
    serviceWorkerState.value = 'Active';
  } else {
    serviceWorkerState.value = 'Registered but not controlling';
  }
  
  // Listen for changes
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    serviceWorkerState.value = 'Controller Changed';
    logEvent('SERVICE_WORKER', 'Service worker controller changed');
  });
  
  // Get registration status
  navigator.serviceWorker.ready.then((reg) => {
    registration.value = reg;
    
    if (reg.active) {
      serviceWorkerState.value = 'Ready';
      logEvent('SERVICE_WORKER', `Service worker active (scope: ${reg.scope})`);
      
      // Add additional logging to help understand when Chrome might show the install prompt
      logEvent('SERVICE_WORKER', 'Service worker is active, Chrome may now consider showing the install prompt');
      logEvent('SERVICE_WORKER', 'Check manifest.json and continue engaging with the site to trigger Chrome prompt');
    }
    
    if (reg.installing) {
      serviceWorkerState.value = 'Installing';
      logEvent('SERVICE_WORKER', 'Service worker installing');
      
      reg.installing.addEventListener('statechange', (e) => {
        if (e.target instanceof ServiceWorker) {
          serviceWorkerState.value = e.target.state;
          logEvent('SERVICE_WORKER', `Service worker state changed to: ${e.target.state}`);
          
          if (e.target.state === 'activated') {
            logEvent('SERVICE_WORKER', 'Service worker activated - PWA installation should now be possible');
          }
        }
      });
    }
    
    if (reg.waiting) {
      serviceWorkerState.value = 'Waiting';
      logEvent('SERVICE_WORKER', 'Service worker waiting to activate');
      updateAvailable.value = true;
    }
  }).catch(error => {
    serviceWorkerState.value = 'Registration Failed';
    logEvent('ERROR', `Service worker registration failed: ${error}`);
    logEvent('ERROR', 'PWA installation will not be available without a service worker');
  });
};

onMounted(() => {
  logEvent('LIFECYCLE', 'PWA Installer component mounted');
  
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    logEvent('ERROR', 'Window or navigator not available - likely running in SSR mode');
    return;
  }
  
  addEarlyEventCatcher();
  
  detectPlatform();
  
  document.addEventListener('click', trackUserEngagement);
  document.addEventListener('scroll', trackUserEngagement, { passive: true });
  
  // Check if already installed
  isStandalone.value = checkIfStandalone();
  
  if (isStandalone.value) {
    logEvent('INFO', 'App is already installed in standalone mode');
    statusMessage.value = 'App is already installed';
  }
  
  // IMPORTANT: Set up event listeners for installation events BEFORE doing anything else
  // This ensures we catch the beforeinstallprompt event if it fires
  logEvent('SETUP', 'Adding beforeinstallprompt event listener');
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.addEventListener('appinstalled', handleAppInstalled);
  
  // Check if we already missed the beforeinstallprompt event
  // Chrome sometimes fires it very early, even before our event listener is registered
  if (window.deferredInstallPrompt) {
    logEvent('RECOVERY', 'Recovered previously fired beforeinstallprompt event');
    handleBeforeInstallPrompt(window.deferredInstallPrompt);
    delete window.deferredInstallPrompt;
  }
  
  // Monitor service worker
  monitorServiceWorkerState();
  
  // Set up installability check polling
  setupInstallabilityChecks();
  
  // For Chrome/Edge - set a timed check for install readiness
  if (['chrome', 'edge'].includes(platformInfo.value.browser) && !isStandalone.value) {
    logEvent('TIMER', `Will check Chrome/Edge install eligibility after ${props.chromePromptDelay}ms`);
    
    setTimeout(() => {
      // Only show if not already installed and no prompt has been shown yet
      if (!isStandalone.value && !installPromptCalled.value && !hasUserDismissedPrompt()) {
        logEvent('TIMER', 'Chrome/Edge install eligibility check triggered');
        
        // ONLY show prompt if Chrome's native prompt is available
        if (deferredPrompt.value) {
          logEvent('ACTION', 'Chrome native install prompt is available - showing our prompt');
          showInstallPrompt.value = true;
        } else {
          // Check if we're eligible for installation
          const eligible = checkPwaEligibility();
          if (eligible && engagementLevel.value >= props.minEngagementLevel) {
            logEvent('INFO', 'Eligible for installation but Chrome native prompt not available - NOT showing any UI');
            // We no longer show anything if Chrome's prompt isn't available
          } else {
            logEvent('INFO', 'Not showing prompt after delay - conditions not met');
          }
        }
      }
    }, props.chromePromptDelay);
  }
  
  // For debug mode - add additional debugging features
  if (debugMode.value) {
    // Log all PWA-related info
    logEvent('DEBUG', 'Debug mode enabled');
    logEvent('DEBUG', `Running on ${window.location.protocol} (${window.location.hostname})`);
    logEvent('DEBUG', `User Agent: ${navigator.userAgent}`);
    
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      const manifestHref = manifestLink.getAttribute('href');
      if (manifestHref) {
        logEvent('DEBUG', `Manifest found: ${manifestHref}`);
        
        // Try to fetch manifest
        fetch(manifestHref)
          .then(response => response.json())
          .then(data => {
            logEvent('DEBUG', `Manifest content: ${JSON.stringify(data).substring(0, 100)}...`);
          })
          .catch(error => {
            logEvent('ERROR', `Error fetching manifest: ${error}`);
          });
      }
      
      // Force check PWA eligibility again after a short delay
      setTimeout(() => {
        checkPwaEligibility();
      }, 3000);
    }
}
});

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.removeEventListener('appinstalled', handleAppInstalled);
  document.removeEventListener('click', trackUserEngagement);
  document.removeEventListener('scroll', trackUserEngagement);
});
</script>
  
  <style scoped>
  .pwa-installer {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 500px;
    z-index: 9999;
  }
  
  .install-prompt, .update-prompt {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 16px;
    margin-bottom: 16px;
    animation: slide-up 0.3s ease-out;
  }
  
  .prompt-content {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .prompt-icon {
    font-size: 2rem;
    margin-right: 16px;
  }
  
  .prompt-text h3 {
    margin: 0 0 8px 0;
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  .prompt-text p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
  
  .prompt-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  
  button {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }
  
  .btn-install, .btn-update {
    background-color: #4285f4;
    color: white;
  }
  
  .btn-install:hover, .btn-update:hover {
    background-color: #3367d6;
  }
  
  .btn-dismiss {
    background-color: transparent;
    color: #666;
  }
  
  .btn-dismiss:hover {
    background-color: #f1f1f1;
  }
  
  /* Installation instructions modals */
  .pwa-install-instructions {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }
  
  .instruction-modal {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
  }
  
  .instruction-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: #f8f8f8;
    border-bottom: 1px solid #eee;
  }
  
  .instruction-header h3 {
    margin: 0;
    font-size: 18px;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }
  
  .instruction-content {
    padding: 16px;
  }
  
  .step {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .step-number {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #4285f4;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    margin-right: 12px;
    flex-shrink: 0;
  }
  
  .step-text {
    flex-grow: 1;
  }
  
  .step-image {
    font-size: 24px;
    margin-left: 12px;
    flex-shrink: 0;
  }
  
  /* Debug section styles */
  .debug-section {
    position: fixed;
    top: 200px;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    z-index: 10000;
  }
  
  .debug-button {
    padding: 8px 16px;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .status-indicator {
    padding: 8px;
    border-radius: 4px;
    color: white;
    background-color: rgba(0,0,0,0.7);
    min-width: 200px;
  }
  
  .status-ready {
    background-color: rgba(0,128,0,0.7);
  }
  
  .status-warning {
    background-color: rgba(255,165,0,0.7);
  }
  
  .status-pending {
    background-color: rgba(0,0,0,0.7);
  }
  
  .issues-list, .status-info {
    margin-top: 8px;
    font-size: 12px;
  }
  
  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .install-prompt, .update-prompt {
      background-color: #333;
      color: #fff;
    }
    
    .prompt-text p {
      color: #bbb;
    }
    
    .btn-dismiss {
      color: #ddd;
    }
    
    .btn-dismiss:hover {
      background-color: #444;
    }
    
    .instruction-modal {
      background-color: #333;
      color: #fff;
    }
    
    .instruction-header {
      background-color: #444;
      border-bottom: 1px solid #555;
    }
    
    .close-btn {
      color: #fff;
    }
  }
</style>