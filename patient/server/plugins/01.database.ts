import { DatabaseService } from '~~lib/server/services/databaseService'


export default defineNitroPlugin(async (nitroApp) => {
    const databaseServiceInstance = DatabaseService.getInstance()
    try {
        await databaseServiceInstance.query('SELECT 1')

        console.log('DatabaseService: Connection established')
    }
    catch (error) {
        console.error('DatabaseService: Failed to establish database connection:', error)
        throw error
    }

    nitroApp.hooks.hook('request', (event) => {
        event.context.database = databaseServiceInstance
    })

    nitroApp.hooks.hook('close', async () => {
        await databaseServiceInstance.shutdown()
    })
})