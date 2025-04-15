<template>
    <nav>
        <ul>
            <li :class="{ active: isActive('/') }">
                <NuxtLink to="/" class="nav-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></g></svg>
                </NuxtLink>
            </li>
            <li :class="{ active: isActive('/record') }">
                <NuxtLink to="/record" class="nav-link" :class="{ active: isActive('/about') }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2"/><circle cx="12" cy="12" r="3"/></g></svg>
                </NuxtLink>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
const route = useRoute()

const isActive = (path: string) => {
    return route.path === path
}
</script>

<style lang="scss" scoped>
nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    box-sizing: border-box;
    height: 86px;
    padding: 1rem;
    padding-bottom: 2rem;

    background-color: var(--panel-color);

    z-index: 100;
}

ul {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
}

li {
    display: flex;
    width: 44px;
    height: 44px;
    border-radius: 50%;

    &:hover {
        background-color: var(--panel-color);

        svg {
            opacity: 1;
        }
    }

    &.active {
        svg {
            opacity: 0.9;
        }
    }

    a {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    svg {
        color: var(--text-color);
        opacity: 0.5;
        transition: opacity 0.35s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
}
</style>