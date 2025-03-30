<template>
    <li class="user-info-list-item" :class="{ role: showRole }">
        <NuxtLink class="link-wrapper flex-row" :to="`/dashboard/user/id/${props.userInfo?.uuid}`">
            <div class="user-info-list-item-profile" :class="{ placeholder: props.userInfo && !props.userInfo.profile_url}">
                <DashboardUserProfileImage :id="props.userInfo?.uuid" :firstName="props.userInfo?.first_name" :profileUrl="props.userInfo?.profile_url" :loading="loading" />
            </div>
            <div class="user-info-list-item-details flex-row">
                <div class="user-name-wrapper detail-wrapper name">
                    <div v-if="loading" class="skeleton-component skeleton-component-panel" />
                    <p v-else class="name">{{ props.userInfo?.first_name }} {{ lastNameComputed }}</p>
                </div>
                <div v-if="showRole" class="user-role-wrapper detail-wrapper role">
                    <div v-if="loading" class="skeleton-component skeleton-component-panel" />
                    <DashboardAccountRoleChip :userRole="userInfo?.primary_role" paneled />
                </div>
                <div class="user-email-wrapper detail-wrapper email">
                    <p>{{ props.userInfo?.email }}</p>
                </div>
            </div>
        </NuxtLink>
    </li>
</template>

<script lang="ts" setup>
import type { User } from '~~lib/shared/types/v1/user';
import { type LimitedUser } from '@@/shared/types/v1/user/limited';

type UserInfoListItemProps = {
    loading: boolean,
    userInfo: LimitedUser | undefined
    hideLastName?: boolean
    showRole?: boolean
}

const props = defineProps<UserInfoListItemProps>();

const lastNameComputed = computed(() => {
    //replace all but the first initial with ***
    if (props.userInfo?.last_name) {
        if (props.hideLastName) {
            return props.userInfo.last_name[0] + props.userInfo.last_name.slice(1).replace(/./g, '*');
        }
        return props.userInfo.last_name;
    }

    return '';
})
</script>

<style lang="scss" scoped>
li {
    // background-color: var(--background-4-color);
    border-radius: 0.5rem;
    height: 36px;
    box-sizing: border-box;
    overflow: hidden;
    cursor: pointer;
    transition: background-color 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);

    &.role {
        .user-info-list-item-details {
            .detail-wrapper {
                &.role {
                    width: 90px;
                }
            }
        }
    }

    &:hover {
        background-color: var(--background-3-color);

        .user-info-list-item-details {
            .user-name-wrapper {
                .name-overflow-gradient {
                    background: linear-gradient(to right, rgba(255, 255, 255, 0), var(--background-3-color));
                }
            }
        }
    }

    .link-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        height: 36px;
        box-sizing: border-box;
        gap: 0.5rem;
    }
}

.user-info-list-item-profile {
    height: calc(100% - 0.3rem);
    aspect-ratio: 1/1;
    margin: 0.15rem;
    overflow: hidden;
    border-radius: 100%;
    border: 1px solid var(--border-1-color);
    box-sizing: border-box;

    &.placeholder {
        border-color: var(--border-3-color);
    }

    .profile-placeholder {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        background-color: var(--background-3-color);
        color: var(--text-5-color);
        font-size: 1rem;
        font-weight: 500;
        border-radius: 100%;
    }
    
    img {
        height: 100%;
        width: auto;
    }
}
.user-info-list-item-details {
    // padding: 0.5rem 0rem;
    height: 100%;
    gap: 0.5rem;

    .skeleton-component {
        width: 100%;
        height: 100%;
        border-radius: 0.25rem;
    }

    .detail-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        padding: 0.5rem 0rem;
        height: 100%;
        box-sizing: border-box;

        &.name {
            width: 140px;
            overflow: hidden;
        }

        &.role {
            width: 0px;

            :deep() {
                .chip {
                    .chip-main {
                        border-color: var(--border-3-color);
                    }
                }
            }
        }
    }

    .user-email-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        padding: 0.5rem 0rem;
    }

    p {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
    }
}
</style>
