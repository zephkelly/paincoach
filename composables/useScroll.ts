export function useScroll() {
    const smoothScroll = (target: string | HTMLElement, offset: number = 0) => {
        let element: HTMLElement | null;
        
        if (typeof target === 'string') {
        element = document.querySelector(target);
        } else {
        element = target;
        }

        if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
        });
        }
    }

    const scrollToTop = () => {
        smoothScroll('body');
    }

    return {
        smoothScroll,
        scrollToTop
    }
}