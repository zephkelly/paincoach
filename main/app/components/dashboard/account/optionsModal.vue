<template>
    <EModalBase
        :open="accountProfileModalOpen"
        :trigger-event="lastClickEvent"
        :enable-drag="true"
        placement="auto"
        @close="accountProfileModalOpen = false"
    >
        <div class="options-menu" @mousedown.stop>
            <!-- Mobile user info -->
            <div v-if="isMobileView" class="user-info">
                <div class="avatar">
                    <p class="initial">{{ userInitial }}</p>
                </div>
                <div class="details">
                    <p class="name">{{ user?.first_name }}</p>
                </div>
            </div>

            <!-- Menu options -->
            <div class="button-wrapper">
                <button class="option" @click="navigateToProfile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
                    </svg>
                    Your Profile
                </button>
            </div>

            <button class="logout" @click="handleLogout">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m-5 5h10"/>
                </svg>
                Logout
            </button>
        </div>
    </EModalBase>
</template>

<script setup lang="ts">
const {
    user
} = useUserSession();

const {
    accountProfileModalOpen,
    lastClickEvent
} = useAccountProfile();

const emit = defineEmits<{
    close: [];
}>();

const isMobileView = computed(() => window.innerWidth < 500);

const userInitial = computed(() => {
    return user.value?.first_name.charAt(0).toUpperCase() ?? '';
});

const navigateToProfile = () => {
    emit('close');
    accountProfileModalOpen.value = false
    navigateTo('/user/profile');
};

// Logout
const { clear: clearSession } = useUserSession();

function handleLogout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (!confirmLogout) {
        return;
    }
    
    clearSession();
    emit('close');
    accountProfileModalOpen.value = false
    navigateTo('/');
}
</script>

<style lang="scss" scoped>
.options-menu {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    // min-width: 200px;
    width: 100%;
    box-sizing: border-box;

    .user-info {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        border-radius: 8px;
        background-color: var(--background);
        margin-bottom: 1rem;
        border: 1px solid var(--border-main);

        .avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 1px solid var(--border-main);
            background-color: var(--background-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
        }
        
        .details {
            p {
                font-size: 1.2rem;
                font-weight: 600;
                user-select: none;
                color: var(--text-primary);
            }
        }
    }

    .button-wrapper {
        border-radius: 6px;
        border: 1px solid var(--border-main);
        overflow: hidden;
        margin-bottom: 1rem;
    }

    button {
        display: flex;
        align-items: center;
        width: 100%;
        max-height: 42px;
        gap: 0.5rem;
        border: none;
        padding: 10px 14px;
        background-color: var(--background-secondary);
        color: var(--text-primary);
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background-color: var(--background);

            &:hover {
                background-color: var(--background);
            }
        }

        &:hover:not(:disabled) {
            background-color: var(--background-tertiary);
        }

        &.logout {
            border: 1px solid var(--border-main);
            border-radius: 6px;
            transition:
                color 0.3s cubic-bezier(0.075, 0.82, 0.165, 1),
                border-color 0.3s cubic-bezier(0.075, 0.82, 0.165, 1),
                background-color 0.15s cubic-bezier(0.075, 0.82, 0.165, 1);

            svg {
                transition: color 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
            }

            &:hover {
                border-color: var(--danger-secondary-border);
                background-color: var(--danger-background-darker-hover);
                color: var(--danger-legible);

                svg {
                    color: var(--danger-legible);
                }
            }
        }
    }
}

@media (max-width: 500px) {
    .options-menu {
        min-width: 100%;
    }
}
</style>