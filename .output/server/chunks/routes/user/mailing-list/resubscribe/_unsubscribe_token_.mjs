import { d as defineEventHandler, g as getRouterParams, c as createError, u as useRuntimeConfig, b as sendRedirect, e as useNitroApp } from '../../../../nitro/nitro.mjs';
import { g as getEmailHash } from '../../../../_/emailHash.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'pg';
import 'node:url';
import 'crypto';

const _unsubscribe_token_ = defineEventHandler(async (event) => {
  const routeParams = getRouterParams(event);
  const { unsubscribe_token } = routeParams;
  const nitroApp = useNitroApp();
  const client = await nitroApp.database.connect();
  try {
    const result = await client.query('UPDATE "private".users SET mailing_list = true WHERE unsubscribe_token = $1 RETURNING email', [unsubscribe_token]);
    if (result.rowCount === 0) {
      throw createError({
        statusCode: 404,
        statusText: "Not Found",
        message: "User not found."
      });
    }
    const email = result.rows[0].email;
    const config = useRuntimeConfig();
    const dc = config.mailchimpDc;
    const listId = config.mailchimpListId;
    const apiKey = config.mailchimpApiKey;
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${getEmailHash(email.toLowerCase())}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`any:${apiKey}`).toString("base64")}`
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed"
      })
    });
    return sendRedirect(event, `/`, 301);
  } catch (error) {
    console.error("Error unsubscribing user:", error);
    throw error;
  } finally {
    client.release();
  }
});

export { _unsubscribe_token_ as default };
//# sourceMappingURL=_unsubscribe_token_.mjs.map
