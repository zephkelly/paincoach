export default defineNuxtPlugin(() => {
    console.log('Service worker plugin initialized');
    
    if (!('serviceWorker' in navigator)) {
      console.error('Service Worker API not supported');
      return;
    }
    
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registration successful with scope:', registration.scope);
        
        // Tell the PWA installer component that the service worker is registered
        window.dispatchEvent(new CustomEvent('serviceworkerregistered', { 
          detail: { registration }
        }));
        
        return registration;
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
        return null;
      }
    };
    
    // Register immediately, don't wait for load event which might be unreliable
    registerServiceWorker();
  })