<template>
    <div class="role-chip-container flex-row">
        <UserRoleChip
            v-for="role in orderedRoles"
            :key="role"
            :userRole="role"
            :class="{ 'primary-role': role === primaryRole }"
            paneled
            :collapsable="collapsable && (role !== primaryRole)"
            class="user-role"
        />
    </div>
</template>

<script lang="ts" setup>
import { type AllRoles } from '@@/shared/types/v1/role';


type UserRoleChipListProps = {
    roles: AllRoles[],
    primaryRole: AllRoles,
    collapsable: boolean
};

const props = defineProps<UserRoleChipListProps>();

const orderedRoles = computed(() => {
    if (!props.roles || props.roles.length === 0) return [];
    
    const primaryRole = props.primaryRole && props.roles.includes(props.primaryRole) 
        ? props.primaryRole 
        : props.roles[0];
    
    return [
        primaryRole,
        ...props.roles.filter(role => role !== primaryRole)
    ];
});
</script>

<style lang="scss" scoped>
.role-chip-container {
    display: flex;
    gap: 0.25rem;
    
    .primary-role {
        order: 0;
    }
    
    :not(.primary-role) {
        order: 1;
    }
    
    .app {
        order: 5;
    }
}
</style>