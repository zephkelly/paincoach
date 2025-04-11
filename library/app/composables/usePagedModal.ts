interface PageValidations {
  [pageIndex: number]: boolean;
}

interface ModalProps {
  isOpen: boolean;
  currentPage: number;
}

interface ModalEvents {
  'update:currentPage': (page: number) => void;
  close: () => void;
  finish: () => void;
}

export function usePagedModal() {
  const isModalOpen = ref<boolean>(false);
  const currentPage = ref<number>(0);
  const pageValidations = ref<PageValidations>({});
  
  const openModal = (initialPage: number = 0): void => {
    currentPage.value = initialPage;
    isModalOpen.value = true;
  };
  
  const closeModal = (): void => {
    isModalOpen.value = false;
    // Reset current page after closing
    setTimeout(() => {
      currentPage.value = 0;
    }, 300);
  };
  
  const setPageValidation = (pageIndex: number, isValid: boolean): void => {
    pageValidations.value = {
      ...pageValidations.value,
      [pageIndex]: isValid
    };
  };
  
  const isPageValid = (pageIndex: number): boolean => {
    return pageValidations.value[pageIndex] !== false;
  };
  
  const modalProps: ComputedRef<ModalProps> = computed(() => ({
    isOpen: isModalOpen.value,
    currentPage: currentPage.value
  }));
  
  const modalEvents: ModalEvents = {
    'update:currentPage': (page: number): void => {
      currentPage.value = page;
    },
    close: closeModal,
    finish: (): void => {
      // Handle finish event
      console.log('Modal finished');
      closeModal();
    }
  };
  
  return {
    isModalOpen,
    currentPage,
    openModal,
    closeModal,
    setPageValidation,
    isPageValid,
    modalProps,
    modalEvents
  };
}