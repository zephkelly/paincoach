<template>
    <div class="users-list-overview" :class="{ role: showRole, title: title !== undefined, empty: !users || users.length === 0 }">
        <div v-if="title" class="list-title flex-row">
            <div class="list-header-icon">
                <slot name="icon" />
            </div>
            <h3>{{ title }}</h3>
        </div>
        <div class="list-header flex-row">
            <div class="list-header-item name">Name</div>
            <div class="list-header-item role">Role</div>
            <div class="list-header-item email">Email</div>
        </div>
        <ul class="flex-col">
            <DashboardUserOverviewListItem v-for="user in users" :key="user.id" :userInfo="user" :loading="loading" :showRole="showRole"/>
        </ul>
        <div class="empty-list" v-if="!users || users.length === 0">
            <p v-if="listRole === undefined">No users found</p>
            <p v-else>No {{ listRole }}s found</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { type User, type Role } from '@@/shared/types/users';

type UserListProps = {
    title?: string,
    loading: boolean;
    users?: User[];
    showRole?: boolean;
    listRole?: Role;
}

const props = defineProps<UserListProps>();
</script>

<style lang="scss" scoped>
.users-list-overview {
    background-color: var(--background-4-color);
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border-3-color);

    &.role {
        .list-header-item {
        
            &.role {
                display: block;
                margin-left: calc(0.5rem + 4px);
                width: 90px;
            }

            &.email {
                display: block;
                margin-left: calc(0.5rem + 1px);
                width: 90px;
            }
        }
    }

    &.title {
       .list-header {
            border-bottom-color: transparent;
            padding-bottom: 0rem;
            margin-bottom: 0.5rem;
       } 
    }

    &.empty {
        .list-header {
            display: none;
        }
    }
}

.list-title {
    height: 20px;
    gap: 0.5rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid var(--border-3-color);
    margin-bottom: 1rem;

    .list-header-icon {
        height: 100%;
        aspect-ratio: 1;

        :deep() {
            svg {
                width: 100%;
                height: 100%;
            }
        }
    }

    h3 {
        display: flex;
        align-items: center;
        font-size: 1.1rem;
    }
}

.list-header {
    width: 100%;
    border-bottom: 1px solid var(--border-3-color);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;

    .list-header-item {
        color: var(--text-3-color);
        margin-bottom: 0.25rem;

        &.name {
            margin-left: calc(28px + 1rem);
            width: calc(140px - 4px);
        }

        &.role {
            width: 0px;
            margin-left: 0px;
            transition: 
                width 0.35s cubic-bezier(0.075, 0.82, 0.165, 1),
                margin-left 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
            overflow: hidden;
        }

        &.email {
            margin-left: calc(0.5rem + 3px);
        }
    }
}

ul {
    gap: 0.5rem;
    margin-top: 0.25rem;
}

.empty-list {
    width: 100%;

    p {
        display: flex;
        justify-content: center;
        color: var(--text-5-color);
        font-weight: 300;

        font-family: var(--inter-font-stack);
        //oblique rotation by 2 deg
        font-style: oblique;

        
    }
}
</style>