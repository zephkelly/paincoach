import { H3Event } from 'h3'
import { type ABVariant } from './../../types'


export default defineEventHandler((event: H3Event) => {
    const abTestCookie = getCookie(event, 'ab_variant')

    let variant: ABVariant = abTestCookie as ABVariant
    
    if (variant === undefined || (variant !== 'A' && variant !== 'B')) {
        variant = Math.random() < 0.5 ? 'A' : 'B'
       
        setCookie(event, 'ab_variant', variant, {
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
            sameSite: 'lax'
        })
    }

    event.context.abVariant = variant
    return;
})