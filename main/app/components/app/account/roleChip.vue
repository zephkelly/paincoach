<template>
    <div class="chip" :class="{
        admin: userRole === 'admin',
        clinician: userRole === 'clinician',
        patient: userRole === 'patient',
        skeleton: userRole === undefined
    }">
        
        <div class="chip-main" :class="{ 'loading-skeleton skeleton-component skeleton-component-panel skeleton-component-border': userRole === undefined }">
            <TransitionGroup name="fade" tag="div" class="transition-wrapper">
                <template v-if="userRole === 'admin'">
                    <div class="chip-content-wrapper admin">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
                        <p>Admin</p>
                    </div>
                </template>
                <template v-else-if="userRole === 'clinician'">
                    <div class="chip-content-wrapper clinician">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M20 22v-3c0-2.828 0-4.243-.879-5.121C18.243 13 16.828 13 14 13l-2 2l-2-2c-2.828 0-4.243 0-5.121.879C4 14.757 4 16.172 4 19v3m12-9v5.5"/><path d="M8.5 13v4m0 0a2 2 0 0 1 2 2v1m-2-3a2 2 0 0 0-2 2v1m9-13.5v-1a3.5 3.5 0 1 0-7 0v1a3.5 3.5 0 1 0 7 0m1.25 12.75a.75.75 0 1 1-1.5 0a.75.75 0 0 1 1.5 0"/></g></svg>
                        <p>Clinician</p>
                    </div>
                </template>
                <template v-else-if="userRole === 'patient'">
                    <div class="chip-content-wrapper patient">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></g></svg>
                        <p>Patient</p>
                    </div>
                </template>
            </TransitionGroup>
        </div>

    </div>
</template>

<script setup lang="ts">
import type { UserRole } from '~~lib/shared/types/users';

interface ChipProps {
    userRole: UserRole | undefined;
}

defineProps<ChipProps>();
</script>

<style scoped lang="scss">
.chip {
    position: relative;
    height: 28px;
    transition: width 0.35s cubic-bezier(0.075, 0.82, 0.165, 1), min-width 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);

    &.skeleton {
        width: 90px;
        min-width: 90px;
    }

    &.admin {
        width: 76px;
        min-width: 76px;
    }

    &.clinician {
        width: 90px;
        min-width: 90px;
    }

    &.patient {
        width: 81px;
        min-width: 81px;
    }  
}
.chip-transition-wrapper {
    display: flex;
    height: 100%;
}

.loading-skeleton {
    position: absolute;
    height: 100%;
    border-radius: 0.25rem;
}

.chip-main {
    position: absolute;
    display: inline-flex;
    box-sizing: border-box;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 0.25rem;
    color: var(--text-3-color);
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    .transition-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        position: relative;
        width: 100%;
    }

    .chip-content-wrapper {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        position: absolute;

        &.admin {
            svg {
                height: 0.85rem;
            }
        }

        &.clinician {
            svg {
                height: 0.95rem;
            }
        }

        &.patient {
            svg {
                height: 0.85rem;
            }
        }
    }

    p {
        font-size: 0.8rem;
        font-family: var(--geist-font-stack);
    }

    svg {
        height: 12px;
        width: auto;
        aspect-ratio: 1/1;
    }
}

.chip-main:not(.loading-skeleton) {
    border: 1px solid var(--border-color);
    background-color: var(--background-3-color);
}
</style>