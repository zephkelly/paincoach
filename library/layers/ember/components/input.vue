<template>
    <input 
        :value="modelValue"
        @input="updateModelValue"
        :type="type"
        :id="id"
        :class="$attrs.class"
        :required="required"
    />
</template>
  
<script lang="ts" setup>
  defineProps({
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    id: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['update:modelValue']);

  function updateModelValue(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
  }
</script>
  
<style lang="scss" scoped>
input {
    border: 1px solid var(--border-8-color);
    border-radius: 8px;
    padding: 0.5rem 1rem;
    background-color: var(--background-color);
    color: var(--text-color);
}
</style>