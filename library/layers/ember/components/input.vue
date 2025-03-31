<template>
    <div class="input-wrapper e-input" :class="[{ 'readonly': readonly, 'invalid': !!errorMessage, 'is-touched': touched, 'is-dirty': dirtyValue }, type]">
        <label v-if="label" :for="id" class="input-label">
            {{ label }}
            <template v-if="required && !props.modelValue">
                <span class="required-indicator">*</span>
            </template>
        </label>
        <input
            :checked="type === 'checkbox' ? !!modelValue : undefined"
            :value="type !== 'checkbox' ? modelValue : undefined"
            @input="updateModelValue"
            @blur="handleBlur"
            :id="id"
            :class="inputClasses"
            :required="required"
            :type="type"
            :tabindex="tabindex"
            :disabled="disabled"
            :readonly="readonly"
            :placeholder="placeholder"
            ref="inputRef"
        >
            <slot name="default" />
        </input>
        <div class="error-message" :class="{ empty: !errorMessage }">
            {{ errorMessage }}
        </div>
    </div>
</template>
   
<script lang="ts" setup>
import { type InputType, type InputProps } from '@@/layers/ember/types/input';

// Define a type for the combined validation prop
type ValidationConfig = {
    validator: {
        validateField: (data: unknown, fieldPath: string) => string | null;
    };
    fieldPath: string;
    fieldValue?: any;
};

type BaseInputProps = InputProps & {
    type: InputType;
    validateOnInput?: boolean;
    forceInvalid?: boolean;
    customValidationMessage?: string;
    // Replace separate validator and identifier with a single validation prop
    validation?: ValidationConfig;
};

const props = defineProps<BaseInputProps>();

const emit = defineEmits(['update:modelValue', 'blur', 'valid', 'invalid']);
const inputRef = ref<HTMLInputElement | null>(null);
const touched = ref(false);
const dirtyValue = ref(false);
const customInvalid = ref(false);
const errorMessage = ref<string | null>(null);
// Use import.meta.client for SSR detection
const isClient = import.meta.client;
  
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
  
  // Do NOT validate on mount - only validate if explicitly forced
  if (props.forceInvalid) {
    touched.value = true;
    validateIfNeeded();
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

// Validate input using the provided validator
function validateIfNeeded() {
    // Skip validation if we're not client-side yet or if no validation config
    if (!isClient || !props.validation) {
        return;
    }

    const { validator, fieldPath, fieldValue } = props.validation;
    
    if (validator && fieldPath) {
        const dataToValidate = fieldValue !== undefined ? fieldValue : props.modelValue;
        
        // Create an object with the field path
        const validationData = createValidationObjectFromPath(fieldPath, dataToValidate);
        
        // Validate the field
        const error = validator.validateField(validationData, fieldPath);
        console.log('Validation error:', error);
        errorMessage.value = error;
        
        if (error) {
            emit('invalid', error);
            customInvalid.value = true;
            if (inputRef.value) {
                inputRef.value.setCustomValidity(error);
            }
        } else {
            emit('valid');
            customInvalid.value = false;
            if (inputRef.value) {
                inputRef.value.setCustomValidity('');
            }
        }
    } else if (props.customValidationMessage) {
        errorMessage.value = props.customValidationMessage;
        customInvalid.value = true;
        emit('invalid', props.customValidationMessage);
    } else {
        errorMessage.value = null;
        customInvalid.value = false;
        if (inputRef.value) {
            inputRef.value.setCustomValidity('');
        }
    }
}

// Create nested object from dot-notation path
function createValidationObjectFromPath(path: string, value: any): any {
    const parts = path.split('.');
    const result: any = {};
    let current = result;
    
    // Create the nested structure
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];

        if (!part) {
            continue;
        }
        current[part] = {};
        current = current[part];
    }

    const leafNode = parts[parts.length - 1];
    if (!leafNode) {
        return result;
    }
    
    current[leafNode] = value;
    
    return result;
}

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
    
    // Validate on input if enabled
    if (props.validateOnInput && isClient) {
        validateIfNeeded();
    }
}

// Handle validation on blur
function handleBlur(event: FocusEvent) {
    touched.value = true;
    emit('blur', event);
    
    // Only validate on client
    if (isClient) {
        validateIfNeeded();
    }
}

// Watch for changes to modelValue to update the input
watch(() => props.modelValue, (newValue) => {
    if (props.type === 'checkbox' && inputRef.value) {
        inputRef.value.checked = !!newValue;
    }
    
    // Validate on model change only if client-side and the field has been touched
    if (isClient && (touched.value || props.validateOnInput)) {
        validateIfNeeded();
    }
});

// Watch for changes to the custom validation message
watch(() => props.customValidationMessage, (newValue) => {
    // Skip during SSR
    if (!isClient) return;
    
    if (newValue) {
        errorMessage.value = newValue;
        customInvalid.value = true;
        emit('invalid', newValue);
    } else if (!props.validation) {
        // Only clear if we're not using a validator
        errorMessage.value = null;
        customInvalid.value = false;
    }
});

// Public method to reset the field
function reset() {
    touched.value = false;
    dirtyValue.value = false;
    customInvalid.value = false;
    errorMessage.value = null;
    if (inputRef.value) {
        inputRef.value.setCustomValidity('');
    }
}

// Define exposed methods
defineExpose({
    reset,
    inputElement: inputRef,
    validate: validateIfNeeded
});
</script>
   
<style lang="scss" scoped>
.input-wrapper {
    max-height: 55px;
    position: relative;
    width: 100%;
    transition: max-height 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);

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
            user-select: none;
        }
    }

    &.invalid {
        max-height: calc(70px + 0.25rem);

        label {
            color: var(--error-color);
        }
        
        input {
            border-color: var(--error-color);
        }
    }
}

label {
    position: relative;
    display: flex;
    flex-direction: row;
    font-size: 0.8rem;
    color: var(--text-6-color);
    line-height: 1.5;
    transition: color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);

    .required-indicator {
        position: relative;
        color: var(--error-color);
        margin-left: 0.25rem;
        height: 4px;
        width: 4px;
        top: 2px;
        opacity: 0.8;
    }
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
    
    /* Individual input no longer needs is-invalid class as it's on the wrapper */

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
    margin-bottom: 0.25rem;
    height: 14px;
    opacity: 1;

    transition:
        margin 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        height 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);

    &.empty {
        height: 0;
        margin: 0;
        opacity: 0;
    }
}
</style>