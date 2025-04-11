<template>
    <li class="basic-invitation-list-item">
        <div class="invitation-section email">
            <div class="section-inner">
                <p>{{ invitation.email }}</p>
                <div class="linked-user" title="View linked user account">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></g></svg>
                </div>
            </div>
        </div>
        <div class="invitation-section">
            <div class="section-inner">
                <UserRoleChipList
                    :roles="invitation.roles"
                    :primaryRole="invitation.primary_role"
                    :collapsable="true"
                    class="user-role"
                />
            </div>
        </div>
        <div class="invitation-section">
            <div class="section-inner">
                <InviteStatusChip
                    class="invitation-status"
                    :inviteStatus="invitation.current_status"
                    :collapsable="false"
                />
            </div>
        </div>
        <div class="invitation-section expires">
            <div class="section-inner">
                <p class="no-expiry" v-if="invitation.current_status === 'completed' && invitation.linked_user_public_id">N/A</p>
                <EExpirationTimer v-else
                    :expiresAt="invitation.expires_at"
                    :updateInterval="60000"
                    class="expiration-timer"
                />
            </div>
        </div>
    </li>
</template>

<script lang="ts" setup>
import { EExpirationTimer } from '#components';
import type { BasicUserInvitation } from '@@/shared/types/v1/user/invitation/basic';

type InvitationListItemProps = {
    invitation: BasicUserInvitation;
}

const props = defineProps<InvitationListItemProps>();
</script>

<style lang="scss" scoped>
.basic-invitation-list-item {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding: 0.5rem 0.25rem;
    border-bottom: 1px solid var(--color-border); 
}

.invitation-section {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);

    .section-inner {
        display: flex;
        height: 100%;
        align-items: center;
    }

    &.expires {
        .no-expiry {
            color: var(--text-3-color);
            font-size: 12px;
            font-weight: 600;
        }
    }
}

.invitation-section.email {
    .section-inner {
        justify-content: space-between;
        max-width: 250px;
        min-width: 200px;
        width: 100%;

        p {

        }

        .linked-user {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            aspect-ratio: 1;

            svg {
                position: relative;
                height: 14px;
                width: 14px;
                aspect-ratio: 1;
                opacity: 0.6;
                transition: opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1); 
            }

            &:hover {
                cursor: pointer;

                svg {
                    opacity: 1;
                }
            }
        }
    }
}


.invitation-status {
    opacity: 0.8;
    transition: opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1); 

    &:hover {
        opacity: 1;
    }
}
</style>