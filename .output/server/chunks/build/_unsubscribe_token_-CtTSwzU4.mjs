import { useSSRContext, defineComponent, ref, mergeProps, unref } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc, e as useRoute } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[unsubscribe_token]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const unsubscribe_token = ref(route.params.unsubscribe_token);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({
        id: "main-content",
        class: "site-page"
      }, _attrs))} data-v-536ddbf8><section data-v-536ddbf8><div class="container section" data-v-536ddbf8><h1 data-v-536ddbf8>You&#39;re Unsubscribed</h1><p data-v-536ddbf8>You have been successfully unsubscribed from our mailing list. Made a mistake and want to resubscribe?<a${ssrRenderAttr("href", `/user/mailing-list/resubscribe/${unref(unsubscribe_token)}`)} data-v-536ddbf8>Click here.</a></p></div></section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/mailing-list/unsubscribed/[unsubscribe_token].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _unsubscribe_token_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-536ddbf8"]]);

export { _unsubscribe_token_ as default };
//# sourceMappingURL=_unsubscribe_token_-CtTSwzU4.mjs.map
