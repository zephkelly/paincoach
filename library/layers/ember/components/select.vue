<template>
    <div class="select-wrapper e-select" :class="[{ 'readonly': readonly }, { 'disabled': disabled }]">
      <label v-if="label" :for="id" class="select-label">{{ label }}</label>
      <div class="select-container" :class="{ 'open': isOpen, 'is-touched': touched }">
        <div 
          class="selected-option" 
          @click="toggleDropdown"
          :tabindex="tabindex"
          :id="id"
          ref="selectRef"
        >
          <span v-if="selectedLabel">{{ selectedLabel }}</span>
          <span v-else class="placeholder">{{ placeholder || 'Select an option' }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-icon">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <div class="options-container" v-if="isOpen">
          <div 
            v-for="(option, index) in normalizedOptions" 
            :key="index" 
            class="option"
            :class="{ 'selected': option.value === modelValue }"
            @click="selectOption(option.value)"
          >
            {{ option.label }}
          </div>
        </div>
      </div>
      <!-- <div v-if="validationMessage && validationMessage.length > 0" class="error-message">
        {{ validationMessage }}
      </div> -->
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
  
  type SelectOption = {
    label: string;
    value: string;
  };
  
  type SelectProps = {
    id: string;
    label?: string;
    modelValue?: string;
    options: Array<string | SelectOption>;
    placeholder?: string;
    required?: boolean;
    tabindex?: number;
    disabled?: boolean;
    readonly?: boolean;
    default?: string;
    validateOnSelect?: boolean;
    forceInvalid?: boolean;
    customValidationMessage?: string;
  };
  
  const props = defineProps<SelectProps>();
  const emit = defineEmits(['update:modelValue', 'blur', 'valid', 'invalid']);
  
  const selectRef = ref<HTMLElement | null>(null);
  const isOpen = ref(false);
  const touched = ref(false);
  const dirtyValue = ref(false);
  const customInvalid = ref(false);
  
  // Normalize options to always have label and value
  const normalizedOptions = computed<SelectOption[]>(() => {
    return props.options.map(option => {
      if (typeof option === 'string') {
        return { label: option, value: option };
      }
      return option;
    });
  });
  
  // Find the label that corresponds to the current value
  const selectedLabel = computed(() => {
    if (!props.modelValue) return '';
    
    const selectedOption = normalizedOptions.value.find(option => 
      option.value === props.modelValue
    );
    
    return selectedOption ? selectedOption.label : '';
  });
  
  // Toggle dropdown open/closed
  function toggleDropdown() {
    if (props.disabled || props.readonly) return;
    isOpen.value = !isOpen.value;
    
    if (isOpen.value) {
      // Bind the close event when opening
      document.addEventListener('click', closeDropdownOnOutsideClick);
    }
  }
  
  // Close dropdown when clicking outside
  function closeDropdownOnOutsideClick(event: MouseEvent) {
    if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
      isOpen.value = false;
      document.removeEventListener('click', closeDropdownOnOutsideClick);
      handleBlur();
    }
  }
  
  // Select an option
  function selectOption(value: string) {
    emit('update:modelValue', value);
    isOpen.value = false;
    dirtyValue.value = true;
    document.removeEventListener('click', closeDropdownOnOutsideClick);
  }
  
  // Handle validation on blur
  function handleBlur() {
    touched.value = true;
    emit('blur');
  }
  
  // Set default value if provided and modelValue is undefined
  onMounted(() => {
    if (props.default !== undefined && props.modelValue === undefined) {
      emit('update:modelValue', props.default);
    }
  });
  
  // Cleanup event listeners
  onBeforeUnmount(() => {
    document.removeEventListener('click', closeDropdownOnOutsideClick);
  });
  
  // Public method to reset the field
  function reset() {
    touched.value = false;
    dirtyValue.value = false;
    customInvalid.value = false;
    isOpen.value = false;
  }
  
  // Define exposed methods
  defineExpose({
    reset,
    selectElement: selectRef
  });
  
  // Validate initial state if needed
  onMounted(() => {
    if (props.forceInvalid) {
      touched.value = true;
    }
  });
  </script>
  
  <style lang="scss" scoped>
  .select-wrapper {
    position: relative;
    width: 100%;
  
    &.readonly {
      pointer-events: none;
  
      .selected-option {
        color: var(--text-8-color);
        background-color: var(--background-4-color);
        border-color: var(--border-5-color);
      }
    }
  
    &.disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }
  
  .select-label {
    font-size: 0.8rem;
    color: var(--text-6-color);
    line-height: 1.5;
  }
  
  .select-container {
    position: relative;
    width: 100%;
    
    &.open .dropdown-icon {
      transform: rotate(180deg);
    }
  }
  
  .selected-option {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--border-5-color);
    border-radius: 6px;
    padding: 0.5rem 0.8rem;
    background-color: var(--background-color);
    color: var(--text-color);
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition:
      background-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
      color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
      border-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    
    &:hover {
      border-color: var(--border-3-color);
    }
    
    &:focus, 
    &:active {
      border-color: var(--border-2-color);
      outline: none;
    }
  
    .placeholder {
      color: var(--text-8-color);
    }
  
    .dropdown-icon {
      transition: transform 0.3s ease;
    }
  }
  
  .options-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 200px;
    overflow-y: auto;
    background-color: var(--background-color);
    border: 1px solid var(--border-5-color);
    border-radius: 6px;
    margin-top: 4px;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .option {
    padding: 0.5rem 0.8rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: var(--background-2-color);
    }
    
    &.selected {
      background-color: var(--background-3-color);
      font-weight: 500;
    }
  }
  
  .error-message {
    color: var(--error-color);
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
  </style>