<!-- components/EMultiSelect.vue -->
<template>
    <div class="multiselect-wrapper e-multiselect" :class="[{ 'readonly': readonly }, { 'disabled': disabled }]">
      <label v-if="label" :for="id" class="multiselect-label">
        {{ label }}
        <span v-if="required && (!modelValue || modelValue.length === 0)" class="required-indicator" aria-hidden="true">*</span>
      </label>
      <div class="multiselect-container" :class="{ 'open': isOpen, 'is-touched': touched }">
        <div 
          class="selected-options" 
          @click="toggleDropdown"
          :tabindex="tabindex"
          :id="id"
          ref="multiselectRef"
        >
          <!-- Show selected options as chips -->
          <div v-if="modelValue && modelValue.length > 0" class="chips-container">
            <div v-for="(value, index) in modelValue" :key="index" class="chip">
              {{ getOptionLabel(value) }}
              <button 
                type="button" 
                class="remove-chip" 
                @click.stop="removeOption(value)"
                aria-label="Remove option"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          <!-- Show placeholder or no option text when nothing is selected -->
          <span v-else class="placeholder">
            <template v-if="noOptionUndefined && normalizedModelValue.length === 0">{{ noOptionUndefined }}</template>
            <template v-else>{{ placeholder || '' }}</template>
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-icon">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
  
        <!-- Options dropdown with click-outside handling -->
        <div v-if="isOpen" class="options-dropdown-container" ref="optionsContainerRef">
          <div class="options-container">
            <!-- Regular Ungrouped Options First -->
            <template v-if="groupedOptions.ungrouped.length > 0">
              <div 
                v-for="(option, index) in groupedOptions.ungrouped" 
                :key="`ungrouped-${index}`" 
              >
                <!-- Render the option with potential children -->
                <NestedOption 
                  :option="option" 
                  :is-selected="isOptionSelected(option.value)"
                  :level="0"
                  :model-value="normalizedModelValue"
                  :exclusive-group-selections="exclusiveGroupSelections"
                  @toggle="toggleOption"
                />
              </div>
            </template>
            
            <!-- Divider if both types of options exist -->
            <div v-if="groupedOptions.ungrouped.length > 0 && Object.keys(groupedOptions.groups).length > 0" class="option-group-divider"></div>
            
            <!-- Exclusive Groups at the End -->
            <template v-for="(options, groupKey) in groupedOptions.groups" :key="groupKey">
              <div class="option-group-header">
                Select one {{ exclusiveGroupSelections[groupKey] ? '1/1' : '0/1' }}
              </div>
              <div 
                v-for="(option, optionIndex) in options" 
                :key="`group-${groupKey}-${optionIndex}`" 
              >
                <NestedOption 
                  :option="option" 
                  :is-selected="isOptionSelected(option.value)"
                  :is-disabled="Boolean(option.exclusiveKey && exclusiveGroupSelections[option.exclusiveKey] && !isOptionSelected(option.value))"
                  :level="0"
                  :model-value="normalizedModelValue"
                  :exclusive-key="option.exclusiveKey"
                  :exclusive-group-selections="exclusiveGroupSelections"
                  @toggle="toggleOption"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted, onBeforeUnmount, defineProps, defineEmits, defineExpose, nextTick } from 'vue';
  import NestedOption from './nestedOption.vue';
  
  type SelectOption = {
    label: string;
    value: string | null | undefined;
    exclusiveKey?: string;
    children?: SelectOption[];
    parentRequired?: boolean;
  };
  
  type MultiselectProps = {
    options: Array<string | SelectOption>;
    id: string;
    label?: string;
    modelValue?: Array<string | null | undefined>;
    placeholder?: string;
    required?: boolean;
    tabindex?: number;
    disabled?: boolean;
    readonly?: boolean;
    default?: Array<string | null | undefined>;
    validateOnSelect?: boolean;
    forceInvalid?: boolean;
    noOptionUndefined?: boolean | string; // Allow both boolean and string
  };
  
  const props = defineProps<MultiselectProps>();
  const emit = defineEmits(['update:modelValue', 'blur', 'valid', 'invalid']);
  
  const multiselectRef = ref<HTMLElement | null>(null);
  const optionsContainerRef = ref<HTMLElement | null>(null);
  const isOpen = ref(false);
  const touched = ref(false);
  const dirtyValue = ref(false);
  
  // Normalize options to always have label and value
  const normalizedOptions = computed<SelectOption[]>(() => {
    const result: SelectOption[] = [];
    
    // Add the regular options
    props.options.forEach(option => {
      if (typeof option === 'string') {
        result.push({ label: option, value: option });
      } else {
        result.push(option);
      }
    });
    
    return result;
  });
  
  // Group options by exclusiveKey
  const groupedOptions = computed(() => {
    const groups: { [key: string]: SelectOption[] } = {};
    const ungrouped: SelectOption[] = [];
    
    normalizedOptions.value.forEach(option => {
      if (option.exclusiveKey) {
        if (!groups[option.exclusiveKey]) {
          groups[option.exclusiveKey] = [];
        }
        groups[option.exclusiveKey]?.push(option);
      } else {
        ungrouped.push(option);
      }
    });
    
    return { groups, ungrouped };
  });
  
  // Check if an exclusive group has a selected item
  const exclusiveGroupSelections = computed(() => {
    const selections: { [key: string]: string | null | undefined } = {};
    
    if (props.modelValue) {
      normalizedOptions.value.forEach(option => {
        if (option.exclusiveKey && props.modelValue?.includes(option.value)) {
          selections[option.exclusiveKey] = option.value;
        }
      });
    }
    
    return selections;
  });
  
  // Ensure modelValue is always an array
  const normalizedModelValue = computed(() => {
    return props.modelValue || [];
  });
  
  // Recursive function to find an option by value in the nested structure
  function findOptionByValue(value: string | null | undefined, options: SelectOption[]): SelectOption | undefined {
    for (const option of options) {
      if (isOptionValueEqual(option.value, value)) {
        return option;
      }
      
      if (option.children && option.children.length > 0) {
        const found = findOptionByValue(value, option.children);
        if (found) {
          return found;
        }
      }
    }
    
    return undefined;
  }
  
  // Check if an option is currently selected
  function isOptionSelected(value: string | null | undefined): boolean {
    return normalizedModelValue.value.some(selectedValue => 
      isOptionValueEqual(value, selectedValue)
    );
  }
  
  // Get the label for a selected value by recursively searching through options
  function getOptionLabel(value: string | null | undefined): string {
    const option = findOptionByValue(value, normalizedOptions.value);
    return option ? option.label : String(value);
  }
  
  // Helper function to check equality between option values
  function isOptionValueEqual(optionValue: string | null | undefined, modelValue: string | null | undefined): boolean {
    // Handle undefined and null separately to ensure proper comparison
    if (optionValue === undefined && modelValue === undefined) return true;
    if (optionValue === null && modelValue === null) return true;
    
    // For all other cases, use regular equality
    return optionValue === modelValue;
  }
  
  // Toggle dropdown open/closed
  function toggleDropdown() {
    if (props.disabled || props.readonly) return;
    isOpen.value = !isOpen.value;
    
    if (isOpen.value) {
      // Set up click outside handler when dropdown opens
      nextTick(() => {
        document.addEventListener('click', handleClickOutside);
      });
    } else {
      // Remove click outside handler when dropdown closes
      document.removeEventListener('click', handleClickOutside);
      handleBlur();
    }
  }
  
  // Handle clicks outside the dropdown
  function handleClickOutside(event: MouseEvent) {
    const selectEl = multiselectRef.value;
    const dropdownEl = optionsContainerRef.value;
    
    if (!selectEl || !dropdownEl) return;
    
    // Only close the dropdown if the click is outside both the select and dropdown elements
    if (!selectEl.contains(event.target as Node) && !dropdownEl.contains(event.target as Node)) {
      isOpen.value = false;
      document.removeEventListener('click', handleClickOutside);
      handleBlur();
    }
  }
  
  // Toggle an option (both regular and exclusive)
  // Modified toggleOption function for EMultiSelect.vue
    function toggleOption(option: SelectOption) {
    // Check if the option is disabled (for exclusive options)
    if (option.exclusiveKey && 
        exclusiveGroupSelections.value[option.exclusiveKey] && 
        !isOptionSelected(option.value)) {
        return; // Do nothing if disabled
    }

    const currentValues = [...normalizedModelValue.value];
    
    // Check if option is already selected
    const existingIndex = currentValues.findIndex(selectedValue => 
        isOptionValueEqual(option.value, selectedValue)
    );
    
    if (existingIndex >= 0) {
        // Remove the value if already selected
        currentValues.splice(existingIndex, 1);
        
        // Additionally, find and remove any child options that have parentRequired set to true
        // This ensures that if a parent is deselected, any children that require the parent are also deselected
        checkAndRemoveChildrenRequiringParent(option, currentValues);
    } else {
        // If this option has parentRequired=true, ensure its parent is selected first
        if (option.parentRequired) {
        // Find the parent option recursively in our options
        const findParent = (opt: SelectOption, options: SelectOption[]): SelectOption | null => {
            for (const o of options) {
            if (o.children?.some(child => isOptionValueEqual(child.value, opt.value))) {
                return o;
            }
            if (o.children) {
                const parent = findParent(opt, o.children);
                if (parent) return parent;
            }
            }
            return null;
        };
        
        const parentOption = findParent(option, normalizedOptions.value);
        if (parentOption && !currentValues.some(value => isOptionValueEqual(value, parentOption.value))) {
            // Add the parent
            currentValues.push(parentOption.value);
        }
        }

        // Add the new value
        currentValues.push(option.value);
        
        // If this is an exclusive option, remove any other selected value from the same group
        if (option.exclusiveKey) {
        const otherSelectedIndices = currentValues.reduce((indices, selectedValue, index) => {
            const selectedOption = findOptionByValue(selectedValue, normalizedOptions.value);
            if (selectedOption && selectedOption.exclusiveKey === option.exclusiveKey && 
                !isOptionValueEqual(selectedOption.value, option.value)) {
            indices.push(index);
            }
            return indices;
        }, [] as number[]);
        
        // Remove in reverse order to avoid shifting indices
        for (let i = otherSelectedIndices.length - 1; i >= 0; i--) {
            const indices = otherSelectedIndices[i];
            if (indices !== undefined) {

                currentValues.splice(indices, 1);
            }
        }
        }
    }
    
    emit('update:modelValue', currentValues);
    dirtyValue.value = true;
    }
  
  // Check and remove child options when a parent is deselected
  function checkAndRemoveChildrenRequiringParent(parentOption: SelectOption, currentValues: Array<string | null | undefined>) {
    if (!parentOption.children || parentOption.children.length === 0) {
      return;
    }
    
    for (const child of parentOption.children) {
      if (child.parentRequired) {
        // Find and remove this child from the values
        const childIndex = currentValues.findIndex(value => isOptionValueEqual(child.value, value));
        if (childIndex >= 0) {
          currentValues.splice(childIndex, 1);
        }
      }
      
      // Recursively check this child's children
      if (child.children && child.children.length > 0) {
        checkAndRemoveChildrenRequiringParent(child, currentValues);
      }
    }
  }
  
  // Remove a selected option
  function removeOption(value: string | null | undefined) {
    const currentValues = [...normalizedModelValue.value];
    
    const existingIndex = currentValues.findIndex(selectedValue => 
      isOptionValueEqual(value, selectedValue)
    );
    
    if (existingIndex >= 0) {
      // Find the actual option to pass to toggleOption
      const option = findOptionByValue(value, normalizedOptions.value);
      if (option) {
        toggleOption(option);
      } else {
        // Fallback if option not found
        currentValues.splice(existingIndex, 1);
        emit('update:modelValue', currentValues);
      }
      dirtyValue.value = true;
    }
  }
  
  // Handle validation on blur
  function handleBlur() {
    touched.value = true;
    emit('blur');
  }
  
  // Set default value if provided and modelValue is undefined
  onMounted(() => {
    if (props.default && (!props.modelValue || props.modelValue.length === 0)) {
      emit('update:modelValue', props.default);
    }
  });
  
  // Cleanup event listeners
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
  
  // Public method to reset the field
  function reset() {
    touched.value = false;
    dirtyValue.value = false;
    isOpen.value = false;
  }
  
  // Define exposed methods
  defineExpose({
    reset,
    multiselectElement: multiselectRef
  });
  
  // Validate initial state if needed
  onMounted(() => {
    if (props.forceInvalid) {
      touched.value = true;
    }
  });
  </script>
  
  <style lang="scss" scoped>
  .multiselect-wrapper {
    display: flex;
    position: relative;
    width: 100%;
    min-height: 40px;
  
    &.readonly {
      pointer-events: none;
  
      .selected-options {
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
  
  .multiselect-label {
    position: relative;
    display: flex;
    flex-direction: row;
    font-size: 0.8rem;
    color: var(--text-6-color);
    line-height: 1.5;
    max-height: 20px;
  }
  
  .required-indicator {
    color: var(--error-color);
    margin-left: 0.25rem;
    font-size: 0.9rem;
    font-weight: bold;
  }
  
  .multiselect-container {
    display: flex;
    flex-grow: 1;
    position: relative;
    width: 100%;
    
    &.open .dropdown-icon {
      transform: rotate(180deg);
    }
  }
  
  .selected-options {
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
    min-height: 38px;
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
      transition: transform 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
      margin-left: 8px;
      flex-shrink: 0;
    }
  }
  
  .chips-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    flex: 1;
  }
  
  .chip {
    display: flex;
    align-items: center;
    background-color: var(--background-3-color);
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 0.8rem;
    white-space: nowrap;
    
    .remove-chip {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 4px;
      background: none;
      border: none;
      padding: 2px;
      cursor: pointer;
      border-radius: 50%;
      color: var(--text-6-color);
      transition: color 0.2s ease, background-color 0.2s ease;
      
      &:hover {
        color: var(--text-3-color);
        background-color: var(--background-4-color);
      }
    }
  }
  
  .options-dropdown-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 10;
    margin-top: 4px;
  }
  
  .options-container {
    max-height: 300px;
    overflow-y: auto;
    scrollbar-width: thin;
    background-color: var(--background-color);
    border: 1px solid var(--border-5-color);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .option-group-header {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-5-color);
    background-color: var(--background-2-color);
    border-bottom: 1px solid var(--border-5-color);
  }
  
  .option-group-divider {
    height: 6px;
    background-color: var(--background-secondary-color);
    border: 1px solid var(--border-9-color);
    border-left-color: var(--background-secondary-color);
    border-right-color: var(--background-secondary-color);
  }
  
  .error-message {
    color: var(--error-color);
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
  </style>