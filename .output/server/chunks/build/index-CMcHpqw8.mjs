import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { defineComponent, useSSRContext, ref, mergeProps, unref, withCtx, renderSlot, createTextVNode, createVNode, openBlock, createBlock, watch } from 'vue';
import { u as useHead } from './index-C2merokO.mjs';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-BftFs5bt.mjs';
import { u as useScroll } from './useScroll-jpfBEZIf.mjs';
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

const removeUndefinedProps = (props) => {
  const filteredProps = /* @__PURE__ */ Object.create(null);
  for (const key in props) {
    const value = props[key];
    if (value !== void 0) {
      filteredProps[key] = value;
    }
  }
  return filteredProps;
};
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useHead(() => metaFactory({ ...removeUndefinedProps(props), ...ctx.attrs }, ctx));
  return () => {
    var _a, _b;
    return renderChild ? (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: [String, Object, Array],
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
defineComponent({
  name: "NoScript",
  inheritAttrs: false,
  props: {
    ...globalProps,
    title: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props, { slots }) => {
    var _a;
    const noscript = { ...props };
    const slotVnodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
    const textContent = slotVnodes ? slotVnodes.filter(({ children }) => children).map(({ children }) => children).join("") : "";
    if (textContent) {
      noscript.children = textContent;
    }
    return {
      noscript: [noscript]
    };
  })
});
defineComponent({
  name: "Link",
  inheritAttrs: false,
  props: {
    ...globalProps,
    as: String,
    crossorigin: String,
    disabled: Boolean,
    fetchpriority: String,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    /** @deprecated **/
    methods: String,
    /** @deprecated **/
    target: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((link) => ({
    link: [link]
  }))
});
defineComponent({
  name: "Base",
  inheritAttrs: false,
  props: {
    ...globalProps,
    href: String,
    target: String
  },
  setup: setupForUseMeta((base) => ({
    base
  }))
});
defineComponent({
  name: "Title",
  inheritAttrs: false,
  setup: setupForUseMeta((_, { slots }) => {
    var _a, _b, _c;
    return {
      title: ((_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children) || null
    };
  })
});
defineComponent({
  name: "Meta",
  inheritAttrs: false,
  props: {
    ...globalProps,
    charset: String,
    content: String,
    httpEquiv: String,
    name: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props) => {
    const meta = { ...props };
    if (meta.httpEquiv) {
      meta["http-equiv"] = meta.httpEquiv;
      delete meta.httpEquiv;
    }
    return {
      meta: [meta]
    };
  })
});
defineComponent({
  name: "Style",
  inheritAttrs: false,
  props: {
    ...globalProps,
    type: String,
    media: String,
    nonce: String,
    title: String,
    /** @deprecated **/
    scoped: {
      type: Boolean,
      default: void 0
    },
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props, { slots }) => {
    var _a, _b, _c;
    const style = { ...props };
    const textContent = (_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children;
    if (textContent) {
      style.children = textContent;
    }
    return {
      style: [style]
    };
  })
});
const Head = defineComponent({
  name: "Head",
  inheritAttrs: false,
  setup: (_props, ctx) => () => {
    var _a, _b;
    return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
  }
});
defineComponent({
  name: "Html",
  inheritAttrs: false,
  props: {
    ...globalProps,
    manifest: String,
    version: String,
    xmlns: String,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
defineComponent({
  name: "Body",
  inheritAttrs: false,
  props: {
    ...globalProps,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((bodyAttrs) => ({ bodyAttrs }), true)
});
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "scrollToReveal",
  __ssrInlineRender: true,
  props: {
    threshold: {
      type: Number,
      default: 0.2
    },
    centerAlign: {
      type: Boolean,
      default: false
    },
    fillParent: {
      type: Boolean,
      default: false
    }
  },
  emits: ["visible"],
  setup(__props, { emit: __emit }) {
    const revealEl = ref(null);
    const isVisible = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "revealEl",
        ref: revealEl,
        class: ["reveal-element", { "is-visible": unref(isVisible) }, { center: __props.centerAlign }, { "fill-parent": __props.fillParent }]
      }, _attrs))} data-v-985ca846>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/scrollToReveal.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-985ca846"]]);
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "button",
  __ssrInlineRender: true,
  props: {
    to: String,
    ariaLabel: String
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      if (props.to) {
        _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
          class: "button link",
          to: __props.to,
          "aria-label": __props.ariaLabel
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "default", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
      } else {
        _push(`<button${ssrRenderAttrs(mergeProps({
          class: "button",
          "aria-label": __props.ariaLabel
        }, _attrs))} data-v-5527ccc9>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</button>`);
      }
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/button.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-5527ccc9"]]);
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "iphoneMockup",
  __ssrInlineRender: true,
  props: {
    src: {},
    halfScreen: { type: Boolean },
    fullWidth: { type: Boolean },
    nofade: { type: Boolean },
    loading: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["mockup-container", { half: _ctx.halfScreen, "full-width": _ctx.fullWidth }]
      }, _attrs))} data-v-bf896e7a>`);
      if (_ctx.halfScreen && !_ctx.nofade) {
        _push(`<div class="fade" data-v-bf896e7a></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500" alt="Graphic icon of an iphone used to display example photos from the mobile application." data-v-bf896e7a><title data-v-bf896e7a>phone_14_01</title><defs data-v-bf896e7a><linearGradient id="g1" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,51.778,-1.226,0,356.834,144.368)" data-v-bf896e7a><stop offset="0" stop-color="#68595f" data-v-bf896e7a></stop><stop offset=".019" stop-color="#896e80" data-v-bf896e7a></stop><stop offset=".038" stop-color="#5e3b5b" data-v-bf896e7a></stop><stop offset=".082" stop-color="#2b1d2a" data-v-bf896e7a></stop><stop offset=".105" stop-color="#704a6a" data-v-bf896e7a></stop><stop offset=".905" stop-color="#615060" data-v-bf896e7a></stop><stop offset=".939" stop-color="#2b1d2a" data-v-bf896e7a></stop><stop offset=".965" stop-color="#5e3b5b" data-v-bf896e7a></stop><stop offset=".983" stop-color="#845675" data-v-bf896e7a></stop><stop offset="1" stop-color="#5b4a5c" data-v-bf896e7a></stop></linearGradient><linearGradient id="g2" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,51.767,-0.613,0,357.447,144.382)" data-v-bf896e7a><stop offset="0" stop-color="#676067" data-v-bf896e7a></stop><stop offset=".064" stop-color="#654e63" data-v-bf896e7a></stop><stop offset=".186" stop-color="#786f77" data-v-bf896e7a></stop><stop offset=".806" stop-color="#786f77" data-v-bf896e7a></stop><stop offset=".919" stop-color="#654e63" data-v-bf896e7a></stop><stop offset="1" stop-color="#676067" data-v-bf896e7a></stop></linearGradient><linearGradient id="g3" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,32.8,.7,0,144.758,133.469)" data-v-bf896e7a><stop offset="0" stop-color="#68595f" data-v-bf896e7a></stop><stop offset=".019" stop-color="#896e80" data-v-bf896e7a></stop><stop offset=".038" stop-color="#5e3b5b" data-v-bf896e7a></stop><stop offset=".082" stop-color="#2d1e2c" data-v-bf896e7a></stop><stop offset=".105" stop-color="#704a6a" data-v-bf896e7a></stop><stop offset=".905" stop-color="#615060" data-v-bf896e7a></stop><stop offset=".939" stop-color="#2d1e2c" data-v-bf896e7a></stop><stop offset=".965" stop-color="#5e3b5b" data-v-bf896e7a></stop><stop offset=".983" stop-color="#845675" data-v-bf896e7a></stop><stop offset="1" stop-color="#5b4a5c" data-v-bf896e7a></stop></linearGradient><linearGradient id="g4" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,32.793,.35,0,144.408,133.478)" data-v-bf896e7a><stop offset="0" stop-color="#676067" data-v-bf896e7a></stop><stop offset=".064" stop-color="#654e63" data-v-bf896e7a></stop><stop offset=".186" stop-color="#786f77" data-v-bf896e7a></stop><stop offset=".806" stop-color="#786f77" data-v-bf896e7a></stop><stop offset=".919" stop-color="#654e63" data-v-bf896e7a></stop><stop offset="1" stop-color="#676067" data-v-bf896e7a></stop></linearGradient><linearGradient id="g5" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,-32.802,1434.593,0,-571.464,166.279)" data-v-bf896e7a><stop offset="0" stop-color="#68595f" data-v-bf896e7a></stop><stop offset=".053" stop-color="#2d1e2c" data-v-bf896e7a></stop><stop offset=".518" stop-color="#5e3b5b" data-v-bf896e7a></stop><stop offset=".965" stop-color="#2d1e2c" data-v-bf896e7a></stop><stop offset="1" stop-color="#5b4a5c" data-v-bf896e7a></stop></linearGradient><linearGradient id="g6" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,32.8,.7,0,144.758,174.735)" data-v-bf896e7a><stop offset="0" stop-color="#68595f" data-v-bf896e7a></stop><stop offset=".019" stop-color="#896e80" data-v-bf896e7a></stop><stop offset=".038" stop-color="#5e3b5b" data-v-bf896e7a></stop><stop offset=".082" stop-color="#2d1e2c" data-v-bf896e7a></stop><stop offset=".105" stop-color="#704a6a" data-v-bf896e7a></stop><stop offset=".905" stop-color="#615060" data-v-bf896e7a></stop><stop offset=".939" stop-color="#2d1e2c" data-v-bf896e7a></stop><stop offset=".965" stop-color="#5e3b5b" data-v-bf896e7a></stop><stop offset=".983" stop-color="#845675" data-v-bf896e7a></stop><stop offset="1" stop-color="#5b4a5c" data-v-bf896e7a></stop></linearGradient><linearGradient id="g7" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,32.793,.35,0,144.408,174.744)" data-v-bf896e7a><stop offset="0" stop-color="#676067" data-v-bf896e7a></stop><stop offset=".064" stop-color="#654e63" data-v-bf896e7a></stop><stop offset=".186" stop-color="#786f77" data-v-bf896e7a></stop><stop offset=".806" stop-color="#786f77" data-v-bf896e7a></stop><stop offset=".919" stop-color="#654e63" data-v-bf896e7a></stop><stop offset="1" stop-color="#676067" data-v-bf896e7a></stop></linearGradient><linearGradient id="g8" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,-32.802,1434.593,0,-571.464,207.545)" data-v-bf896e7a><stop offset="0" stop-color="#68595f" data-v-bf896e7a></stop><stop offset=".053" stop-color="#2d1e2c" data-v-bf896e7a></stop><stop offset=".518" stop-color="#5e3b5b" data-v-bf896e7a></stop><stop offset=".965" stop-color="#2d1e2c" data-v-bf896e7a></stop><stop offset="1" stop-color="#5b4a5c" data-v-bf896e7a></stop></linearGradient><linearGradient id="g9" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,16.836,.7,0,144.758,102.479)" data-v-bf896e7a><stop offset="0" stop-color="#68595f" data-v-bf896e7a></stop><stop offset=".019" stop-color="#896e80" data-v-bf896e7a></stop><stop offset=".038" stop-color="#5e3b5b" data-v-bf896e7a></stop><stop offset=".082" stop-color="#2d1e2c" data-v-bf896e7a></stop><stop offset=".105" stop-color="#704a6a" data-v-bf896e7a></stop><stop offset=".905" stop-color="#615060" data-v-bf896e7a></stop><stop offset=".939" stop-color="#2d1e2c" data-v-bf896e7a></stop><stop offset=".965" stop-color="#5e3b5b" data-v-bf896e7a></stop><stop offset=".983" stop-color="#845675" data-v-bf896e7a></stop><stop offset="1" stop-color="#5b4a5c" data-v-bf896e7a></stop></linearGradient><linearGradient id="g10" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,16.829,.35,0,144.408,102.487)" data-v-bf896e7a><stop offset="0" stop-color="#676067" data-v-bf896e7a></stop><stop offset=".064" stop-color="#654e63" data-v-bf896e7a></stop><stop offset=".186" stop-color="#786f77" data-v-bf896e7a></stop><stop offset=".806" stop-color="#786f77" data-v-bf896e7a></stop><stop offset=".919" stop-color="#654e63" data-v-bf896e7a></stop><stop offset="1" stop-color="#676067" data-v-bf896e7a></stop></linearGradient><linearGradient id="g11" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,-16.837,377.975,0,-43.155,119.324)" data-v-bf896e7a><stop offset="0" stop-color="#68595f" data-v-bf896e7a></stop><stop offset=".053" stop-color="#2d1e2c" data-v-bf896e7a></stop><stop offset=".518" stop-color="#5e3b5b" data-v-bf896e7a></stop><stop offset=".965" stop-color="#2d1e2c" data-v-bf896e7a></stop><stop offset="1" stop-color="#5b4a5c" data-v-bf896e7a></stop></linearGradient><linearGradient id="g12" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,-5.861,5.862,0,261.866,60.635)" data-v-bf896e7a><stop offset="0" stop-color="#666666" data-v-bf896e7a></stop><stop offset="1" stop-color="#010104" data-v-bf896e7a></stop></linearGradient><linearGradient id="g13" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(2.465,2.866,-2.866,2.465,263.659,56.142)" data-v-bf896e7a><stop offset="0" stop-color="#171919" data-v-bf896e7a></stop><stop offset="1" stop-color="#4e4f51" data-v-bf896e7a></stop></linearGradient><linearGradient id="g14" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,3.349,-3.349,0,266.541,56.248)" data-v-bf896e7a><stop offset="0" stop-color="#0b131c" data-v-bf896e7a></stop><stop offset="1" stop-color="#354039" data-v-bf896e7a></stop></linearGradient><linearGradient id="g15" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-2.975,-2.975,2.975,-2.975,264.841,60.819)" data-v-bf896e7a><stop offset="0" stop-color="#231f20" data-v-bf896e7a></stop><stop offset=".785" stop-color="#0095ee" data-v-bf896e7a></stop><stop offset="1" stop-color="#231f20" data-v-bf896e7a></stop></linearGradient><radialGradient id="g16" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.488,0,0,1.488,264.841,57.844)" data-v-bf896e7a><stop offset="0" stop-color="#231f20" data-v-bf896e7a></stop><stop offset=".733" stop-color="#00adee" data-v-bf896e7a></stop><stop offset="1" stop-color="#231f20" data-v-bf896e7a></stop></radialGradient><radialGradient id="g17" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(.531,0,0,.531,265.658,58.62)" data-v-bf896e7a><stop offset="0" stop-color="#cccccc" data-v-bf896e7a></stop><stop offset="1" stop-color="#000000" data-v-bf896e7a></stop></radialGradient></defs><g id="Layer 1" data-v-bf896e7a><path id="&lt;Path&gt;" class="s0" d="m322 464.2h-142.2c-18.6 0-33.6-15-33.6-33.6v-362.4c0-18.6 15-33.6 33.6-33.6h142.2c18.6 0 33.6 15 33.6 33.6v362.4c0 18.6-15 33.6-33.6 33.6z" data-v-bf896e7a></path><path id="&lt;Path&gt;" fill-rule="evenodd" class="s1" d="m321.2 460.9h-140.6c-17 0-30.8-13.8-30.8-30.8v-361.4c0-17 13.8-30.8 30.8-30.8h140.6c17 0 30.9 13.8 30.9 30.8v361.4c0 17-13.9 30.8-30.9 30.8z" data-v-bf896e7a></path><clipPath id="screenClip" data-v-bf896e7a><path d="m305 44.7h16.4c13.2 0 24 10.8 24 24.1v361.2c0 13.3-10.8 24.1-24 24.1h-140.9c-13.3 0-24.1-10.8-24.1-24.1v-361.2c0-13.3 10.8-24.1 24.1-24.1 5.2 0 10.5 0 16.1 0z" data-v-bf896e7a></path></clipPath><image x="156.4" y="44.7" width="188.4" height="409.4" clip-path="url(#screenClip)"${ssrRenderAttr("href", _ctx.src)}${ssrRenderAttr("loading", _ctx.loading)} preserveAspectRatio="xMidYMid slice" data-v-bf896e7a></image><g id="&lt;Group&gt;" data-v-bf896e7a><g id="&lt;Group&gt;" data-v-bf896e7a><path id="&lt;Path&gt;" class="s3" d="m355.6 196.1v-51.7h1.2v51.7z" data-v-bf896e7a></path><path id="&lt;Path&gt;" class="s4" d="m356.8 196.1v-51.7l0.6 0.7c-0.3 5.5-0.2 44.9 0 50.4z" data-v-bf896e7a></path></g><g id="&lt;Group&gt;" data-v-bf896e7a><path id="&lt;Path&gt;" class="s5" d="m145.5 166.3v-32.8h-0.7v32.8z" data-v-bf896e7a></path><path id="&lt;Path&gt;" class="s6" d="m144.8 166.3v-32.8l-0.4 0.4c0.2 3.5 0.2 28.5 0 31.9z" data-v-bf896e7a></path><path id="&lt;Path&gt;" class="s7" d="m146.2 166.3h-0.7v-32.8h0.7z" data-v-bf896e7a></path></g><g id="&lt;Group&gt;" data-v-bf896e7a><path id="&lt;Path&gt;" class="s8" d="m145.5 207.5v-32.8h-0.7v32.8z" data-v-bf896e7a></path><path id="&lt;Path&gt;" class="s9" d="m144.8 207.5v-32.8l-0.4 0.5c0.2 3.5 0.2 28.4 0 31.9z" data-v-bf896e7a></path><path id="&lt;Path&gt;" class="s10" d="m146.2 207.5h-0.7v-32.8h0.7z" data-v-bf896e7a></path></g><g id="&lt;Group&gt;" data-v-bf896e7a><path id="&lt;Path&gt;" class="s11" d="m145.5 119.3v-16.8h-0.7v16.8z" data-v-bf896e7a></path><path id="&lt;Path&gt;" class="s12" d="m144.8 119.3v-16.8l-0.4 0.4c0.2 3.3 0.2 12.7 0 16z" data-v-bf896e7a></path><path id="&lt;Path&gt;" class="s13" d="m146.2 119.3h-0.7v-16.8h0.7z" data-v-bf896e7a></path></g></g><g id="&lt;Group&gt;" style="${ssrRenderStyle({ "mix-blend-mode": "multiply" })}" data-v-bf896e7a><path id="&lt;Path&gt;" class="s1" d="m266.7 64.7h-33.4c-3.8 0-6.8-3.1-6.8-6.9 0-3.7 3-6.8 6.8-6.8h33.4c3.8 0 6.8 3.1 6.8 6.8 0 3.8-3 6.9-6.8 6.9z" data-v-bf896e7a></path><g id="&lt;Group&gt;" data-v-bf896e7a><path id="&lt;Path&gt;" class="s14" d="m267.8 57.8c0 1.7-1.3 3-3 3-1.6 0-2.9-1.3-2.9-3 0-1.6 1.3-2.9 2.9-2.9 1.7 0 3 1.3 3 2.9z" data-v-bf896e7a></path><path id="&lt;Mesh&gt;" class="s15" d="m262.9 59.8q0.5 0.5 1.1 0.7c-0.1-0.5-0.3-0.9-0.4-1.5-0.4-0.1-1.1-0.2-1.4-0.3q0.2 0.6 0.7 1.1zm-0.7-1.1c0.3 0.1 1 0.2 1.4 0.3-0.1-0.9-0.1-1.9 0.1-2.9-0.5 0.1-0.9 0.2-1.3 0.4-0.4 0.7-0.4 1.5-0.2 2.2zm0.2-2.2c0.4-0.2 0.8-0.3 1.3-0.4 0-0.3 0.2-0.7 0.3-0.9q-0.6 0.2-1.1 0.7-0.3 0.3-0.5 0.6zm1.6 4c0.6 0.2 1.2 0.2 1.8 0 0.1-0.4 0.3-0.9 0.3-1.5-0.6 0.1-1.9 0.1-2.5 0 0.1 0.6 0.3 1 0.4 1.5zm-0.4-1.5c0.6 0.1 1.9 0.1 2.5 0 0.1-1 0.1-2.1-0.1-2.9-0.7-0.1-1.7-0.1-2.3 0-0.2 1-0.2 2-0.1 2.9zm0.1-2.9c0.6-0.1 1.6-0.1 2.3 0 0-0.3-0.1-0.7-0.2-0.9-0.6-0.2-1.2-0.2-1.8 0-0.1 0.2-0.3 0.6-0.3 0.9zm2.1 4.4q0.6-0.3 1-0.7 0.5-0.5 0.7-1.1c-0.3 0.1-1 0.2-1.4 0.3 0 0.6-0.2 1.1-0.3 1.5zm0.3-1.5c0.4-0.1 1.1-0.2 1.4-0.3 0.2-0.7 0.1-1.5-0.2-2.2-0.4-0.2-0.8-0.3-1.3-0.4 0.2 0.8 0.2 1.9 0.1 2.9zm-0.1-2.9c0.5 0.1 0.9 0.2 1.3 0.4q-0.2-0.3-0.5-0.6-0.4-0.5-1-0.7c0.1 0.2 0.2 0.6 0.2 0.9z" data-v-bf896e7a></path><path id="&lt;Path&gt;" class="s16" d="m263.1 57.8c0-0.9 0.8-1.7 1.7-1.7 1 0 1.7 0.8 1.7 1.7 0 1-0.7 1.7-1.7 1.7-0.9 0-1.7-0.7-1.7-1.7z" data-v-bf896e7a></path><g id="Camera 00000181771962106803296260000008551096653390836141 " data-v-bf896e7a><path id="&lt;Path&gt;" class="s17" d="m266.3 57.8c0 0.9-0.6 1.5-1.5 1.5-0.8 0-1.4-0.6-1.4-1.5 0-0.8 0.6-1.4 1.4-1.4 0.9 0 1.5 0.6 1.5 1.4z" data-v-bf896e7a></path><path id="&lt;Path&gt;" class="s18" d="m266.3 57.8c0 0.9-0.6 1.5-1.5 1.5-0.8 0-1.4-0.6-1.4-1.5 0-0.8 0.6-1.4 1.4-1.4 0.9 0 1.5 0.6 1.5 1.4z" data-v-bf896e7a></path></g><path id="&lt;Path&gt;" class="s19" d="m266.2 58.6c0-0.3-0.2-0.5-0.5-0.5-0.3 0-0.6 0.2-0.6 0.5 0 0.3 0.3 0.6 0.6 0.6 0.3 0 0.5-0.3 0.5-0.6z" data-v-bf896e7a></path></g></g></g></svg></div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/iphoneMockup.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-bf896e7a"]]);
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "hero",
  __ssrInlineRender: true,
  setup(__props) {
    const { smoothScroll } = useScroll();
    const handleClick = () => {
      smoothScroll("#waitlist", 0);
      console.log("clicked");
    };
    const handleKeyDown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        smoothScroll("#waitlist", 0);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BaseButton = __nuxt_component_0;
      const _component_IphoneMockup = __nuxt_component_1;
      _push(`<section${ssrRenderAttrs(_attrs)} data-v-5a00d69b><div class="container section" data-v-5a00d69b><h1 tabindex="0" class="introduction" data-v-5a00d69b><span class="mobile-hidden" data-v-5a00d69b>Introducing</span> <span class="desktop-hidden" data-v-5a00d69b>Meet</span> <strong class="complex-shimmer" data-text="Pain Coach" data-v-5a00d69b>Pain Coach</strong>. </h1><h2 tabindex="0" data-v-5a00d69b><span data-v-5a00d69b>Take Control, Reclaim Your Life.</span></h2><p class="subtitle" tabindex="0" data-v-5a00d69b> Your personalised pain and lifestyle tracker, backed by real science. </p>`);
      _push(ssrRenderComponent(_component_BaseButton, {
        tabindex: "0",
        class: "waitlist-link",
        onClick: handleClick,
        onKeydown: handleKeyDown,
        arialLabel: "Sign up for the waitlist now!"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View the Demo `);
          } else {
            return [
              createTextVNode(" View the Demo ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="landing-image" data-v-5a00d69b><div class="image-container" data-v-5a00d69b><div class="fade" data-v-5a00d69b></div><div class="wrapper" data-v-5a00d69b>`);
      _push(ssrRenderComponent(_component_IphoneMockup, {
        tabindex: "-1",
        src: "/images/mockup/landing-dark.webp",
        loading: "eager",
        alt: "Home screen of the pain coach mobile application. Featuring a calendar tracking weekly pain, a 'lifestyle score', and a ranking of the users largest pain factors."
      }, null, _parent));
      _push(ssrRenderComponent(_component_IphoneMockup, {
        tabindex: "-1",
        src: "/images/mockup/landing-light.webp",
        loading: "eager",
        alt: "Insights page of the pain coach mobile application. Featuring a doughnut chart of the factors contributing to pain, and a line graph showing pain over time."
      }, null, _parent));
      _push(`</div></div></div></div></section>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/hero.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-5a00d69b"]]);
const _sfc_main$6 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(_attrs)} data-v-ad5532c9><div class="container section" data-v-ad5532c9><div class="spacer" data-v-ad5532c9><span data-v-ad5532c9>...</span></div></div></section>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/spacer.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-ad5532c9"]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "animatedFactors",
  __ssrInlineRender: true,
  setup(__props) {
    ref(8);
    const isVisible = ref(false);
    function handleVisible() {
      isVisible.value = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ScrollToReveal = __nuxt_component_1$1;
      _push(ssrRenderComponent(_component_ScrollToReveal, mergeProps({
        onVisible: handleVisible,
        centerAlign: true,
        fillParent: true
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${ssrRenderClass([{ hide: unref(isVisible) }, "factors"])}" aria-hidden="true" data-v-626f1c31${_scopeId}><div class="questions" data-v-626f1c31${_scopeId}><div class="row" data-v-626f1c31${_scopeId}><div class="timeline" data-v-626f1c31${_scopeId}><div class="circle" data-v-626f1c31${_scopeId}></div></div><div class="content psych" data-v-626f1c31${_scopeId}><svg class="factor-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" data-v-626f1c31${_scopeId}><path d="M491-339q70 0 119-45t49-109q0-57-36.5-96.5T534-629q-47 0-79.5 30T422-525q0 19 7.5 37t21.5 33l57-57q-3-2-4.5-5t-1.5-7q0-11 9-17.5t23-6.5q20 0 33 16.5t13 39.5q0 31-25.5 52.5T492-418q-47 0-79.5-38T380-549q0-29 11-55.5t31-46.5l-57-57q-32 31-49 72t-17 86q0 88 56 149.5T491-339ZM240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Z" data-v-626f1c31${_scopeId}></path></svg><p data-v-626f1c31${_scopeId}><span class="full" data-v-626f1c31${_scopeId}>Psychological</span> <span class="short" data-v-626f1c31${_scopeId}>Psych.</span> Distress</p><div class="checkbox" data-v-626f1c31${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" data-v-626f1c31${_scopeId}><path d="M382-208 122-468l90-90 170 170 366-366 90 90-456 456Z" data-v-626f1c31${_scopeId}></path></svg></div></div></div><div class="row" data-v-626f1c31${_scopeId}><div class="timeline" data-v-626f1c31${_scopeId}><div class="circle" data-v-626f1c31${_scopeId}></div><div class="line straight" data-v-626f1c31${_scopeId}></div></div><div class="content sleep" data-v-626f1c31${_scopeId}><svg class="factor-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" data-v-626f1c31${_scopeId}><path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z" data-v-626f1c31${_scopeId}></path></svg><p data-v-626f1c31${_scopeId}>Sleep</p><div class="checkbox" data-v-626f1c31${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" data-v-626f1c31${_scopeId}><path d="M382-208 122-468l90-90 170 170 366-366 90 90-456 456Z" data-v-626f1c31${_scopeId}></path></svg></div></div></div><div class="row" data-v-626f1c31${_scopeId}><div class="timeline" data-v-626f1c31${_scopeId}><div class="circle" data-v-626f1c31${_scopeId}></div><div class="line straight" data-v-626f1c31${_scopeId}></div></div><div class="content" data-v-626f1c31${_scopeId}><svg class="factor-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" data-v-626f1c31${_scopeId}><path d="M516.41-36.41v-241.68l-78.26-74.5-39.28 172.89-283.17-57.43 17.43-86.94 192 40 62.09-314.43-65.79 25.37v137.2h-87.41v-194.22l162.55-68.72q35.71-15 52.45-19.74 16.74-4.74 30.98-4.74 22.2 0 40.67 11.72 18.48 11.72 30.2 30.43l40.48 64q25.52 41.05 69.9 67.45 44.38 26.4 102.34 26.4v87.42q-66.72 0-124.34-26.55-57.62-26.54-97.1-69.87l-22.08 111.63 83.52 79.52v304.79h-87.18Zm24.07-707.18q-34.68 0-59.25-24.57-24.58-24.58-24.58-59.25 0-34.68 24.58-59.13Q505.8-911 540.48-911q34.67 0 59.13 24.46 24.46 24.45 24.46 59.13 0 34.67-24.46 59.25-24.46 24.57-59.13 24.57Z" data-v-626f1c31${_scopeId}></path></svg><p data-v-626f1c31${_scopeId}>Exercise</p><div class="checkbox" data-v-626f1c31${_scopeId}><svg class="check" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" data-v-626f1c31${_scopeId}><path d="M382-208 122-468l90-90 170 170 366-366 90 90-456 456Z" data-v-626f1c31${_scopeId}></path></svg></div></div></div></div></div>`);
          } else {
            return [
              createVNode("div", {
                class: ["factors", { hide: unref(isVisible) }],
                "aria-hidden": "true"
              }, [
                createVNode("div", { class: "questions" }, [
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "timeline" }, [
                      createVNode("div", { class: "circle" })
                    ]),
                    createVNode("div", { class: "content psych" }, [
                      (openBlock(), createBlock("svg", {
                        class: "factor-icon",
                        xmlns: "http://www.w3.org/2000/svg",
                        height: "24px",
                        viewBox: "0 -960 960 960",
                        width: "24px",
                        fill: "#e8eaed"
                      }, [
                        createVNode("path", { d: "M491-339q70 0 119-45t49-109q0-57-36.5-96.5T534-629q-47 0-79.5 30T422-525q0 19 7.5 37t21.5 33l57-57q-3-2-4.5-5t-1.5-7q0-11 9-17.5t23-6.5q20 0 33 16.5t13 39.5q0 31-25.5 52.5T492-418q-47 0-79.5-38T380-549q0-29 11-55.5t31-46.5l-57-57q-32 31-49 72t-17 86q0 88 56 149.5T491-339ZM240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Z" })
                      ])),
                      createVNode("p", null, [
                        createVNode("span", { class: "full" }, "Psychological"),
                        createTextVNode(),
                        createVNode("span", { class: "short" }, "Psych."),
                        createTextVNode(" Distress")
                      ]),
                      createVNode("div", { class: "checkbox" }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          height: "24px",
                          viewBox: "0 -960 960 960",
                          width: "24px",
                          fill: "#e8eaed"
                        }, [
                          createVNode("path", { d: "M382-208 122-468l90-90 170 170 366-366 90 90-456 456Z" })
                        ]))
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "timeline" }, [
                      createVNode("div", { class: "circle" }),
                      createVNode("div", { class: "line straight" })
                    ]),
                    createVNode("div", { class: "content sleep" }, [
                      (openBlock(), createBlock("svg", {
                        class: "factor-icon",
                        xmlns: "http://www.w3.org/2000/svg",
                        height: "24px",
                        viewBox: "0 -960 960 960",
                        width: "24px",
                        fill: "#e8eaed"
                      }, [
                        createVNode("path", { d: "M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z" })
                      ])),
                      createVNode("p", null, "Sleep"),
                      createVNode("div", { class: "checkbox" }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          height: "24px",
                          viewBox: "0 -960 960 960",
                          width: "24px",
                          fill: "#e8eaed"
                        }, [
                          createVNode("path", { d: "M382-208 122-468l90-90 170 170 366-366 90 90-456 456Z" })
                        ]))
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "timeline" }, [
                      createVNode("div", { class: "circle" }),
                      createVNode("div", { class: "line straight" })
                    ]),
                    createVNode("div", { class: "content" }, [
                      (openBlock(), createBlock("svg", {
                        class: "factor-icon",
                        xmlns: "http://www.w3.org/2000/svg",
                        height: "24px",
                        viewBox: "0 -960 960 960",
                        width: "24px",
                        fill: "#e8eaed"
                      }, [
                        createVNode("path", { d: "M516.41-36.41v-241.68l-78.26-74.5-39.28 172.89-283.17-57.43 17.43-86.94 192 40 62.09-314.43-65.79 25.37v137.2h-87.41v-194.22l162.55-68.72q35.71-15 52.45-19.74 16.74-4.74 30.98-4.74 22.2 0 40.67 11.72 18.48 11.72 30.2 30.43l40.48 64q25.52 41.05 69.9 67.45 44.38 26.4 102.34 26.4v87.42q-66.72 0-124.34-26.55-57.62-26.54-97.1-69.87l-22.08 111.63 83.52 79.52v304.79h-87.18Zm24.07-707.18q-34.68 0-59.25-24.57-24.58-24.58-24.58-59.25 0-34.68 24.58-59.13Q505.8-911 540.48-911q34.67 0 59.13 24.46 24.46 24.45 24.46 59.13 0 34.67-24.46 59.25-24.46 24.57-59.13 24.57Z" })
                      ])),
                      createVNode("p", null, "Exercise"),
                      createVNode("div", { class: "checkbox" }, [
                        (openBlock(), createBlock("svg", {
                          class: "check",
                          xmlns: "http://www.w3.org/2000/svg",
                          height: "24px",
                          viewBox: "0 -960 960 960",
                          width: "24px",
                          fill: "#e8eaed"
                        }, [
                          createVNode("path", { d: "M382-208 122-468l90-90 170 170 366-366 90 90-456 456Z" })
                        ]))
                      ])
                    ])
                  ])
                ])
              ], 2)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/animatedFactors.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-626f1c31"]]);
