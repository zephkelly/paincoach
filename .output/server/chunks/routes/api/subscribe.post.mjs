import { d as defineEventHandler, u as useRuntimeConfig, r as readBody, c as createError, a as createUser, s as setResponseStatus } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'pg';
import 'node:url';

const subscribe_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const { email } = body;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw createError({
      statusCode: 400,
      statusText: "Bad Request",
      message: "Invalid email address."
    });
  }
  const dc = config.mailchimpDc;
  const listId = config.mailchimpListId;
  const apiKey = config.mailchimpApiKey;
  const transactionalApiKey = config.mailchimpTransactionalApiKey;
  try {
    const demoToken = generateHexToken(10);
    const unsubscribeToken = generateHexToken(18);
    const newUser = {
      email,
      unsubscribe_token: unsubscribeToken,
      demo_token: demoToken,
      demo_visit_count: 0
    };
    await createUser(newUser);
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`any:${apiKey}`).toString("base64")}`
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        merge_fields: {
          DEMO_TOKEN: demoToken,
          USUB_TOKEN: unsubscribeToken
        }
      })
    });
    const transactionalResponse = await sendTemplateEmail(email, transactionalApiKey, unsubscribeToken, demoToken);
    console.log("Transactional API Response:", transactionalResponse);
    setResponseStatus(event, 201);
    return {
      statusCode: 201,
      statusText: "Created",
      message: "User subscribed to Pain Coach demo.",
      data: {
        success: true
      }
    };
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
});
function generateHexToken(length) {
  const characters = "0123456789ABCDEF";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
async function sendTemplateEmail(email, transactionKey, unsubscribeToken, demoToken) {
  const url = "https://mandrillapp.com/api/1.0/messages/send-template.json";
  try {
    const response = await $fetch(url, {
      method: "POST",
      body: JSON.stringify({
        key: transactionKey,
        template_name: "pain-coach-demo-link",
        template_content: [],
        merge_language: "MailChimp",
        message: {
          to: [{ email }],
          subject: "Explore the Pain Coach demo today",
          from_email: "lachlan@physiopaincoach.com.au",
          from_name: "Lachlan Townend",
          merge_vars: [{
            rcpt: email,
            vars: [{
              name: "DEMO_TOKEN",
              content: demoToken
            }, {
              name: "USUB_TOKEN",
              content: unsubscribeToken
            }]
          }]
        }
      })
    });
    return response;
  } catch (error) {
    console.error("Transactional API Error:", error);
    throw error;
  }
}

export { subscribe_post as default };
//# sourceMappingURL=subscribe.post.mjs.map
