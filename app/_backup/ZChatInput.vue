<template>
    <UForm @submit="handleSubmit">
        <div class="flex items-center space-x-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-3xl">
            <UTextarea size="xl" v-model="inputText" :rows="1" :placeholder="placeholder" class="flex-grow resize-none"
                @keydown.enter.prevent="handleEnterKey" />
            <UButton color="primary" :loading="loading" :disabled="!inputText.trim()" type="submit" size="xl"
                icon="i-codicon:arrow-up" />
        </div>
    </UForm>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Type your message here...'
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['submit']);

const inputText = ref('');

const handleSubmit = () => {
    if (!inputText.value.trim()) return;
    emit('submit', inputText.value);
    inputText.value = '';
};

const handleEnterKey = (event: KeyboardEvent) => {
    if (event.shiftKey) {
        // Allow Shift+Enter for new lines
        return;
    }
    handleSubmit();
};
</script>