const _sfc_main$4 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_ScrollToReveal = __nuxt_component_1$1;
  const _component_IphoneMockup = __nuxt_component_1;
  const _component_AnimatedFactors = __nuxt_component_2;
  _push(`<section${ssrRenderAttrs(_attrs)} data-v-50656851><div class="container section" data-v-50656851>`);
  _push(ssrRenderComponent(_component_ScrollToReveal, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h2 tabindex="0" data-v-50656851${_scopeId}>How it Works in <span class="complex-shimmer" data-text="Three" data-v-50656851${_scopeId}>Three</span> Steps:</h2>`);
      } else {
        return [
          createVNode("h2", { tabindex: "0" }, [
            createTextVNode("How it Works in "),
            createVNode("span", {
              class: "complex-shimmer",
              "data-text": "Three"
            }, "Three"),
            createTextVNode(" Steps:")
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<ol class="steps-list" data-v-50656851><li data-v-50656851><div class="wrapper" data-v-50656851>`);
  _push(ssrRenderComponent(_component_ScrollToReveal, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h3 tabindex="0" data-v-50656851${_scopeId}>Log your day</h3><p tabindex="0" class="subtitle" data-v-50656851${_scopeId}>Make a record of your day by answering a few simple questions</p>`);
      } else {
        return [
          createVNode("h3", { tabindex: "0" }, "Log your day"),
          createVNode("p", {
            tabindex: "0",
            class: "subtitle"
          }, "Make a record of your day by answering a few simple questions")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="wrapper body" data-v-50656851><div class="record-container" data-v-50656851>`);
  _push(ssrRenderComponent(_component_IphoneMockup, {
    tabindex: "-1",
    halfScreen: "",
    fullWidth: "",
    src: "/images/mockup/record-dark.webp",
    class: "dark record",
    loading: "lazy",
    alt: "The 'Record' page of the mobile application. A short daily survey which asks questions like 'What would you rate your pain today?'."
  }, null, _parent));
  _push(ssrRenderComponent(_component_IphoneMockup, {
    tabindex: "-1",
    halfScreen: "",
    fullWidth: "",
    src: "/images/mockup/calendar-singular-dark.webp",
    class: "dark calendar",
    loading: "lazy",
    alt: "The 'Calendar' page of the mobile application. A colorful calendar displaying a visual record of the users pain over a month, click on a day to see more information."
  }, null, _parent));
  _push(ssrRenderComponent(_component_IphoneMockup, {
    tabindex: "-1",
    halfScreen: "",
    fullWidth: "",
    src: "/images/mockup/record-light.webp",
    class: "light record",
    loading: "lazy",
    alt: "The 'Record' page of the mobile application. A short daily survey which asks questions like 'What would you rate your pain today?'."
  }, null, _parent));
  _push(ssrRenderComponent(_component_IphoneMockup, {
    tabindex: "-1",
    halfScreen: "",
    fullWidth: "",
    src: "/images/mockup/calendar-singular-light.webp",
    class: "light calendar",
    loading: "lazy",
    alt: "The 'Calendar' page of the mobile application. A colorful calendar displaying a visual record of the users pain over a month, click on a day to see more information."
  }, null, _parent));
  _push(`</div></div></li><li data-v-50656851>`);
  _push(ssrRenderComponent(_component_ScrollToReveal, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h3 tabindex="0" data-v-50656851${_scopeId}>Pain Coach learns</h3><p tabindex="0" class="subtitle" data-v-50656851${_scopeId}>The algorithm learns how your lifestyle impacts your pain</p>`);
      } else {
        return [
          createVNode("h3", { tabindex: "0" }, "Pain Coach learns"),
          createVNode("p", {
            tabindex: "0",
            class: "subtitle"
          }, "The algorithm learns how your lifestyle impacts your pain")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<div class="wrapper body" data-v-50656851><div tabindex="-1" class="learn-container" data-v-50656851><div class="fade" data-v-50656851></div>`);
  _push(ssrRenderComponent(_component_AnimatedFactors, { tabindex: "-1" }, null, _parent));
  _push(`</div></div></li><li data-v-50656851>`);
  _push(ssrRenderComponent(_component_ScrollToReveal, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h3 tabindex="0" data-v-50656851${_scopeId}>You find insights</h3><p tabindex="0" class="subtitle" data-v-50656851${_scopeId}>You get a personalised and exportable profile highlighting what is contributing to your pain</p>`);
      } else {
        return [
          createVNode("h3", { tabindex: "0" }, "You find insights"),
          createVNode("p", {
            tabindex: "0",
            class: "subtitle"
          }, "You get a personalised and exportable profile highlighting what is contributing to your pain")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<div class="wrapper body" data-v-50656851><div class="insights-container" data-v-50656851>`);
  _push(ssrRenderComponent(_component_IphoneMockup, {
    tabindex: "-1",
    halfScreen: "",
    fullWidth: "",
    src: "/images/mockup/insights-dark.webp",
    class: "dark insight",
    loading: "lazy",
    alt: "Another closeup of the Insights page. Various diagrams and charts give an overview of a users pain and pain factors."
  }, null, _parent));
  _push(ssrRenderComponent(_component_IphoneMockup, {
    tabindex: "-1",
    halfScreen: "",
    fullWidth: "",
    src: "/images/mockup/insights-light.webp",
    class: "light insight",
    loading: "lazy",
    alt: "Another closeup view of the Insights page. The graphics fade to white as they reach the top of the screen, revealing more detailed charts like 'Sleep quality over time'."
  }, null, _parent));
  _push(`</div></div></li></ol></div></section>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/how.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-50656851"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "quote",
  __ssrInlineRender: true,
  props: {
    quote: {},
    by: {},
    author: {},
    pic: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)} data-v-8b21c53e><div class="container section" data-v-8b21c53e><blockquote data-v-8b21c53e><p tabindex="0" class="quote" data-v-8b21c53e> &quot;${ssrInterpolate(props.quote)}&quot; </p><p class="author" data-v-8b21c53e><strong data-v-8b21c53e>${ssrInterpolate(props.by)}</strong><img${ssrRenderAttr("src", props.pic)}${ssrRenderAttr("alt", `Profile photo of ${props.author}, Physio Pain Coach's founder.`)} width="52" height="52" loading="lazy" data-v-8b21c53e></p></blockquote></div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/quote.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_5 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-8b21c53e"]]);
const _imports_0 = "" + buildAssetsURL("hero.ATZIer-i.mp4");
const _imports_1 = "" + buildAssetsURL("hero-dark.Dw4V9WcN.mp4");
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "animatedVideo",
  __ssrInlineRender: true,
  setup(__props) {
    const isLoading = ref(true);
    const isVisible = ref(false);
    const videoRef = ref(null);
    const isDarkMode = ref(false);
    const onVisible = () => {
      isVisible.value = true;
      playAppropriateVideo();
    };
    const playAppropriateVideo = async () => {
      if (videoRef.value && isVisible.value) {
        const sources = videoRef.value.getElementsByTagName("source");
        for (let i = 0; i < sources.length; i++) {
          if (isDarkMode.value && sources[i].classList.contains("dark") || !isDarkMode.value && sources[i].classList.contains("light")) {
            videoRef.value.src = sources[i].src;
            videoRef.value.load();
            try {
              await new Promise((resolve, reject) => {
                videoRef.value.oncanplay = resolve;
                videoRef.value.onerror = reject;
                setTimeout(reject, 1e4);
              });
              await videoRef.value.play();
            } catch (error) {
              console.error("Error playing video:", error);
            }
            break;
          }
        }
      }
    };
    const onVideoEnded = async () => {
      if (videoRef.value) {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        const duration = videoRef.value.duration;
        const rewindSteps = 20;
        const rewindInterval = 140;
        for (let i = 0; i < rewindSteps; i++) {
          await new Promise((resolve) => setTimeout(resolve, rewindInterval));
          videoRef.value.currentTime = duration * (rewindSteps - i - 1) / rewindSteps;
        }
        videoRef.value.currentTime = 0;
        videoRef.value.play();
      }
    };
    watch(isDarkMode, () => {
      if (isVisible.value) {
        playAppropriateVideo();
      }
    });
    watch(isVisible, (newValue) => {
      if (newValue) {
        isLoading.value = false;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ScrollToReveal = __nuxt_component_1$1;
      _push(`<section${ssrRenderAttrs(_attrs)} data-v-2244fe9d><div class="container section" data-v-2244fe9d>`);
      _push(ssrRenderComponent(_component_ScrollToReveal, { class: "reveal-container" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${ssrRenderClass([{ loaded: !isLoading.value }, "video container"])}" data-v-2244fe9d${_scopeId}>`);
            _push2(ssrRenderComponent(_component_ScrollToReveal, {
              onVisible,
              class: "reveal-main",
              threshold: 0.85,
              centerAlign: true
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<video${ssrIncludeBooleanAttr(true) ? " muted" : ""} playsinline${ssrIncludeBooleanAttr(false) ? " loop" : ""}${ssrIncludeBooleanAttr(isVisible.value) ? " autoplay" : ""} alt="A ball of yarn slowly untangles, turning into a straight line, representing the process of finding clarity about your pain." tabindex="-1" data-v-2244fe9d${_scopeId2}><source class="light"${ssrRenderAttr("src", _imports_0)} type="video/mp4" alt="A ball of yarn untangles into a straight line, only to tangle itself back up and start again." data-v-2244fe9d${_scopeId2}><source class="dark"${ssrRenderAttr("src", _imports_1)} type="video/mp4" alt="A ball of yarn untangles into a straight line, only to tangle itself back up and start again." data-v-2244fe9d${_scopeId2}> Your browser does not support video. </video>`);
                } else {
                  return [
                    createVNode("video", {
                      ref_key: "videoRef",
                      ref: videoRef,
                      muted: true,
                      playsinline: "",
                      loop: false,
                      autoplay: isVisible.value,
                      onEnded: onVideoEnded,
                      alt: "A ball of yarn slowly untangles, turning into a straight line, representing the process of finding clarity about your pain.",
                      tabindex: "-1"
                    }, [
                      createVNode("source", {
                        class: "light",
                        src: _imports_0,
                        type: "video/mp4",
                        alt: "A ball of yarn untangles into a straight line, only to tangle itself back up and start again."
                      }),
                      createVNode("source", {
                        class: "dark",
                        src: _imports_1,
                        type: "video/mp4",
                        alt: "A ball of yarn untangles into a straight line, only to tangle itself back up and start again."
                      }),
                      createTextVNode(" Your browser does not support video. ")
                    ], 40, ["autoplay"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                class: ["video container", { loaded: !isLoading.value }]
              }, [
                createVNode(_component_ScrollToReveal, {
                  onVisible,
                  class: "reveal-main",
                  threshold: 0.85,
                  centerAlign: true
                }, {
                  default: withCtx(() => [
                    createVNode("video", {
                      ref_key: "videoRef",
                      ref: videoRef,
                      muted: true,
                      playsinline: "",
                      loop: false,
                      autoplay: isVisible.value,
                      onEnded: onVideoEnded,
                      alt: "A ball of yarn slowly untangles, turning into a straight line, representing the process of finding clarity about your pain.",
                      tabindex: "-1"
                    }, [
                      createVNode("source", {
                        class: "light",
                        src: _imports_0,
                        type: "video/mp4",
                        alt: "A ball of yarn untangles into a straight line, only to tangle itself back up and start again."
                      }),
                      createVNode("source", {
                        class: "dark",
                        src: _imports_1,
                        type: "video/mp4",
                        alt: "A ball of yarn untangles into a straight line, only to tangle itself back up and start again."
                      }),
                      createTextVNode(" Your browser does not support video. ")
                    ], 40, ["autoplay"])
                  ]),
                  _: 1
                })
              ], 2)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/animatedVideo.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_6 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-2244fe9d"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "waitingList",
  __ssrInlineRender: true,
  setup(__props) {
    const isSubmitting = ref(false);
    const emailModel = ref("");
    const potFNameModel = ref("");
    const statusError = ref(false);
    const statusMessage = ref("");
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ id: "waitlist" }, _attrs))} data-v-0a0a457d><div class="section container" data-v-0a0a457d><h2 class="clarity" tabindex="0" data-v-0a0a457d>Find <span class="complex-shimmer" data-text="Clarity" data-v-0a0a457d>Clarity</span>.</h2><h2 tabindex="0" data-v-0a0a457d>Join the waiting list now:</h2><p data-v-0a0a457d>Want to give the app a try? Sign-up below and we&#39;ll send you an exclusive link to our <span class="complex-shimmer" data-text="demo" data-v-0a0a457d>demo</span>.</p><form data-v-0a0a457d><div class="group" data-v-0a0a457d><label for="potFName" class="hidden" data-v-0a0a457d>\xA0</label><input type="text" name="FNAME" class="name" id="potFName"${ssrRenderAttr("value", potFNameModel.value)} placeholder="Your name here" autocomplete="off" tabindex="-1" data-v-0a0a457d></div><div class="group email" data-v-0a0a457d><label for="inputEmail" data-v-0a0a457d>Email Address</label><input type="email" name="EMAIL" class="email" id="inputEmail" placeholder="example@email.com"${ssrRenderAttr("value", emailModel.value)} required tabindex="0" data-v-0a0a457d><button type="submit" name="subscribe" id="buttonSubscribe" class="${ssrRenderClass([{ error: statusError.value }, "button"])}"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} tabindex="0" data-v-0a0a457d>${ssrInterpolate(isSubmitting.value ? "Submitting..." : "Subscribe")}</button></div>`);
      if (statusMessage.value) {
        _push(`<p class="${ssrRenderClass([{ error: statusError.value }, "post-status"])}" data-v-0a0a457d>${ssrInterpolate(statusMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/waitingList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_7 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-0a0a457d"]]);
const profilePhoto = "/images/headshot-lachlan.webp";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Head = Head;
      const _component_ScrollToReveal = __nuxt_component_1$1;
      const _component_hero = __nuxt_component_2$1;
      const _component_Spacer = __nuxt_component_3;
      const _component_How = __nuxt_component_4;
      const _component_Quote = __nuxt_component_5;
      const _component_AnimatedVideo = __nuxt_component_6;
      const _component_WaitingList = __nuxt_component_7;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-2e6aa2e9${_scopeId}>Pain Coach</title><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" data-v-2e6aa2e9${_scopeId}><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" data-v-2e6aa2e9${_scopeId}><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" data-v-2e6aa2e9${_scopeId}><link rel="icon" type="image/x-icon" href="/favicon.ico" data-v-2e6aa2e9${_scopeId}><link rel="manifest" href="/site.webmanifest" data-v-2e6aa2e9${_scopeId}><link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" data-v-2e6aa2e9${_scopeId}><meta name="msapplication-TileColor" content="#da532c" data-v-2e6aa2e9${_scopeId}><meta name="theme-color" content="#ffffff" data-v-2e6aa2e9${_scopeId}><meta name="description" content="Welcome to Pain Coach, an app that acts as your personal pain and lifestyle assistant." data-v-2e6aa2e9${_scopeId}><meta name="viewport" content="width=device-width, initial-scale=1" data-v-2e6aa2e9${_scopeId}><meta name="author" content="Lachlan Townend" data-v-2e6aa2e9${_scopeId}><meta name="msapplication-navbutton-color" content="#1c1c20" data-v-2e6aa2e9${_scopeId}><meta name="apple-mobile-web-app-status-bar-style" content="#1c1c20" data-v-2e6aa2e9${_scopeId}><meta name="apple-mobile-web-app-capable" content="yes" data-v-2e6aa2e9${_scopeId}><meta name="mobile-web-app-capable" content="yes" data-v-2e6aa2e9${_scopeId}><meta name="msapplication-tap-highlight" content="no" data-v-2e6aa2e9${_scopeId}><meta name="robots" content="index, follow" data-v-2e6aa2e9${_scopeId}><meta name="googlebot" content="index, follow" data-v-2e6aa2e9${_scopeId}><meta name="google" content="notranslate" data-v-2e6aa2e9${_scopeId}><meta name="google-site-verification" content="google-site-verification" data-v-2e6aa2e9${_scopeId}>`);
          } else {
            return [
              createVNode("title", null, "Pain Coach"),
              createVNode("link", {
                rel: "apple-touch-icon",
                sizes: "180x180",
                href: "/apple-touch-icon.png"
              }),
              createVNode("link", {
                rel: "icon",
                type: "image/png",
                sizes: "32x32",
                href: "/favicon-32x32.png"
              }),
              createVNode("link", {
                rel: "icon",
                type: "image/png",
                sizes: "16x16",
                href: "/favicon-16x16.png"
              }),
              createVNode("link", {
                rel: "icon",
                type: "image/x-icon",
                href: "/favicon.ico"
              }),
              createVNode("link", {
                rel: "manifest",
                href: "/site.webmanifest"
              }),
              createVNode("link", {
                rel: "mask-icon",
                href: "/safari-pinned-tab.svg",
                color: "#5bbad5"
              }),
              createVNode("meta", {
                name: "msapplication-TileColor",
                content: "#da532c"
              }),
              createVNode("meta", {
                name: "theme-color",
                content: "#ffffff"
              }),
              createVNode("meta", {
                name: "description",
                content: "Welcome to Pain Coach, an app that acts as your personal pain and lifestyle assistant."
              }),
              createVNode("meta", {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
              }),
              createVNode("meta", {
                name: "author",
                content: "Lachlan Townend"
              }),
              createVNode("meta", {
                name: "msapplication-navbutton-color",
                content: "#1c1c20"
              }),
              createVNode("meta", {
                name: "apple-mobile-web-app-status-bar-style",
                content: "#1c1c20"
              }),
              createVNode("meta", {
                name: "apple-mobile-web-app-capable",
                content: "yes"
              }),
              createVNode("meta", {
                name: "mobile-web-app-capable",
                content: "yes"
              }),
              createVNode("meta", {
                name: "msapplication-tap-highlight",
                content: "no"
              }),
              createVNode("meta", {
                name: "robots",
                content: "index, follow"
              }),
              createVNode("meta", {
                name: "googlebot",
                content: "index, follow"
              }),
              createVNode("meta", {
                name: "google",
                content: "notranslate"
              }),
              createVNode("meta", {
                name: "google-site-verification",
                content: "google-site-verification"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<main id="main-content landing" class="site-page" data-v-2e6aa2e9>`);
      _push(ssrRenderComponent(_component_ScrollToReveal, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_hero, {
              class: "hero main",
              "aria-label": "Main hero section"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_hero, {
                class: "hero main",
                "aria-label": "Main hero section"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Spacer, { class: "spacer" }, null, _parent));
      _push(ssrRenderComponent(_component_How, {
        id: "how-it-works",
        class: "how"
      }, null, _parent));
      _push(ssrRenderComponent(_component_ScrollToReveal, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Spacer, { class: "spacer" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Quote, {
              class: "quote",
              quote: "People in pain want simple, actionable advice but are often left to drown in the complexity of modern pain sciences. I want to change that.",
              by: "- Lachlan Townend (Founder)",
              author: "Lachlan Townend",
              pic: profilePhoto
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Spacer, { class: "spacer" }),
              createVNode(_component_Quote, {
                class: "quote",
                quote: "People in pain want simple, actionable advice but are often left to drown in the complexity of modern pain sciences. I want to change that.",
                by: "- Lachlan Townend (Founder)",
                author: "Lachlan Townend",
                pic: profilePhoto
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_AnimatedVideo, { class: "animated-video" }, null, _parent));
      _push(ssrRenderComponent(_component_WaitingList, { class: "waitlist" }, null, _parent));
      _push(`</main><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2e6aa2e9"]]);

export { index as default };
//# sourceMappingURL=index-CMcHpqw8.mjs.map
