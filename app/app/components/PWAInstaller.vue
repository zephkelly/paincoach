<template>
    <div class="pwa-installer" v-if="showInstallPrompt || updateAvailable">
      <div v-if="showInstallPrompt" class="install-prompt">
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
    </div>
  </template>
  
  <script lang="ts">
//   import apiService from '../services/ApiService';
  
  // Define type for BeforeInstallPromptEvent
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }
  
  // Extend Window interface for PWA installation
  declare global {
    interface WindowEventMap {
      'beforeinstallprompt': BeforeInstallPromptEvent;
      'appinstalled': Event;
    }
  }
  
  export default defineComponent({
    name: 'PwaInstaller',
    setup() {
      // State refs
      const showInstallPrompt = ref(false);
      const updateAvailable = ref(false);
      const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
      const registration = ref<ServiceWorkerRegistration | null>(null);
      
      // Check for stored preference
      const hasUserDismissedPrompt = (): boolean => {
        return localStorage.getItem('pwa-prompt-dismissed') === 'true';
      };
      
      const setPromptDismissed = (): void => {
        localStorage.setItem('pwa-prompt-dismissed', 'true');
        // Reset after 7 days
        setTimeout(() => {
          localStorage.removeItem('pwa-prompt-dismissed');
        }, 7 * 24 * 60 * 60 * 1000);
      };
      
      // Handle the beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent): void => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        
        // Stash the event so it can be triggered later
        deferredPrompt.value = e;
        
        // Only show if the user hasn't dismissed before
        if (!hasUserDismissedPrompt()) {
          showInstallPrompt.value = true;
        }
      };
      
      // Handle app installed event
      const handleAppInstalled = (): void => {
        // Hide the prompt after successful installation
        showInstallPrompt.value = false;
        deferredPrompt.value = null;
        
        // Log the installation
        console.log('PWA was installed');
        
        // You can show a success message or track installation analytics here
      };
      
      // Install the PWA
      const installPwa = async (): Promise<void> => {
        if (!deferredPrompt.value) {
          return;
        }
        
        // Show the install prompt
        deferredPrompt.value.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.value.userChoice;
        
        // The deferredPrompt can only be used once
        deferredPrompt.value = null;
        
        // Hide our UI
        showInstallPrompt.value = false;
        
        console.log(`User response to the install prompt: ${outcome}`);
      };
      
      // Dismiss the install prompt
      const dismissPrompt = (): void => {
        showInstallPrompt.value = false;
        setPromptDismissed();
      };
      
      // Check for service worker updates
      const checkForUpdates = async (): Promise<void> => {
        if (!registration.value) {
          return;
        }
        
        try {
          await registration.value.update();
          
          if (registration.value.waiting) {
            updateAvailable.value = true;
          }
        } catch (error) {
          console.error('Failed to check for updates', error);
        }
      };
      
      // Update the PWA
      const updatePwa = (): void => {
        if (!registration.value || !registration.value.waiting) {
          return;
        }
        
        // Send a message to the waiting service worker to activate
        registration.value.waiting.postMessage({ type: 'SKIP_WAITING' });
        updateAvailable.value = false;
      };
      
      // Dismiss the update prompt
      const dismissUpdate = (): void => {
        updateAvailable.value = false;
      };
      
      // Lifecycle hooks
      onMounted(async () => {
        // Set up event listeners
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
        
        // Get the service worker registration
        if ('serviceWorker' in navigator) {
          try {
            registration.value = await navigator.serviceWorker.ready;
            
            // Set up update checking
            if (registration.value) {
              // Check for waiting service worker
              if (registration.value.waiting) {
                updateAvailable.value = true;
              }
              
              // Check for updates every hour
              setInterval(checkForUpdates, 60 * 60 * 1000);
            }
          } catch (error) {
            console.error('Failed to get service worker registration', error);
          }
        }
      });
      
      onUnmounted(() => {
        // Clean up event listeners
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      });
      
      return {
        showInstallPrompt,
        updateAvailable,
        installPwa,
        dismissPrompt,
        updatePwa,
        dismissUpdate
      };
    }
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
  }
  </style>