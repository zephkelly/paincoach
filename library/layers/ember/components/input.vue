<template>
    <div class="input-wrapper" :class="[{ 'readonly': readonly }, type]">
        <label v-if="label" :for="id" class="input-label">{{ label }}</label>
        <input
            :checked="type === 'checkbox' ? !!modelValue : undefined"
            :value="type !== 'checkbox' ? modelValue : undefined"
            @input="updateModelValue"
            @blur="handleBlur"
            :id="id"
            :class="inputClasses"
            :required="required"
            :pattern="pattern"
            :type="type"
            :tabindex="tabindex"
            :minlength="minlength"
            :maxlength="maxlength"
            :min="min"
            :max="max"
            :disabled="disabled"
            :readonly="readonly"
            :placeholder="placeholder"
            ref="inputRef"
        />
        <!-- <div v-if="validationMessage && validationMessage.length > 0" class="error-message">
            {{ validationMessage }}
        </div> -->
    </div>
</template>
   
<script lang="ts" setup>
import { type InputType } from '@@/layers/ember/types/input';

  type InputProps = {
    modelValue: string | number | boolean | undefined;
    id: string;
    required: boolean;
    type: InputType;
    tabindex?: number;
    label?: string;
    pattern?: string;
    minlength?: number | string;
    maxlength?: number | string;
    min?: number | string;
    max?: number | string;
    disabled?: boolean;
    default?: any;
    readonly?: boolean;
    placeholder?: string;
    validateOnInput?: boolean;
    forceInvalid?: boolean;
    customValidationMessage?: string;
  }

  const props = defineProps<InputProps>();

  const emit = defineEmits(['update:modelValue', 'blur', 'valid', 'invalid']);
  const inputRef = ref<HTMLInputElement | null>(null);
  const touched = ref(false);
  const dirtyValue = ref(false);
  const customInvalid = ref(false);
  
  // Set default value if provided and modelValue is undefined
  onMounted(() => {
    if (props.default !== undefined && props.modelValue === undefined) {
      if (props.type === 'checkbox' && inputRef.value) {
        inputRef.value.checked = !!props.default;
        emit('update:modelValue', !!props.default);
      } else {
        emit('update:modelValue', props.default);
      }
    }
    
    // For checkboxes, ensure the checked state matches modelValue
    if (props.type === 'checkbox' && inputRef.value) {
      inputRef.value.checked = !!props.modelValue;
    }
  });
  
  // Combined input classes
  const inputClasses = computed(() => {
    return {
      'input': true,
      'is-touched': touched.value,
      'is-dirty': dirtyValue.value,
      ...Object.fromEntries(
        Object.entries(props).filter(([key]) => key.startsWith('is')).map(([key, value]) => [key, value])
      )
    };
  });
  
  // Handle validation on input
  function updateModelValue(event: Event) {
    const target = event.target as HTMLInputElement;
    let value;
    
    if (props.type === 'checkbox') {
      value = target.checked;
    } else {
      value = target.value;
    }
    
    emit('update:modelValue', value);
    dirtyValue.value = true;
  }
  
  // Handle validation on blur
  function handleBlur(event: FocusEvent) {
    touched.value = true;
    emit('blur', event);
  }
  
  // Watch for changes to modelValue to update the input
  watch(() => props.modelValue, (newValue) => {
    if (props.type === 'checkbox' && inputRef.value) {
      inputRef.value.checked = !!newValue;
    }
  });
  
  // Public method to reset the field
  function reset() {
    touched.value = false;
    dirtyValue.value = false;
    customInvalid.value = false;
    if (inputRef.value) {
      inputRef.value.setCustomValidity('');
    }
  }
  
  // Define exposed methods
  defineExpose({
    reset,
    inputElement: inputRef
  });
  
  // Validate initial state if needed
  onMounted(() => {
    if (props.forceInvalid) {
      touched.value = true;
    }
  });
</script>
   
<style lang="scss" scoped>
.input-wrapper {
    position: relative;
    width: 100%;

    &.readonly {
        pointer-events: none;

        input {
            color: var(--text-8-color);
            background-color: var(--background-4-color);
            border-color: var(--border-5-color);
        }
    }

    &.checkbox {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;

        input {
            width: 16px;
            height: 16px;
            margin-right: 8px;
            order: -1;
        }

        label {
            font-size: 0.85rem;
            color: var(--text-4-color);
            flex: 1;
        }
    }
}

label {
    font-size: 0.8rem;
    color: var(--text-6-color);
    line-height: 1.5;
}

input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--border-5-color);
    border-radius: 6px;
    padding: 0.5rem 0.8rem;
    background-color: var(--background-color);
    color: var(--text-color);
    font-size: 0.9rem;
    outline: none;
    transition:
        background-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        border-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    margin: 0;
    
    &:hover {
        border-color: var(--border-3-color);
    }
    
    &:focus, 
    &:active {
        border-color: var(--border-2-color);
    }
    
    &.is-invalid {
        border-color: var(--error-color);
    }

    &::placeholder {
        color: var(--text-8-color);
    }

    
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

input[type="date"]:not(:valid):not(:focus) {
    color: var(--text-8-color);
}

input[type="date"]:valid {
  color: var(--text-color);
}

.error-message {
    color: var(--error-color);
    font-size: 0.8rem;
    margin-top: 0.25rem;
}
</style>