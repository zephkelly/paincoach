<template>
    <div class="invite-chip" :class="{
        pending: inviteStatus === 'pending',
        opened: inviteStatus === 'opened',
        completed: inviteStatus === 'completed',
        expired: inviteStatus === 'expired',
        revoked: inviteStatus === 'revoked',
        skeleton: inviteStatus === undefined,
        'has-default-slot': hasDefaultSlot,
        'collapsable': collapsable,
    }">
    
        <div class="chip-main" :class="{ 
            'loading-skeleton skeleton-component skeleton-component-panel skeleton-component-border': inviteStatus === undefined,
            'paneled': paneled === true
        }">
            <TransitionGroup name="fade" tag="div" class="transition-wrapper">
                <template v-if="inviteStatus === 'completed'">
                    <div class="chip-content-wrapper completed" :class="{ 'has-slot': hasDefaultSlot }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"/></svg>
                        <slot v-if="hasDefaultSlot" name="default"></slot>
                        <p v-else class="status-name">Completed</p>
                    </div>
                </template>
                <template v-else-if="inviteStatus === 'revoked'">
                    <div class="chip-content-wrapper revoked" :class="{ 'has-slot': hasDefaultSlot }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from coolicons by Kryston Schwarze - https://creativecommons.org/licenses/by/4.0/ --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5.75 5.75l12.5 12.5M12 21a9 9 0 1 1 0-18a9 9 0 0 1 0 18"/></svg>
                        <slot v-if="hasDefaultSlot" name="default"></slot>
                        <p v-else class="status-name">Revoked</p>
                    </div>
                </template>
                <template v-else-if="inviteStatus === 'pending'">
                    <div class="chip-content-wrapper pending" :class="{ 'has-slot': hasDefaultSlot }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11zm7.318-19.539l-10.94 10.939"/></svg>
                        <slot v-if="hasDefaultSlot" name="default"></slot>
                        <p v-else class="status-name">Pending</p>
                    </div>
                </template>
                <template v-else-if="inviteStatus === 'opened'">
                    <div class="chip-content-wrapper opened" :class="{ 'has-slot': hasDefaultSlot }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0z"/><path d="m22 10l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></g></svg>
                        <slot v-if="hasDefaultSlot" name="default"></slot>
                        <p v-else class="status-name">Opened</p>
                    </div>
                </template>
                <template v-else-if="inviteStatus === 'expired'">
                    <div class="chip-content-wrapper expired" :class="{ 'has-slot': hasDefaultSlot }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path fill="currentColor" d="M10.6 5.63a1 1 0 0 0 .36 2a6 6 0 0 1 1-.09a6 6 0 0 1 6 6a6 6 0 0 1-.09 1a1 1 0 0 0 .8 1.16h.18a1 1 0 0 0 1-.82A7.5 7.5 0 0 0 20 13.5a8 8 0 0 0-1.7-4.91l.91-.9a1 1 0 0 0-1.42-1.42l-.9.91A8 8 0 0 0 12 5.5a7.5 7.5 0 0 0-1.4.13M10 4.5h4a1 1 0 0 0 0-2h-4a1 1 0 0 0 0 2m3.49 9.08v-.16l1.34-1.33a1 1 0 1 0-1.42-1.42L12.08 12h-.16L5.71 5.79a1 1 0 0 0-1.42 1.42l.48.48l.91.91A8 8 0 0 0 16.9 19.82l1.39 1.39a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42ZM12 19.5A6 6 0 0 1 7.11 10l3.4 3.39v.08A1.5 1.5 0 0 0 12 15h.08l3.39 3.4A6 6 0 0 1 12 19.5"/></svg>
                        <slot v-if="hasDefaultSlot" name="default"></slot>
                        <p v-else class="status-name">Expired</p>
                    </div>
                </template>
            </TransitionGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { InvitationStatus } from '@@/shared/types/v1/user/invitation';

interface InviteChipProps {
    inviteStatus: InvitationStatus | undefined;

    paneled?: boolean;
    collapsable?: boolean;
}

defineProps<InviteChipProps>();

const slots = useSlots();
const hasDefaultSlot = computed(() => !!slots.default && slots.default().length > 0);
</script>

<style scoped lang="scss">
@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }
    50% {
    }
    100% {
        background-position: 200% 0;
    }
}

