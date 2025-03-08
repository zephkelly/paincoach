export const useAppSidebar = () => {
    const state = useState<{ open: boolean }>('app-sidebar', () => ({ 
        open: false 
    }));

    function toggleOpen() {
        state.value.open = !state.value.open;
    }

    return {
        isAppSidebarOpen: computed(() => state.value.open),
        toggleOpen
    }
}