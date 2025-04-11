import { EmailService } from '~~/server/services/emailService'



export default defineNitroPlugin((nitroApp: any) => {
    console.log('EmailService: Startup')

    const emailService = EmailService.getInstance()

    nitroApp.hooks.hook('close', async () => {
        console.log('EmailService: Shutdown')
        await emailService.shutdown()
    })
})