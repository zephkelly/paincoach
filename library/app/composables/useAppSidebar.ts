//@ts-expect-error
import { type UserSession } from '#auth-utils';



export const useAppSidebar = () => {
    const state = useState<{ open: boolean }>('app-sidebar', () => ({ 
        open: false 
    }));

    const { session, isIncompleteUser } = useAuth();

    function toggleOpen() {
        if (!session.value || !session.value.user || isIncompleteUser.value) {
            return;
        }

        state.value.open = !state.value.open;
    }

    function setOpen(open: boolean) {
        if (!session.value || !session.value.user || isIncompleteUser.value) {
            return;
        }
        
        state.value.open = open;
    }

    return {
        isAppSidebarOpen: computed(() => state.value.open),
        toggleOpen,
        setOpen
    }
}