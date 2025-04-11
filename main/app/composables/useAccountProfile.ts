export const useAccountProfile = () => { 
    const accountProfileModalOpen = useState<boolean>('accountProfileModalOpen', () => false)
    const lastClickEvent = useState<MouseEvent | null>('lastAccountProfileClickEvent', () => null);

    return {
        accountProfileModalOpen,
        lastClickEvent
    }
}