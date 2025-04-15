interface UseHapticsReturn {
  // State
  isSupported: Ref<boolean>;
  isIOS: Ref<boolean>;
  isInitialized: Ref<boolean>;
  
  // Methods
  initialize: () => void;
  lightImpact: () => void;
  mediumImpact: () => void;
  heavyImpact: () => void;
  selectionFeedback: () => void;
  successNotification: () => void;
  warningNotification: () => void;
  errorNotification: () => void;
  customVibration: (pattern: number | number[]) => void;
}

/**
 * Vue composable for haptic feedback on iOS devices
 * @returns Haptic feedback methods and state
 */
export function useHaptics(): UseHapticsReturn {
  const isSupported: Ref<boolean> = ref(false)
  const isIOS: Ref<boolean> = ref(false)
  const isInitialized: Ref<boolean> = ref(false)

  /**
   * Check if the current device is running iOS
   * @returns Whether the device is iOS
   */
  const checkIsIOS = (): boolean => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent) && !(window as any).MSStream
  }

  /**
   * Check if the device supports haptic feedback
   * @returns Whether haptic feedback is supported
   */
  const checkSupport = (): boolean => {
    return 'vibrate' in navigator || 'Vibrate' in navigator
  }

  /**
   * Initialize haptics system - should be called on user interaction
   */
  const initialize = (): void => {
    if (isSupported.value && isIOS.value && !isInitialized.value) {
      // Trigger a very subtle initial vibration to "wake up" the haptics
      navigator.vibrate(1)
      isInitialized.value = true
      console.log('Haptics initialized')
    }
  }

  /**
   * Trigger a light impact feedback
   * Similar to iOS UIImpactFeedbackGenerator with light style
   */
  const lightImpact = (): void => {
    if (!isSupported.value) return
    if (isIOS.value) {
      navigator.vibrate(10)
    }
  }

  /**
   * Trigger a medium impact feedback
   * Similar to iOS UIImpactFeedbackGenerator with medium style
   */
  const mediumImpact = (): void => {
    if (!isSupported.value) return
    if (isIOS.value) {
      navigator.vibrate(20)
    }
  }

  /**
   * Trigger a heavy impact feedback
   * Similar to iOS UIImpactFeedbackGenerator with heavy style
   */
  const heavyImpact = (): void => {
    if (!isSupported.value) return
    if (isIOS.value) {
      navigator.vibrate(30)
    }
  }

  /**
   * Trigger a selection feedback
   * Similar to iOS UISelectionFeedbackGenerator
   */
  const selectionFeedback = (): void => {
    if (!isSupported.value) return
    if (isIOS.value) {
      navigator.vibrate([10, 30, 10])
    }
  }

  /**
   * Trigger a success notification feedback
   * Similar to iOS UINotificationFeedbackGenerator success type
   */
  const successNotification = (): void => {
    if (!isSupported.value) return
    if (isIOS.value) {
      navigator.vibrate([10, 30, 10, 30, 10])
    }
  }

  /**
   * Trigger a warning notification feedback
   * Similar to iOS UINotificationFeedbackGenerator warning type
   */
  const warningNotification = (): void => {
    if (!isSupported.value) return
    if (isIOS.value) {
      navigator.vibrate([10, 30, 30, 30, 10])
    }
  }

  /**
   * Trigger an error notification feedback
   * Similar to iOS UINotificationFeedbackGenerator error type
   */
  const errorNotification = (): void => {
    if (!isSupported.value) return
    if (isIOS.value) {
      navigator.vibrate([10, 30, 10, 30, 30, 30, 10])
    }
  }

  /**
   * Trigger a custom pattern vibration
   * @param pattern - Either a number for duration or an array of durations
   */
  const customVibration = (pattern: number | number[]): void => {
    if (!isSupported.value) return
    if (isIOS.value) {
      navigator.vibrate(pattern)
    }
  }

  /**
   * Setup auto-initialization on first user interaction
   */
  const setupAutoInitialize = (): void => {
    if (isSupported.value && isIOS.value && !isInitialized.value) {
      document.body.addEventListener('touchstart', () => {
        initialize()
      }, { once: true })
    }
  }

  // Initialize values when the component mounts
  onMounted(() => {
    isIOS.value = checkIsIOS()
    isSupported.value = checkSupport()
    
    // Auto-initialize on first interaction
    setupAutoInitialize()
  })

  return {
    // States
    isSupported,
    isIOS,
    isInitialized,
    
    // Methods
    initialize,
    lightImpact,
    mediumImpact,
    heavyImpact,
    selectionFeedback,
    successNotification,
    warningNotification,
    errorNotification,
    customVibration
  }
}

// Example usage in a Vue component:
/* 
<script setup lang="ts">
import { useHaptics } from '@/composables/useHaptics'

const { 
  isSupported, 
  isIOS, 
  mediumImpact, 
  selectionFeedback,
  successNotification 
} = useHaptics()

const handleButtonClick = (): void => {
  mediumImpact()
  // Other button actions...
}

const handleToggleChange = (): void => {
  selectionFeedback()
  // Other toggle actions...
}

const handleFormSubmit = (): void => {
  // Process form...
  successNotification()
}
</script>

<template>
  <div>
    <div v-if="isSupported && isIOS" class="info-banner">
      Haptic feedback is available on this device
    </div>
    
    <button @click="handleButtonClick" class="action-button">
      Click Me
    </button>
    
    <div class="toggle-container">
      <input type="checkbox" @change="handleToggleChange" />
      <span>Toggle with haptic feedback</span>
    </div>
    
    <form @submit.prevent="handleFormSubmit">
      <!-- Form fields -->
      <button type="submit">Submit with haptic feedback</button>
    </form>
  </div>
</template>
*/