<template>
    <div class="admin-users-overview">
        <ul>
            <li v-for="user in adminUsers">
                <p>{{user.first_name }}</p>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { type AdminUser } from '~~lib/shared/types/users/admin'

type Props = {
    users: AdminUser[];
}

const props = defineProps<Props>();

const {
    adminUsers
} = await useUsers();
</script>