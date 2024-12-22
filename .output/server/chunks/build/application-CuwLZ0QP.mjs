import { useSSRContext, defineComponent, mergeProps, computed, unref, withCtx, openBlock, createBlock, createVNode, ref, watch } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-BftFs5bt.mjs';
import { e as useRoute, _ as _export_sfc } from './server.mjs';
import { u as useFactorsExpanded } from './useFactorsExpanded-KdlO_xOY.mjs';
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
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import './state-_I5XcLqc.mjs';

function useDemoToken() {
  const route = useRoute();
  const token = ref("");
  const baseDemoRoute = ref("");
  const updateToken = (newToken) => {
    if (newToken) {
      token.value = newToken;
      return;
    }
    const routeToken = route.params.token;
    if (typeof routeToken === "string") {
      token.value = routeToken;
      baseDemoRoute.value = "/demo/" + routeToken;
    }
  };
  updateToken();
  watch(() => route.params.token, (newToken) => {
    updateToken(newToken);
  });
  return {
    token,
    baseDemoRoute
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { isAnyFactorExpanded } = useFactorsExpanded();
    const anyFactorExpanded = computed(() => isAnyFactorExpanded());
    const { baseDemoRoute } = useDemoToken();
    const isOverviewActive = computed(() => {
      if (route.path === baseDemoRoute.value) {
        return true;
      } else if (route.path === baseDemoRoute.value + "/") {
        return true;
      }
      return false;
    });
    const isCalendarActive = computed(() => route.path === baseDemoRoute.value + "/calendar");
    const isInsightsActive = computed(() => route.path === baseDemoRoute.value + "/insights");
    const isSettingsActive = computed(() => route.path === baseDemoRoute.value + "/settings");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "navbar footer" }, _attrs))} data-v-84575eaf><div class="container" data-v-84575eaf>`);
      if (unref(anyFactorExpanded)) {
        _push(`<div class="overlay" data-v-84575eaf></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="collapse navbar-collapse" id="navbarNav" data-v-84575eaf><ul class="navbar-nav ml-auto" data-v-84575eaf><li class="nav-item" data-v-84575eaf>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(baseDemoRoute) + "/",
        class: ["nav-link overview", { active: unref(isOverviewActive) }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="${ssrRenderClass([{ active: unref(isOverviewActive) }, "overview"])}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" data-v-84575eaf${_scopeId}><path d="M240-200h133.85v-237.69h212.3V-200H720v-360L480-740.77 240-560v360Zm-60 60v-450l300-225.77L780-590v450H526.15v-237.69h-92.3V-140H180Zm300-330.38Z" data-v-84575eaf${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: ["overview", { active: unref(isOverviewActive) }],
                xmlns: "http://www.w3.org/2000/svg",
                height: "24px",
                viewBox: "0 -960 960 960",
                width: "24px",
                fill: "#e8eaed"
              }, [
                createVNode("path", { d: "M240-200h133.85v-237.69h212.3V-200H720v-360L480-740.77 240-560v360Zm-60 60v-450l300-225.77L780-590v450H526.15v-237.69h-92.3V-140H180Zm300-330.38Z" })
              ], 2))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="nav-item" data-v-84575eaf>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(baseDemoRoute) + "/calendar",
        class: ["nav-link", { active: unref(isCalendarActive) }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="${ssrRenderClass([{ active: unref(isCalendarActive) }, "calendar"])}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" data-v-84575eaf${_scopeId}><path d="M212.31-100Q182-100 161-121q-21-21-21-51.31v-535.38Q140-738 161-759q21-21 51.31-21h55.38v-84.61h61.54V-780h303.08v-84.61h60V-780h55.38Q778-780 799-759q21 21 21 51.31v535.38Q820-142 799-121q-21 21-51.31 21H212.31Zm0-60h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-375.38H200v375.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM200-607.69h560v-100q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v100Zm0 0V-720v112.31Zm280 210.77q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.04 0-14.69 10.34-25.04 10.35-10.34 25.04-10.34t25.04 10.34q10.34 10.35 10.34 25.04 0 14.7-10.34 25.04-10.35 10.35-25.04 10.35Zm-160 0q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.04 0-14.69 10.34-25.04 10.35-10.34 25.04-10.34t25.04 10.34q10.34 10.35 10.34 25.04 0 14.7-10.34 25.04-10.35 10.35-25.04 10.35Zm320 0q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.04 0-14.69 10.34-25.04 10.35-10.34 25.04-10.34t25.04 10.34q10.34 10.35 10.34 25.04 0 14.7-10.34 25.04-10.35 10.35-25.04 10.35ZM480-240q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.03 0-14.7 10.34-25.04 10.35-10.35 25.04-10.35t25.04 10.35q10.34 10.34 10.34 25.04 0 14.69-10.34 25.03Q494.69-240 480-240Zm-160 0q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.03 0-14.7 10.34-25.04 10.35-10.35 25.04-10.35t25.04 10.35q10.34 10.34 10.34 25.04 0 14.69-10.34 25.03Q334.69-240 320-240Zm320 0q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.03 0-14.7 10.34-25.04 10.35-10.35 25.04-10.35t25.04 10.35q10.34 10.34 10.34 25.04 0 14.69-10.34 25.03Q654.69-240 640-240Z" data-v-84575eaf${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: ["calendar", { active: unref(isCalendarActive) }],
                xmlns: "http://www.w3.org/2000/svg",
                height: "24px",
                viewBox: "0 -960 960 960",
                width: "24px",
                fill: "#e8eaed"
              }, [
                createVNode("path", { d: "M212.31-100Q182-100 161-121q-21-21-21-51.31v-535.38Q140-738 161-759q21-21 51.31-21h55.38v-84.61h61.54V-780h303.08v-84.61h60V-780h55.38Q778-780 799-759q21 21 21 51.31v535.38Q820-142 799-121q-21 21-51.31 21H212.31Zm0-60h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-375.38H200v375.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM200-607.69h560v-100q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v100Zm0 0V-720v112.31Zm280 210.77q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.04 0-14.69 10.34-25.04 10.35-10.34 25.04-10.34t25.04 10.34q10.34 10.35 10.34 25.04 0 14.7-10.34 25.04-10.35 10.35-25.04 10.35Zm-160 0q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.04 0-14.69 10.34-25.04 10.35-10.34 25.04-10.34t25.04 10.34q10.34 10.35 10.34 25.04 0 14.7-10.34 25.04-10.35 10.35-25.04 10.35Zm320 0q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.04 0-14.69 10.34-25.04 10.35-10.34 25.04-10.34t25.04 10.34q10.34 10.35 10.34 25.04 0 14.7-10.34 25.04-10.35 10.35-25.04 10.35ZM480-240q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.03 0-14.7 10.34-25.04 10.35-10.35 25.04-10.35t25.04 10.35q10.34 10.34 10.34 25.04 0 14.69-10.34 25.03Q494.69-240 480-240Zm-160 0q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.03 0-14.7 10.34-25.04 10.35-10.35 25.04-10.35t25.04 10.35q10.34 10.34 10.34 25.04 0 14.69-10.34 25.03Q334.69-240 320-240Zm320 0q-14.69 0-25.04-10.35-10.34-10.34-10.34-25.03 0-14.7 10.34-25.04 10.35-10.35 25.04-10.35t25.04 10.35q10.34 10.34 10.34 25.04 0 14.69-10.34 25.03Q654.69-240 640-240Z" })
              ], 2))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="nav-item" data-v-84575eaf>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(baseDemoRoute) + "/insights",
        class: ["nav-link", { active: unref(isInsightsActive) }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="${ssrRenderClass([{ active: unref(isInsightsActive) }, "insights"])}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" data-v-84575eaf${_scopeId}><path d="M294.62-290h59.99v-190h-59.99v190Zm310.77 0h59.99v-390h-59.99v390ZM450-290h60v-110h-60v110Zm0-190h60v-80h-60v80ZM212.31-140Q182-140 161-161q-21-21-21-51.31v-535.38Q140-778 161-799q21-21 51.31-21h535.38Q778-820 799-799q21 21 21 51.31v535.38Q820-182 799-161q-21 21-51.31 21H212.31Zm0-60h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-535.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM200-760v560-560Z" data-v-84575eaf${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: ["insights", { active: unref(isInsightsActive) }],
                xmlns: "http://www.w3.org/2000/svg",
                height: "24px",
                viewBox: "0 -960 960 960",
                width: "24px",
                fill: "#e8eaed"
              }, [
                createVNode("path", { d: "M294.62-290h59.99v-190h-59.99v190Zm310.77 0h59.99v-390h-59.99v390ZM450-290h60v-110h-60v110Zm0-190h60v-80h-60v80ZM212.31-140Q182-140 161-161q-21-21-21-51.31v-535.38Q140-778 161-799q21-21 51.31-21h535.38Q778-820 799-799q21 21 21 51.31v535.38Q820-182 799-161q-21 21-51.31 21H212.31Zm0-60h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-535.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM200-760v560-560Z" })
              ], 2))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="nav-item" data-v-84575eaf>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(baseDemoRoute) + "/settings",
        class: ["nav-link", { active: unref(isSettingsActive) }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="${ssrRenderClass([{ active: unref(isSettingsActive) }, "settings"])}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" data-v-84575eaf${_scopeId}><path d="m387.69-100-15.23-121.85q-16.07-5.38-32.96-15.07-16.88-9.7-30.19-20.77L196.46-210l-92.3-160 97.61-73.77q-1.38-8.92-1.96-17.92-.58-9-.58-17.93 0-8.53.58-17.34t1.96-19.27L104.16-590l92.3-159.23 112.46 47.31q14.47-11.46 30.89-20.96t32.27-15.27L387.69-860h184.62l15.23 122.23q18 6.54 32.57 15.27 14.58 8.73 29.43 20.58l114-47.31L855.84-590l-99.15 74.92q2.15 9.69 2.35 18.12.19 8.42.19 16.96 0 8.15-.39 16.58-.38 8.42-2.76 19.27L854.46-370l-92.31 160-112.61-48.08q-14.85 11.85-30.31 20.96-15.46 9.12-31.69 14.89L572.31-100H387.69ZM440-160h78.62L533-267.15q30.62-8 55.96-22.73 25.35-14.74 48.89-37.89L737.23-286l39.39-68-86.77-65.38q5-15.54 6.8-30.47 1.81-14.92 1.81-30.15 0-15.62-1.81-30.15-1.8-14.54-6.8-29.7L777.38-606 738-674l-100.54 42.38q-20.08-21.46-48.11-37.92-28.04-16.46-56.73-23.31L520-800h-79.38l-13.24 106.77q-30.61 7.23-56.53 22.15-25.93 14.93-49.47 38.46L222-674l-39.38 68L269-541.62q-5 14.24-7 29.62t-2 32.38q0 15.62 2 30.62 2 15 6.62 29.62l-86 65.38L222-286l99-42q22.77 23.38 48.69 38.31 25.93 14.92 57.31 22.92L440-160Zm40.46-200q49.92 0 84.96-35.04 35.04-35.04 35.04-84.96 0-49.92-35.04-84.96Q530.38-600 480.46-600q-50.54 0-85.27 35.04T360.46-480q0 49.92 34.73 84.96Q429.92-360 480.46-360ZM480-480Z" data-v-84575eaf${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: ["settings", { active: unref(isSettingsActive) }],
                xmlns: "http://www.w3.org/2000/svg",
                height: "24px",
                viewBox: "0 -960 960 960",
                width: "24px",
                fill: "#e8eaed"
              }, [
                createVNode("path", { d: "m387.69-100-15.23-121.85q-16.07-5.38-32.96-15.07-16.88-9.7-30.19-20.77L196.46-210l-92.3-160 97.61-73.77q-1.38-8.92-1.96-17.92-.58-9-.58-17.93 0-8.53.58-17.34t1.96-19.27L104.16-590l92.3-159.23 112.46 47.31q14.47-11.46 30.89-20.96t32.27-15.27L387.69-860h184.62l15.23 122.23q18 6.54 32.57 15.27 14.58 8.73 29.43 20.58l114-47.31L855.84-590l-99.15 74.92q2.15 9.69 2.35 18.12.19 8.42.19 16.96 0 8.15-.39 16.58-.38 8.42-2.76 19.27L854.46-370l-92.31 160-112.61-48.08q-14.85 11.85-30.31 20.96-15.46 9.12-31.69 14.89L572.31-100H387.69ZM440-160h78.62L533-267.15q30.62-8 55.96-22.73 25.35-14.74 48.89-37.89L737.23-286l39.39-68-86.77-65.38q5-15.54 6.8-30.47 1.81-14.92 1.81-30.15 0-15.62-1.81-30.15-1.8-14.54-6.8-29.7L777.38-606 738-674l-100.54 42.38q-20.08-21.46-48.11-37.92-28.04-16.46-56.73-23.31L520-800h-79.38l-13.24 106.77q-30.61 7.23-56.53 22.15-25.93 14.93-49.47 38.46L222-674l-39.38 68L269-541.62q-5 14.24-7 29.62t-2 32.38q0 15.62 2 30.62 2 15 6.62 29.62l-86 65.38L222-286l99-42q22.77 23.38 48.69 38.31 25.93 14.92 57.31 22.92L440-160Zm40.46-200q49.92 0 84.96-35.04 35.04-35.04 35.04-84.96 0-49.92-35.04-84.96Q530.38-600 480.46-600q-50.54 0-85.27 35.04T360.46-480q0 49.92 34.73 84.96Q429.92-360 480.46-360ZM480-480Z" })
              ], 2))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div></div></nav>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/navbar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Navbar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-84575eaf"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "application",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "app" }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(ssrRenderComponent(Navbar, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/application.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=application-CuwLZ0QP.mjs.map
