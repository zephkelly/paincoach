import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { useSSRContext, defineComponent, ref, mergeProps, unref } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc, e as useRoute } from './server.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'pg';
import 'node:url';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const _imports_0 = "" + buildAssetsURL("logo.BzcA4e4U.webp");
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const isDocked = ref(true);
    ref(null);
    const route = useRoute();
    ref(route.path);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: { docked: unref(isDocked) }
      }, _attrs))} data-v-15b8d2fb><div class="container section" data-v-15b8d2fb><nav data-v-15b8d2fb><ul data-v-15b8d2fb><li data-v-15b8d2fb><div class="image-container" data-v-15b8d2fb><button aria-label="Return to top of page." tabindex="0" data-v-15b8d2fb><img${ssrRenderAttr("src", _imports_0)} loading="eager" alt="Logo of Physio Pain Coach." data-v-15b8d2fb></button></div></li><li data-v-15b8d2fb></li></ul></nav></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navbar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-15b8d2fb"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "landingFooter",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-b6282222><div class="section container" data-v-b6282222><footer data-v-b6282222><div class="footer-content" data-v-b6282222><div class="footer-content left" data-v-b6282222><p class="trademark" data-v-b6282222>Physio Pain Coach \xA9 2024</p></div><div class="footer-content right" data-v-b6282222><button class="return" data-v-b6282222>Back to Top</button><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" data-v-b6282222><path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z" data-v-b6282222></path></svg></div></div></footer></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/landingFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-b6282222"]]);
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Navbar = __nuxt_component_0;
  const _component_LandingFooter = __nuxt_component_1;
  _push(`<!--[-->`);
  _push(ssrRenderComponent(_component_Navbar, null, null, _parent));
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(ssrRenderComponent(_component_LandingFooter, null, null, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-C1g4SYmT.mjs.map
