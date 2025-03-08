import { type ABVariant } from "./../types";



// Requires nuxt-auth-utils module
export const useABTesting = () => {
    const variant = useState<ABVariant | undefined>('ab_variant', () => undefined);

    if (!variant.value) {
        const cookieVariant = useCookie('ab_variant')

        if (cookieVariant.value) {
            variant.value = cookieVariant.value as ABVariant
        }
    }

    const {
        user
    // @ts-expect-error
    } = useUserSession();

    const toggleVariant = () => {
        if (user.value?.user_type !== 'admin') return;

        if (variant.value === 'A') {
            variant.value = 'B'
        }
        else {
            variant.value = 'A'
        }
    }

    return {
        variant,
        toggleVariant
    }
}