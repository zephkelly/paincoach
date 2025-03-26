<template>
    <div class="number-input-container input-wrapper flex-col">
        <label v-if="label" :for="id" class="input-label">{{ label }}</label>
        <div class="number-input-inner" :class="{ 'is-focused': isFocused }">
            <div class="input-wrapper-inner">
                <input
                    v-model="internalValue"
                    @update:modelValue="handleInput"
                    @input="updateModelValue"
                    :id="id"
                    :required="required"
                    type="number"
                    :tabindex="tabindex"
                    :disabled="disabled"
                    :readonly="readonly"
                    :placeholder="placeholder"
                    min="1"
                    ref="inputRef"
                    @keypress="validateKeyPress"
                    @focus="handleFocus"
                    @blur="handleBlur"
                >
                <div v-if="unit" class="unit-display">{{ unit }}</div>
            </div>
            <div v-if="showToggles" class="number-toggles" :class="{ 'is-focused': isFocused }">
                <button
                    type="button"
                    class="toggle-btn increment-btn"
                    @click="handleIncrement"
                    :disabled="disabled || readonly"
                >
                    <span class="toggle-icon">+</span>
                </button>
                <button
                    type="button"
                    class="toggle-btn decrement-btn"
                    @click="handleDecrement"
                    :disabled="disabled || readonly || internalValue <= 1"
                >
                    <span class="toggle-icon">-</span>
                </button>
            </div>
        </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { type InputProps } from '@@/layers/ember/types/input';
  
  type NumberInputProps = InputProps & {
    showToggles?: boolean;
    min?: number;
    unit?: string;
  }
  
  const props = withDefaults(defineProps<NumberInputProps>(), {
    showToggles: true,
    min: 1,
    unit: ''
  });
  
  // Properly declare all emitted events including 'blur'
  const emit = defineEmits<{
    'update:modelValue': [value: string | number];
    'blur': [event: FocusEvent];
  }>();
  
  // Use internal state to manage the value
  const internalValue = ref(props.modelValue || '');
  
  // Track focus state
  const isFocused = ref(false);
  
  // Watch for external changes to modelValue
  watch(() => props.modelValue, (newVal) => {
    internalValue.value = newVal;
  });
  
  // Handle focus and blur events
  const handleFocus = () => {
    isFocused.value = true;
  };
  
  const handleBlur = (event: FocusEvent) => {
    isFocused.value = false;
    emit('blur', event);
  };
  
  // Validate key press to only allow numbers
  const validateKeyPress = (event: KeyboardEvent) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    
    // Allow only digits 0-9
    if (!/^\d+$/.test(keyValue)) {
      event.preventDefault();
    }
  };
  
  // Handle input change
  const handleInput = (value: string | number) => {
    let numValue = typeof value === 'string' ? parseInt(value, 10) : value;
    
    // Ensure the value is at least the minimum
    if (isNaN(numValue) || numValue < props.min) {
      numValue = props.min;
    }
    
    internalValue.value = numValue;
    emit('update:modelValue', numValue);
  };

  function updateModelValue(event: Event) {
    const target = event.target as HTMLInputElement;
    let value = target.value;
    
    emit('update:modelValue', value);
  }
  
  // Increment and decrement functions with blur emission
  const increment = () => {
    const currentValue = parseInt(internalValue.value as string, 10) || 0;
    const newValue = currentValue + 1;
    internalValue.value = newValue;
    emit('update:modelValue', newValue);
  };
  
  const decrement = () => {
    const currentValue = parseInt(internalValue.value as string, 10) || 0;
    const newValue = Math.max(props.min, currentValue - 1);
    internalValue.value = newValue;
    emit('update:modelValue', newValue);
  };

  // Handle increment with blur event
  const handleIncrement = () => {
    increment();
    // Create and emit a synthetic blur event
    const syntheticEvent = new FocusEvent('blur');
    emit('blur', syntheticEvent);
  };

  // Handle decrement with blur event
  const handleDecrement = () => {
    decrement();
    // Create and emit a synthetic blur event
    const syntheticEvent = new FocusEvent('blur');
    emit('blur', syntheticEvent);
  };
  </script>
  
<style lang="scss" scoped>
.number-input-container {
    position: relative;
    display: flex;
}

.number-input-inner {
    position: relative;
    height: 35px;
    width: 100%;
    box-sizing: border-box;
    border-radius: 6px;
    background-color: var(--background-color);
    color: var(--text-color);
    font-size: 0.9rem;
    transition:
        background-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        border-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    margin: 0;
    display: flex;
    align-items: center;
}

.input-wrapper-inner {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
    height: 100%;
}

.unit-display {
    position: absolute;
    right: 8px;
    color: var(--text-6-color);
    font-size: 0.9rem;
    pointer-events: none;
    user-select: none;
}

input {
    background-color: transparent;
    border: 1px solid var(--border-5-color);
    border-right: none;
    padding: 0.5rem 0.8rem;
    color: var(--text-color);
    outline: none;
    flex: 1;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;

    /* Add padding-right when unit is present */
    &:not(:placeholder-shown) {
        padding-right: 2.5rem;
    }

    &::placeholder {
        color: var(--text-8-color);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &:focus, &:active {
        border-color: var(--border-2-color);
    }

    &.is-invalid {
        border-color: var(--error-color);
    }
}


label {
    font-size: 0.8rem;
    color: var(--text-6-color);
    line-height: 1.5;
}
  
.number-toggles {
    height: 100%;
    right: 0;
    top: 0px;
    bottom: 0px;
    display: flex;
    flex-direction: column;
    z-index: 10;
    border: 1px solid var(--border-5-color);
    border-left-color: var(--border-3-color);
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    box-sizing: border-box;
    overflow: hidden;
    transition: border-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    
    &.is-focused {
        border-color: var(--border-2-color);
    }
}
  
.toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 100%;
    
    border: none;
    background-color: var(--background-4-color);
    cursor: pointer;
    padding: 0;
    color: var(--text-4-color);


    &:first-child {
        border-bottom: 1px solid var(--border-3-color);
    }

    &:last-child {

        .toggle-icon {
            font-size: 16px;
        }
    }

    
    &:hover:not(:disabled) {
        background-color: var(--background-6-color);
    }
    
    &:disabled {
        background-color: var(--background-2-color);
        cursor: not-allowed;

        .toggle-icon {
            opacity: 0.2;
        }
    }


}
  
.toggle-icon {
    font-size: 10px;
    line-height: 1;
    transition: opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
}
  
:deep() {
    input {
        /* Base input styling */
        width: 100%;
    }
    
    /* Target Firefox spinner buttons */
    input[type="number"] {
        /* Remove default appearance */
        -moz-appearance: textfield;
        
        /* Disable spinner buttons for all browsers */
        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        
        &::-moz-inner-spin-button {
            -moz-appearance: none;
        }
    }
}
</style>