.invite-chip {
    position: relative;
    height: 29px;
    transition: width 0.35s cubic-bezier(0.075, 0.82, 0.165, 1), min-width 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);

    &.skeleton {
        width: 90px;
        min-width: 90px;
    }

    &.completed {
        width: 100px;

        .chip-main {
            border: 1px solid var(--success-border-2-color);
            background-color: var(--success-background-3-color);
            color: var(--success-text-color);
    
            &.paneled {
                background-color: var(--success-background-4-color);
                border-color: var(--success-border-3-color);
            }
        }
    }

    &.pending {
        width: 90px;

        .chip-main {
            border: 1px solid var(--pending-border-2-color);
            background-color: var(--pending-background-3-color);
            color: var(--pending-text-color);

            &.paneled {
                background-color: var(--pending-background-4-color);
                border-color: var(--pending-border-3-color);
            }
        }
    }

    &.expired {
        width: 86px;

        .chip-main {
            border: 1px solid var(--warning-border-2-color);
            background-color: var(--warning-background-3-color);
            color: var(--warning-text-color);

            &.paneled {
                background-color: var(--warning-background-4-color);
                border-color: var(--warning-border-3-color);
            }
        }
    }

    &.opened {
        width: 90px;

        .chip-main {
            border: 1px solid var(--info-border-2-color);
            background-color: var(--info-background-3-color);
            color: var(--info-text-color);

            &.paneled {
                background-color: var(--info-background-4-color);
                border-color: var(--info-border-3-color);
            }
        }

        p {
            left: 2px;
        }
    }

    &.revoked {
        width: 96px;

        .chip-main {
            border: 1px solid var(--danger-border-2-color);
            background-color: var(--danger-background-3-color);
            color: var(--danger-text-color);

            &.paneled {
                background-color: var(--danger-background-4-color);
                border-color: var(--danger-border-3-color);
            }
        }
    }

    &.has-default-slot {
        width: auto;
        min-width: auto;

        .chip-main {
            position: relative;

            .chip-content-wrapper {
                position: relative;

                .status-name {
                    // border-right: 1px solid var(--danger-border-1-color);
                    padding-right: 0.5rem;
                    margin-right: 0.28rem;
                }
            }
        }
    }

    &.collapsable {
        width: 28px;
        min-width: 28px;
        
        .chip-content-wrapper {
            margin-left: 0px;
            gap: 0;
            transition: margin-left 0.2s ease;

            svg { 
                margin-right: 0;
            }

            .invite-name {
                max-width: 0;
                opacity: 0;
                overflow: hidden;
                margin: 0;
                padding: 0;

            }
        }

        &:hover {
            .chip-content-wrapper {
                transition:
                    width 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
                    min-width 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);

                svg {
                    transition: margin-right 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
                    margin-right: 0.25rem;
                }

                .invite-name {      
                    transition: max-width 0.15s cubic-bezier(0.075, 0.82, 0.165, 1),
                        opacity 0.15s cubic-bezier(0.075, 0.82, 0.165, 1);
                }
            }

            &.completed {
                width: 100px;
                min-width: 100px;
            }

            &.revoked {
                width: 94px;
                min-width: 94px;
            }

            &.expired {
                width: 94px;
                min-width: 94px;
            }

            &.pending {
                width: 90px;
                min-width: 90px;
            }

            &.opened {
                width: 90px;
                min-width: 90px;
            }

            .chip-content-wrapper {
                .invite-name {
                    max-width: 150px;
                    opacity: 1;
                    margin-right: 0;
                }
            }
        }
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
    display: inline-flex;
    box-sizing: border-box;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 0.25rem;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    transition:
        background-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        border-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
        color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);

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
        // gap: 0.25rem;
        position: absolute;

        svg {
            position: relative;
            left: -2px;
            margin-right: 0.25rem;
            height: 0.9rem;
        }


        &.completed {
            left: 1px;
        }

        &.opened {  
            svg {
                height: 0.75rem;
            }
        }

        &.pending {
            svg {
                top: 0px;
                height: 0.78rem;
            }
        }

        &.revoked {
            svg {
                // top: 0.5px;
                height: 0.8rem;
            }
        }



        &.has-default-slot {
            gap: 0.5rem;
        }
    }

    p {
        position: relative;
        top: 1px;
        font-size: 0.75rem;
        font-family: var(--geist-font-stack);
        text-wrap: nowrap;
        white-space: nowrap;
        position: relative;
        height: 100%;
    }

    svg {
        height: 12px;
        width: auto;
        aspect-ratio: 1/1;
    }
}

.chip-main:not(.loading-skeleton) {
    border: 1px solid var(--border-5-color);
    background-color: var(--background-3-color);
    color: var(--text-2-color);

    &.paneled {
        background-color: var(--background-4-color);
        border-color: var(--border-5-color);
    }
}
</style>