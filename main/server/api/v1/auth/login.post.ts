import { handleLoginCredentials } from "~~/server/utils/auth/handlers/login";


export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    
    return await handleLoginCredentials(event, body);
});