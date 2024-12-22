import { f as defineNuxtRouteMiddleware, a as navigateTo } from './server.mjs';
import 'vue';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'pg';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue/server-renderer';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const verifyDemoToken = defineNuxtRouteMiddleware((to, from) => {
  const token = to.params.token;
  if (!token || token === "") {
    return navigateTo("/");
  }
  if (!to.path.startsWith(`/demo/${token}`)) {
    return navigateTo("/");
  }
});

export { verifyDemoToken as default };
//# sourceMappingURL=verify-demo-token-BtP-Y51Z.mjs.map
