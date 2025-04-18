<!-- components/NestedOption.vue -->
<template>
    <div 
      class="option-wrapper"
      :class="{ 'has-children': hasChildren }"
    >
      <div 
        class="option"
        :class="{ 
          'selected': isSelected, 
          'disabled': isDisabled,
          'with-children': hasChildren,
          'child-selected': hasSelectedChild && !isSelected,
          'level-indent': level > 0
        }"
        :style="{ paddingLeft: `${0.8 + level * 0.6}rem` }"
        @click="handleToggle"
      >
        <div class="checkbox">
          <svg v-if="isSelected" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        
        <span class="option-label">{{ option.label }}</span>
        
        <button 
          v-if="hasChildren" 
          type="button"
          class="toggle-children"
          :class="{ 'expanded': isExpanded }"
          @click.stop="toggleExpand"
          aria-label="Toggle children"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
      
      <!-- Recursive child options -->
      <div 
        v-if="hasChildren && isExpanded" 
        class="nested-options"
        :class="{ 'level-indent': level > 0 }"
      >
        <div v-for="(childOption, childIndex) in option.children" :key="childIndex">
          <NestedOption 
            :option="childOption"
            :is-selected="isOptionSelected(childOption.value)"
            :is-disabled="Boolean(isDisabled || (childOption.exclusiveKey && 
              childOption.exclusiveKey === exclusiveKey && 
              !isOptionSelected(childOption.value) &&
              modelValue.some(val => 
                option.children?.some(opt => 
                  opt.exclusiveKey === childOption.exclusiveKey && 
                  isOptionValueEqual(opt.value, val)
                )
              )))"
            :level="level + 1"
            :model-value="modelValue"
            :exclusive-key="childOption.exclusiveKey"
            :exclusive-group-selections="exclusiveGroupSelections"
            :parent-required="childOption.parentRequired"
            :parent-option="option"
            @toggle="handleChildToggle"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watchEffect } from 'vue';
  
  interface SelectOption {
    label: string;
    value: string | null | undefined;
    exclusiveKey?: string;
    children?: SelectOption[];
    parentRequired?: boolean;
  }
  
  interface NestedOptionProps {
    option: SelectOption;
    isSelected: boolean;
    isDisabled?: boolean | undefined;
    level: number;
    modelValue: Array<string | null | undefined>;
    exclusiveKey?: string;
    exclusiveGroupSelections?: { [key: string]: string | null | undefined };
    parentRequired?: boolean;
    parentOption?: SelectOption;
  }
  
  const props = defineProps<NestedOptionProps>();
  const emit = defineEmits(['toggle']);
  
  const isExpanded = ref(false);
  
  // Toggle expand/collapse of children
  function toggleExpand(event: Event) {
    event.stopPropagation();
    isExpanded.value = !isExpanded.value;
  }
  
  // Whether this option has any children
  const hasChildren = computed(() => {
    return props.option.children && props.option.children.length > 0;
  });
  
  // Check if any child option is selected
  const hasSelectedChild = computed(() => {
    if (!hasChildren.value || !props.option.children) return false;
    
    return props.option.children.some(child => 
      props.modelValue.some(value => 
        isOptionValueEqual(child.value, value)
      )
    );
  });
  
  // Local function to check if an option is selected (needed by child NestedOption components)
  function isOptionSelected(value: string | null | undefined): boolean {
    return props.modelValue.some(selectedValue => 
      isOptionValueEqual(value, selectedValue)
    );
  }
  
  // Toggle option selection and pass to parent
  function handleToggle(event: Event) {
    event.stopPropagation();
    if (props.isDisabled) return;
    emit('toggle', props.option);
  }
  
  // Handle toggle for child items
  function handleChildToggle(childOption: SelectOption) {
    // If child has parentRequired and parent is not selected, select parent first
    if (childOption.parentRequired && 
        props.parentOption && 
        !isOptionSelected(props.parentOption.value)) {
        // Select the parent first
        emit('toggle', props.parentOption);
    }
    
    // Then toggle the child option
    emit('toggle', childOption);
    }
  
  // Helper function to check equality between option values
  function isOptionValueEqual(optionValue: string | null | undefined, modelValue: string | null | undefined): boolean {
    if (optionValue === undefined && modelValue === undefined) return true;
    if (optionValue === null && modelValue === null) return true;
    return optionValue === modelValue;
  }
  
  // Automatically expand if this option or any child is selected
  watchEffect(() => {
    if (props.isSelected || hasSelectedChild.value) {
      isExpanded.value = true;
    }
  });
  </script>
  
  <style lang="scss" scoped>
  .option-wrapper {
    width: 100%;
    
    &.has-children {
      .option {
        position: relative;
      }
    }
  }
  
  .option {
    padding: 0.5rem 0.8rem;
    cursor: pointer;
    transition: background-color 0.2s ease, opacity 0.2s ease;
    display: flex;
    align-items: center;
    
    &:hover:not(.disabled) {
      background-color: var(--background-2-color);
    }
    
    &.selected {
      background-color: var(--background-3-color);
      font-weight: 500;
    }
    
    &.with-children {
      padding-right: 2.5rem;
    }
    
    &.child-selected {
      background-color: var(--background-1-color);
      font-style: italic;
    }
    
    &.disabled {
      opacity: 0.2;
      cursor: not-allowed;
    }
    
    .checkbox {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border: 1px solid var(--border-4-color);
      border-radius: 3px;
      margin-right: 8px;
      color: var(--primary-color);
      background-color: var(--background-2-color);
      flex-shrink: 0;
      
      .selected & {
        border-color: var(--primary-color);
        background-color: var(--primary-light-color);
      }
      
      .disabled & {
        border-color: var(--border-5-color);
        background-color: var(--background-4-color);
      }
    }
    
    .option-label {
      flex: 1;
    }
    
    .toggle-children {
      position: absolute;
      right: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--text-6-color);
      transition: transform 0.2s ease;
      
      &.expanded {
        transform: rotate(180deg);
      }
      
      &:hover {
        color: var(--text-3-color);
      }
    }
  }
  
  .nested-options {
    border-left: 1px dashed var(--border-5-color);
    margin-left: 1.5rem;
  }
  </style>