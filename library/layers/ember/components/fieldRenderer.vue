<template>
    <div class="field-renderer">
      <template v-for="(item, index) in processedFields" :key="index">
        <!-- If it's a single field -->
        <template v-if="item.type === 'field'">
          <component
            class="input-field"
            :class="[{ 'field-required': item.field.required }, item.field.identifier]"
            :is="getComponent(item.field.inputType)"
            :id="item.field.identifier"
            :label="item.field.label"
            :type="item.field.inputType"
            :readonly="isFieldReadonly(item.field)"
            :required="item.field.required"
            :tabindex="item.field.tabindex"
            :default="item.field.default"
            :options="item.field.options"
            :identifier="item.field.identifier"
            :validation="{
              validator,
              fieldPath: item.field.identifier,
            }"
            @blur="onBlur"
            v-model="state[item.field.identifier]"
          />
        </template>
  
        <!-- If it's a row of fields -->
        <div v-else-if="item.type === 'row'" class="fields-row" :class="item.rowName" :style="{ gap: fieldsGap }">
            <component
              v-for="field in item.fields"
              :key="field.identifier"
              class="input-field"
              :class="[{ 'field-required': field.required }, field.identifier]"
              :is="getComponent(field.inputType)"
              :id="field.identifier"
              :label="field.label"
              :type="field.inputType"
              :readonly="isFieldReadonly(field)"
              :required="field.required"
              :tabindex="field.tabindex"
              :default="field.default"
              :options="field.options"
              :identifier="field.identifier"
              :validation="{
                validator,
                fieldPath: field.identifier,
              }"
              @blur="onBlur"
              v-model="state[field.identifier]"
            />
        </div>
      </template>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, watch } from 'vue';
  import type { InputField } from '@@/layers/ember/types/input';
  
  interface Validator {
    validate: (state: Record<string, any>) => boolean;
  }
  
  interface ProcessedFieldItem {
    type: 'field';
    field: InputField;
  }
  
  interface ProcessedRowItem {
    type: 'row';
    rowName: string;
    fields: InputField[];
  }
  
  type ProcessedItem = ProcessedFieldItem | ProcessedRowItem;
  
  type FieldRendererProps = {
    fields: InputField[];
    state: Ref<Record<string, any>>;
    validator: Validator;
    gap?: number;
    getComponent: (inputType: string) => string;
    isFieldReadonly: (field: InputField) => boolean;
  }
  
  const props = defineProps<FieldRendererProps>();
  const emit = defineEmits<{
    (e: 'blur'): void;
    (e: 'update:state', value: Record<string, any>): void;
  }>();
  
  // Add a safe getter for field values to handle undefined or null cases
  const getFieldValue = (fieldId: string) => {
    return props.state && fieldId in props.state ? props.state[fieldId] : undefined;
  };
  
  const updateField = (fieldId: string, value: any) => {
    // Only emit update if we actually have a state object
    if (props.state) {
      emit('update:state', {
        ...props.state,
        [fieldId]: value
      });
    }
  };
  
  const processedFields = computed<ProcessedItem[]>(() => {
    const result: ProcessedItem[] = [];
    const rowGroups: Record<string, InputField[]> = {};
    
    // First pass: collect fields into row groups
    props.fields.forEach((field) => {
      if (field.row) {
        if (!rowGroups[field.row]) {
          rowGroups[field.row] = [];
        }

        console.log(field.identifier)
        
        rowGroups[field.row]?.push(field);
      }
    });
    
    // Second pass: build the final list in the original order
    props.fields.forEach((field) => {
      if (!field.row) {
        result.push({
          type: 'field',
          field
        });
      } else if (rowGroups[field.row]) {
        const currentFields = rowGroups[field.row];
        if (currentFields !== undefined && currentFields.length > 0) {
          const rowFields = [...currentFields];
          result.push({
            type: 'row',
            rowName: field.row,
            fields: rowFields
          });
          // Clear the group after processing to avoid duplicates
          delete rowGroups[field.row]; 
        }
      }
    });

    console.log('Processed Fields:', result);
    
    return result;
  });
  
  const fieldsGap = computed(() => {
    return props.gap ? `${props.gap}rem` : '1rem';
  });
  
  const onBlur = (): void => {
    emit('blur');
  };
  </script>
  
  <style lang="scss" scoped>
  .field-renderer {
    display: flex;
    flex-direction: column;
    width: 100%;
    
    .fields-row {
      display: flex;
    }
    
    .input-field {
      margin-bottom: 1rem;
    }
  }
  </style>