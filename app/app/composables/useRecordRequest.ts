export const useRecordRequest = () => { 
    const recordRequestModalOpen = useState<boolean>('recordRequestModalOpen', () => false)
    const lastClickEvent = useState<MouseEvent | null>('lastRecordRequestClickEvent', () => null);

    onMounted(() => {
        
    })

    return {
        recordRequestModalOpen,
        lastClickEvent
    }
}