import { useSSRContext, defineComponent, ref, unref, computed, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { M as MainHeader, u as useTimelineDropdown, a as useOverviewTimeline, c as getStartingDayOfWeekIndex, g as getEmptyDaysAtStart, d as getStartOfFortnight, e as getEndOfFortnight, f as getStartOfWeek, h as getEndOfWeek, b as generateCalendarDays, i as currentDateMonthDay, j as daysOfWeekLabels } from './calendar-DzufQbjJ.mjs';
import { _ as _export_sfc } from './server.mjs';
import { u as useFactorsExpanded } from './useFactorsExpanded-KdlO_xOY.mjs';
import { u as useScroll } from './useScroll-jpfBEZIf.mjs';
import './state-_I5XcLqc.mjs';
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

const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "timelineDropdown",
  __ssrInlineRender: true,
  setup(__props) {
    const { toggleEnabled, isEnabled } = useTimelineDropdown();
    const { currentTimeline, setTimeline } = useOverviewTimeline();
    const timelineLengths = [
      { value: "week", label: "7 Days" },
      { value: "fortnight", label: "14 Days" },
      { value: "month", label: "1 Month" }
    ];
    const dropdownOptions = computed(() => {
      const options = [...timelineLengths];
      options.findIndex((timeline) => timeline.value === currentTimeline.value);
      return options;
    });
    const currentTimelineLength = computed(() => {
      return timelineLengths.find((timeline) => timeline.value === currentTimeline.value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["timeline", { open: unref(isEnabled) }]
      }, _attrs))} data-v-3d2dab3e><button class="${ssrRenderClass([unref(currentTimeline), "main"])}" data-v-3d2dab3e><p data-v-3d2dab3e>${ssrInterpolate((_a = unref(currentTimelineLength)) == null ? void 0 : _a.label)}</p><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" data-v-3d2dab3e><path d="M480-397.85 311.85-566h336.3L480-397.85Z" data-v-3d2dab3e></path></svg></button><nav style="${ssrRenderStyle(unref(isEnabled) ? null : { display: "none" })}" class="menu" data-v-3d2dab3e><ul data-v-3d2dab3e><!--[-->`);
      ssrRenderList(unref(dropdownOptions), (option) => {
        _push(`<li data-v-3d2dab3e><button class="${ssrRenderClass(option.value)}" data-v-3d2dab3e><p data-v-3d2dab3e>${ssrInterpolate(option.label)}</p></button></li>`);
      });
      _push(`<!--]--></ul></nav></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/overview/timelineDropdown.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const OverviewTimelineDropdown = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-3d2dab3e"]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "dayIndicator",
  __ssrInlineRender: true,
  props: {
    isEmpty: { type: Boolean },
    labelType: {},
    labelContent: {},
    dayIndex: {},
    painLevel: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-4f511aaf>`);
      if (_ctx.dayIndex <= 6) {
        _push(`<p class="day-label" data-v-4f511aaf>${ssrInterpolate(_ctx.labelContent)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="${ssrRenderClass([[`pain-level-${_ctx.painLevel}`, { "first-row": _ctx.dayIndex <= 6 }], "visual"])}" data-v-4f511aaf></span></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/overview/dayIndicator.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const OverviewDayIndicator = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-4f511aaf"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "overviewCalendar",
  __ssrInlineRender: true,
  props: {
    initialDate: {}
  },
  setup(__props) {
    const props = __props;
    const isMounted = ref(false);
    const { currentTimeline } = useOverviewTimeline();
    const currentMonth = ref({
      date: props.initialDate,
      days: [],
      startingDayIndex: getStartingDayOfWeekIndex(props.initialDate)
    });
    const dayLabelType = ref("day");
    const emptyDaysAtStart = computed(() => {
      return getEmptyDaysAtStart(/* @__PURE__ */ new Date(), currentTimeline.value);
    });
    const calendarDays = computed(() => {
      const today = /* @__PURE__ */ new Date();
      let startDate;
      let endDate;
      switch (currentTimeline.value) {
        case "week":
          startDate = getStartOfWeek(today);
          endDate = getEndOfWeek(today);
          break;
        case "fortnight":
          startDate = getStartOfFortnight(today);
          endDate = getEndOfFortnight(today);
          break;
        case "month":
        default:
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          break;
      }
      return generateCalendarDays(startDate, endDate, emptyDaysAtStart.value);
    });
    const currentDateLabel = computed(() => {
      if (isMounted.value === false) return currentDateMonthDay();
      switch (currentTimeline.value) {
        case "week":
          return currentDateMonthDay();
        case "fortnight":
          return currentDateMonthDay();
        case "month":
        default:
          return currentMonth.value.date.toLocaleString("default", { month: "long", year: "numeric" });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: ["calendar overview panel", unref(currentTimeline)],
        ref: "parentContainer"
      }, _attrs))} data-v-9862f89e><div class="headers wrapper" data-v-9862f89e><h2 data-v-9862f89e>This <span data-v-9862f89e>${ssrInterpolate(unref(currentTimeline))}</span></h2><h3 data-v-9862f89e>${ssrInterpolate(unref(currentDateLabel))}</h3></div><div class="wrapper days" data-v-9862f89e><div${ssrRenderAttrs({
        name: "list",
        class: "days-grid"
      })} data-v-9862f89e>`);
      ssrRenderList(unref(emptyDaysAtStart), (emptyDay) => {
        _push(ssrRenderComponent(OverviewDayIndicator, {
          key: `empty-${emptyDay}`,
          labelType: unref(dayLabelType),
          labelContent: unref(daysOfWeekLabels)[emptyDay - 1 % 7],
          painLevel: null,
          isEmpty: true,
          dayIndex: emptyDay
        }, null, _parent));
      });
      ssrRenderList(unref(calendarDays), (day) => {
        _push(ssrRenderComponent(OverviewDayIndicator, {
          key: day.index,
          labelType: unref(dayLabelType),
          labelContent: unref(daysOfWeekLabels)[day.index % 7],
          painLevel: day.painLevel,
          isEmpty: false,
          dayIndex: day.index
        }, null, _parent));
      });
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/overview/overviewCalendar.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const OverviewCalendar = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-9862f89e"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "lifestyleScore",
  __ssrInlineRender: true,
  props: {
    lifestyleScore: {}
  },
  setup(__props) {
    const props = __props;
    const isMounted = ref(false);
    ref(false);
    const stretchAmount = ref(0);
    ref(0);
    const stretchedScore = computed(() => Math.max(0, Math.min(props.lifestyleScore + stretchAmount.value, 100)));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "lifestyle-score overview panel" }, _attrs))} data-v-7f8c573d><div class="headers wrapper" data-v-7f8c573d><h2 data-v-7f8c573d>Lifestyle Score</h2><h3 data-v-7f8c573d><span class="score" data-v-7f8c573d>${ssrInterpolate(_ctx.lifestyleScore)}</span><span class="divider" data-v-7f8c573d>/</span>100</h3></div><div class="lifestyle-bar wrapper" data-v-7f8c573d>`);
      if (unref(isMounted)) {
        _push(`<div class="lifestyle-bar-inner" style="${ssrRenderStyle({ width: `${unref(stretchedScore)}%` })}" data-v-7f8c573d></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/overview/lifestyleScore.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const OverviewLifestyleScore = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-7f8c573d"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "factor",
  __ssrInlineRender: true,
  props: {
    factorID: {},
    factorName: {},
    factorValue: {},
    isMounted: { type: Boolean }
  },
  emits: ["factorClicked"],
  setup(__props, { emit: __emit }) {
    const { factorsExpanded, isFactorExpanded } = useFactorsExpanded();
    const isExpanded = computed(() => isFactorExpanded(props.factorID));
    const factorWidthStyle = ref(`${Math.floor(Math.random() * 42) + 24}%`);
    const props = __props;
    function getFactorColor() {
      if (props.factorValue >= 0 && props.factorValue <= 2) {
        return "pain-0";
      } else if (props.factorValue > 2 && props.factorValue <= 4) {
        return "pain-1";
      } else if (props.factorValue > 4 && props.factorValue <= 6) {
        return "pain-2";
      } else {
        return "pain-3";
      }
    }
    const isMounted = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: ["factor panel", { expanded: unref(isExpanded), mounted: unref(isMounted) }]
      }, _attrs))} data-v-4b215dfd>`);
      if (unref(isMounted)) {
        _push(`<div class="content loaded" data-v-4b215dfd><div class="wrapper labels" data-v-4b215dfd><div class="icons" data-v-4b215dfd>`);
        if (_ctx.factorName === "psychological distress") {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed" data-v-4b215dfd><path d="M491.23-354.31q61.69 0 106.77-40.38 45.08-40.39 45.08-97.18 0-49.51-32.08-84.78t-77.74-35.27q-39.99 0-68.24 26.34-28.25 26.35-28.25 62.58 0 17.69 6.47 32.33 6.47 14.63 18.45 27.21l37.92-36.39q-5.42-4.53-8.13-10.57-2.71-6.04-2.71-12.11 0-14.01 12.34-25.7 12.35-11.69 32.2-11.69 22.54 0 39.96 19.33t17.42 48.67q0 34.15-29.07 59.69-29.08 25.54-70.15 25.54-49.62 0-86.09-41.5-36.46-41.5-36.46-99.66 0-30.76 11.7-59.07 11.69-28.31 34.46-51.08l-37.16-35.77q-29.3 29.69-45.15 67.23-15.85 37.54-15.85 78.69 0 79.93 50.62 136.73 50.61 56.81 123.69 56.81ZM284-116v-164.23q-57-48-88.5-113.26T164-529.38q0-131.13 92.52-222.87Q349.05-844 481-844q100.54 0 182.92 54.66 82.39 54.65 108.85 141.73L833.38-445q4.62 15.56-4.73 28.28Q819.31-404 803.23-404H748v127.69q0 26.62-18.84 45.47Q710.31-212 683.69-212H580v96h-52v-148h155.69q5.39 0 8.85-3.46t3.46-8.85V-456h80l-52-173q-22-72.38-89.88-117.69Q566.23-792 481-792q-111 0-188 76.82t-77 186.56q0 58.93 25 111.78Q266-364 311-326l25 22v188h-52Zm212-338Z" data-v-4b215dfd></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        if (_ctx.factorName === "exercise") {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed" data-v-4b215dfd><path d="M562-106v-206.46l-92.15-90.77-33.54 167.69-232.77-47.15 10.15-49.62 181 35.62 57.39-292.23L350-544.54V-442h-52v-137.85l185.77-77.23q4.38-1.69 11.77-3.3Q502.92-662 511-662q24.31 0 43.5 11.15 19.19 11.16 32.04 33.24l14 23q29.61 50.23 67.61 73.88T758-494.77v52q-52-1.92-100.92-28.85-48.93-26.92-85.08-83.69l-28.77 150.39L614-333.38V-106h-52Zm14-596.15q-32.69 0-55.27-22.58-22.58-22.58-22.58-55.27 0-32.69 22.58-55.27 22.58-22.58 55.27-22.58 32.69 0 55.27 22.58 22.58 22.58 22.58 55.27 0 32.69-22.58 55.27-22.58 22.58-55.27 22.58Z" data-v-4b215dfd></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        if (_ctx.factorName === "sleep") {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed" data-v-4b215dfd><path d="M483.11-116q-76.3 0-143.05-28.93-66.76-28.93-116.48-78.65-49.72-49.72-78.65-116.48Q116-406.81 116-483.11q0-125.27 75.12-223.93 75.11-98.65 198.19-129.65-10.08 96.31 20.34 181.27 30.43 84.96 97.12 151.65 64.69 64.69 151.65 94.62 86.96 29.92 178.27 19.84-29.38 121.08-128.85 197.19Q608.38-116 483.11-116Zm-.11-52q88 0 164-45t115-122.11q-83-5.01-158.5-39.56Q528-409.22 469-468.3q-60-60.08-94-134.89Q341-678 335-762q-77 41-122 116.18-45 75.19-45 162.82 0 131.25 91.88 223.12Q351.75-168 483-168Zm-14-300.38Z" data-v-4b215dfd></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        if (_ctx.factorName === "nutrition") {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed" data-v-4b215dfd><path d="M648-116q-81.54 0-138.77-57.23Q452-230.46 452-312q0-81.54 57.23-138.77Q566.46-508 648-508q81.54 0 138.77 57.23Q844-393.54 844-312q0 81.54-57.23 138.77Q729.54-116 648-116Zm0-52q60 0 102-42t42-102q0-60-42-102t-102-42q-60 0-102 42t-42 102q0 60 42 102t102 42Zm-467.69 4q-27.01 0-45.66-18.65Q116-201.3 116-228.31v-272.38q0-13 3.02-26.16 3.02-13.15 7.52-25.15l91.62-223.69h-25.08q-13.38 0-21.61-8.24-8.24-8.23-8.24-21.61v-8.61q0-13.38 8.24-21.61 8.23-8.24 21.61-8.24h237.84q13.38 0 21.61 8.24 8.24 8.23 8.24 21.61v8.61q0 13.38-8.24 21.61-8.23 8.24-21.61 8.24h-25.08l97.93 238.92q-11.62 5.31-21.69 14-10.08 8.69-20.62 18.62L350.38-775.69h-75.76L168-515.15v286.84q0 5.39 3.46 8.85t8.85 3.46h217.46q3.85 15 12.73 26.81 8.89 11.8 15.42 25.19H180.31ZM624-563.69q-32.24-3.46-54.12-27.2Q548-614.63 548-647.93t21.88-57.26q21.88-23.96 54.12-27.42v168.92q3.46-32.24 27.26-54.12 23.8-21.88 57.2-21.88 33.4 0 57.2 21.88 23.8 21.88 27.26 54.12H624Z" data-v-4b215dfd></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        if (_ctx.factorName === "social connection") {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed" data-v-4b215dfd><path d="m309.85-754.69-33.16-102.08 56.46-19.54 34.16 102.46-57.46 19.16Zm140.3-43.46v-107.7h59.7v107.7h-59.7Zm199 42.46-56.46-18.16 34.16-102.46 56.46 18.16-34.16 102.46ZM109.85-58.62 102.92-110l195.8-29.56q13.23-2.28 23.06-10.47 9.84-8.2 13.22-20.89l37.62-117q5.15-16.85-2.58-32.7-7.73-15.84-23.58-24l-35.31 112.93L261-247.92l94.61-296.46q3.24-10.47 1.51-19.43-1.73-8.96-8.63-14.96L211.39-296q-12.47 25.69-36.15 40.65-23.69 14.97-52.01 14.97h-51v-52h51q13.7 0 24.13-6.91 10.44-6.91 16.72-18.48l167.61-348.77 47.77 40q20.62 18.31 26.85 45.31 6.23 27-1.85 53.23l-42.54 133.62q41.16 21.84 55.93 55 14.77 33.15 3.92 67.3l-37 117q-7.85 26.69-29.42 44.58-21.58 17.88-49.5 22.5l-196 29.38Zm740.3.39-196-29.39q-27.92-4.61-49.5-22.5-21.57-17.88-29.42-44.57l-37-117q-10.85-34.16 3.92-67.31 14.77-33.15 55.93-55l-42.54-133.62q-8.08-26.23-1.85-53.23 6.23-27 26.85-45.3l47.77-40 167.61 348.77q6.26 11.56 16.67 18.47 10.4 6.91 24.18 6.91h51v52h-51q-28.31 0-52-14.96t-36.16-40.65l-137.1-282.78q-6.9 6-8.63 14.97-1.73 8.96 1.51 19.42L699-247.54l-50.15 16.23-35.31-112.92q-15.85 8.15-23.58 24-7.73 15.85-2.58 32.69l37.62 117q3.38 12.69 13.31 21.01 9.92 8.31 22.77 10.53l196 29.39-6.93 51.38ZM261-247.92Zm438 .38Zm-50.15 16.23L598.08-394l50.77 162.69ZM361.92-394.38l-50.77 162.69 50.77-162.69Z" data-v-4b215dfd></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><h3 class="factor-title" data-v-4b215dfd>${ssrInterpolate(_ctx.factorName)}</h3></div><span class="${ssrRenderClass([getFactorColor(), "status indicator"])}" data-v-4b215dfd></span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([{ active: unref(isExpanded) }, "more"])}" data-v-4b215dfd><p data-v-4b215dfd><span data-v-4b215dfd>${ssrInterpolate(_ctx.factorName)}</span> is responsible for 45% of the change in your pain levels. </p><p data-v-4b215dfd> There is a strong positive correlation, indicating that higher psychological distress is associated with higher pain levels. </p></div>`);
      if (!unref(isMounted)) {
        _push(`<div class="content unloaded" data-v-4b215dfd><div class="wrapper labels" data-v-4b215dfd><div class="icons" data-v-4b215dfd><div data-v-4b215dfd></div></div></div><div class="wrapper info" data-v-4b215dfd><div class="group text unloaded" data-v-4b215dfd><span class="factor-title" style="${ssrRenderStyle({ width: unref(factorWidthStyle) })}" data-v-4b215dfd></span></div><span class="status indicator" data-v-4b215dfd></span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/overview/factor.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const OverviewFactor = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-4b215dfd"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "painFactors",
  __ssrInlineRender: true,
  props: {
    painFactors: {}
  },
  setup(__props) {
    const { smoothScroll } = useScroll();
    const { isAnyFactorExpanded, disableAllFactors, disableAllButThenToggle } = useFactorsExpanded();
    const props = __props;
    const isMounted = ref(false);
    const orderedFactors = props.painFactors.sort((a, b) => b.factorValue - a.factorValue);
    const anyFactorExpanded = computed(() => isAnyFactorExpanded());
    const showOverlay = ref(false);
    const timeoutScrollID = ref(null);
    const timeoutOverflowID = ref(null);
    function handleFactorClick(factorID) {
      const expandedSate = disableAllButThenToggle(factorID);
      if (expandedSate) {
        openOverlay(factorID);
      } else {
        closeOverlay();
      }
    }
    function openOverlay(factorID) {
      const factorIdSelector = "#" + factorID;
      showOverlay.value = true;
      timeoutScrollID.value = setTimeout(() => {
        smoothScroll(factorIdSelector);
      }, 100);
      timeoutOverflowID.value = setTimeout(() => {
        (void 0).body.style.overflow = "hidden";
      }, 500);
    }
    function closeOverlay() {
      disableAllFactors();
      (void 0).body.style.overflow = "";
      showOverlay.value = false;
      cancelOverlayTimeout();
    }
    function cancelOverlayTimeout() {
      if (timeoutScrollID.value !== null) {
        clearTimeout(timeoutScrollID.value);
        clearTimeout(timeoutOverflowID.value);
        timeoutScrollID.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "pain-factors overview" }, _attrs))} data-v-7ceb230a><div class="headers wrapper" data-v-7ceb230a><h2 data-v-7ceb230a>Your Pain Factors</h2></div><div class="wrapper factors-container" data-v-7ceb230a><div class="loaded factors" data-v-7ceb230a>`);
      if (unref(showOverlay) && unref(anyFactorExpanded)) {
        _push(`<div class="${ssrRenderClass([{ active: unref(showOverlay) && unref(anyFactorExpanded) }, "overlay"])}" data-v-7ceb230a></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(orderedFactors), (factor) => {
        _push(ssrRenderComponent(OverviewFactor, {
          id: factor.factorID,
          key: factor.factorType,
          factorName: factor.factorType,
          factorValue: factor.factorValue,
          factorID: factor.factorID,
          isMounted: unref(isMounted),
          onFactorClicked: handleFactorClick
        }, null, _parent));
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/overview/painFactors.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const OverviewPainFactors = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-7ceb230a"]]);
class PainDataAnalyser {
  // Calculate Pearson correlation coefficient
  calculateCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXSquare = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYSquare = y.reduce((sum, yi) => sum + yi * yi, 0);
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumXSquare - sumX * sumX) * (n * sumYSquare - sumY * sumY)
    );
    return denominator === 0 ? 0 : numerator / denominator;
  }
  // Calculate p-value using t-distribution approximation
  calculatePValue(correlation, n) {
    const t = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation));
    return 2 * (1 - this.normalCDF(Math.abs(t)));
  }
  // Helper function for normal cumulative distribution
  normalCDF(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - probability : probability;
  }
  // Simple linear regression
  linearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXSquare = x.reduce((sum, xi) => sum + xi * xi, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXSquare - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const yMean = sumY / n;
    const totalSS = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const residualSS = y.reduce((sum, yi, i) => {
      const prediction = slope * x[i] + intercept;
      return sum + Math.pow(yi - prediction, 2);
    }, 0);
    const rSquared = 1 - residualSS / totalSS;
    return { slope, intercept, rSquared };
  }
  // Main analysis method
  analyzeHealthData(data) {
    const painValues = data.map((d) => d.pain);
    const correlations = {};
    const regression = {};
    Object.keys(data[0]).forEach((key) => {
      if (key !== "pain") {
        const values = data.map((d) => d[key]);
        const correlation = this.calculateCorrelation(values, painValues);
        const pValue = this.calculatePValue(correlation, data.length);
        correlations[key] = { correlation, pValue };
        regression[key] = this.linearRegression(values, painValues);
      }
    });
    return { correlations, regression };
  }
  addNoise(baseValue, noiseRange, min, max) {
    const noise = (Math.random() * 0.5 + // Uniform component
    Math.random() * Math.random() * 0.3 + // Right-skewed component
    (Math.random() - 0.5) * 0.2) * noiseRange;
    return Math.round(Math.max(min, Math.min(max, baseValue + noise)));
  }
  // Modified sigmoid for less deterministic relationships
  sigmoid(x, steepness = 1, midpoint = 0) {
    const randomVariation = (Math.random() - 0.5) * 0.15;
    return 1 / (1 + Math.exp(-steepness * (x - midpoint))) + randomVariation;
  }
  // New function to add naturalistic daily fluctuations
  addDailyVariation(baseValue, amplitude) {
    return baseValue + Math.sin(Math.random() * Math.PI * 2) * amplitude;
  }
  generateSyntheticData(n) {
    const data = [];
    for (let i = 0; i < n; i++) {
      const baseStress = this.addDailyVariation(
        Math.random() * 4 + 2,
        // Base range (2-6)
        0.5
        // Daily variation amplitude
      );
      const baseAnxiety = this.sigmoid(baseStress - 4, 0.6) * 1.5 + // Reduced stress influence
      Math.random() * 2.5 + 2 + // Increased random component
      this.addDailyVariation(0, 0.3);
      const baseSocialSupport = Math.max(3, Math.min(
        7,
        Math.random() * 3 + 4 + // Base component (4-7)
        -this.sigmoid(baseStress - 4, 0.3) * 0.6 - // Reduced stress influence
        this.sigmoid(baseAnxiety - 3.5, 0.3) * 0.6 + // Reduced anxiety influence
        this.addDailyVariation(0, 0.3)
        // Daily variation
      ));
      const baseMood = 9 - this.sigmoid(baseStress - 3, 0.5) * 2.5 - // Reduced stress impact
      this.sigmoid(baseAnxiety - 2.5, 0.5) * 1.8 + // Reduced anxiety impact
      this.sigmoid(baseSocialSupport - 4, 0.5) * 1.5 + // Reduced support impact
      Math.random() * 2 - 1;
      const baseSocialRelations = Math.max(5, Math.min(
        7,
        5.5 + // Start from middle of valid range (5-7)
        this.sigmoid(baseMood - 5, 0.4) * 0.8 + // Mood influence
        -this.sigmoid(baseAnxiety - 3.5, 0.4) * 0.6 + // Anxiety impact
        this.sigmoid(baseSocialSupport - 4, 0.5) * 0.7 + // Social support benefit
        (Math.random() * 0.8 - 0.4)
        // Controlled random variation
      ));
      const stressAnxietyInteraction = baseStress * baseAnxiety / 10 * (0.8 + Math.random() * 0.4);
      const baseSleepQuality = 8 - this.sigmoid(stressAnxietyInteraction - 2, 0.6) * 1.8 + // Reduced impact
      this.sigmoid(baseSocialSupport - 4, 0.4) * 0.8 + // Reduced impact
      this.addDailyVariation(0, 0.6);
      const baseSleepDuration = baseSleepQuality - this.sigmoid(baseStress - 4, 0.5) * 0.8 - Math.random() * 2;
      const baseWakeups = Math.min(2, this.sigmoid(stressAnxietyInteraction - 1.5, 0.8) * 1.2 + (1 - this.sigmoid(baseSleepQuality - 6, 0.6)) * 0.4 + Math.random() * 0.4);
      const baseExerciseIntensity = this.sigmoid(baseMood - 5, 0.5) * 1.5 + this.sigmoid(baseSocialSupport - 4, 0.3) * 0.8 + 1.5 + this.addDailyVariation(0, 0.3);
      const baseExerciseDuration = baseExerciseIntensity * 3.5 + this.sigmoid(baseSocialSupport - 4, 0.4) * 4 + 10 + Math.random() * 5 - 2.5;
      const baseDietVariety = this.sigmoid(baseMood - 5, 0.6) * 1.2 + this.sigmoid(baseSocialSupport - 4, 0.4) * 1.2 + 3.5 + this.addDailyVariation(0, 0.3);
      const painContributions = [
        (1 - this.sigmoid(baseSleepQuality - 6, 0.7)) * 1.8,
        this.sigmoid(baseStress - 3, 0.5) * 1.3,
        this.sigmoid(baseAnxiety - 3, 0.5) * 1.3,
        (1 - this.sigmoid(baseExerciseIntensity - 2.5, 0.6)) * 1,
        (1 - this.sigmoid(baseDietVariety - 4.5, 0.6)) * 1,
        (1 - this.sigmoid(baseSocialSupport - 4, 0.4)) * 0.8
      ].map((value) => value * (0.8 + Math.random() * 0.4));
      const basePain = painContributions.reduce((sum, curr) => sum + curr, 0);
      data.push({
        pain: this.addNoise(basePain, 1.4, 0, 5),
        // Psychological metrics with more variation
        p_mood: this.addNoise(baseMood, 1.4, 3, 10),
        p_stress: this.addNoise(baseStress, 1, 2, 6),
        p_anxiety: this.addNoise(baseAnxiety, 1, 2, 5),
        // Sleep metrics with more variation
        s_quality: this.addNoise(baseSleepQuality, 1.4, 5, 8),
        s_duration: this.addNoise(baseSleepDuration, 1.4, 5, 8),
        s_wakeup: this.addNoise(baseWakeups, 0.8, 0, 2),
        // Diet metrics with more independence
        d_variety: this.addNoise(baseDietVariety, 1, 4, 6),
        d_packaged: this.addNoise(7 - baseDietVariety + Math.random() - 0.5, 1, 1, 3),
        d_meat_dairy: this.addNoise(4 - baseDietVariety / 2 + Math.random() - 0.5, 1, 1, 3),
        // Exercise metrics with more variation
        e_intensity: this.addNoise(baseExerciseIntensity, 1, 2, 4),
        e_duration: this.addNoise(baseExerciseDuration, 4, 15, 30),
        e_exertion: this.addNoise(baseExerciseIntensity * 0.75, 1, 2, 3),
        // Social metrics with more independence
        s_work_relations: this.addNoise(
          Math.max(3, Math.min(
            5,
            4 + // Base level
            this.sigmoid(baseMood - 5, 0.4) * 0.8 + -this.sigmoid(baseStress - 4, 0.4) * 0.6 + this.sigmoid(baseSocialSupport - 4, 0.4) * 0.5 + (Math.random() * 0.6 - 0.3)
          )),
          0.8,
          3,
          5
        ),
        s_family_relations: this.addNoise(
          Math.max(3, Math.min(
            5,
            4 + // Base level
            this.sigmoid(baseMood - 5, 0.4) * 0.8 + -this.sigmoid(baseStress - 4, 0.4) * 0.5 + this.sigmoid(baseSocialSupport - 4, 0.5) * 0.6 + (Math.random() * 0.6 - 0.3)
          )),
          0.8,
          3,
          5
        ),
        s_social_relations: this.addNoise(
          baseSocialRelations,
          0.8,
          5,
          7
        )
      });
    }
    return data;
  }
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const newDate = ref(/* @__PURE__ */ new Date());
    const painDataAnalyser = new PainDataAnalyser();
    const testData = painDataAnalyser.generateSyntheticData(1e3);
    const results = painDataAnalyser.analyzeHealthData(testData);
    console.log("Correlations:", results.correlations);
    console.log("Regression Results:", results.regression);
    const factor1 = {
      factorID: "psychological",
      factorType: "psychological distress",
      factorValue: 8
    };
    const factor2 = {
      factorID: "exercise",
      factorType: "exercise",
      factorValue: 6
    };
    const factor3 = {
      factorID: "sleep",
      factorType: "sleep",
      factorValue: 4
    };
    const factor4 = {
      factorID: "nutrition",
      factorType: "nutrition",
      factorValue: 2
    };
    const factor5 = {
      factorID: "social",
      factorType: "social connection",
      factorValue: 1
    };
    const factors = [factor5, factor1, factor2, factor3, factor4];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(MainHeader, {
        title: "Overview",
        dynamicDropdownComponent: OverviewTimelineDropdown
      }, null, _parent));
      _push(`<div class="page-container">`);
      _push(ssrRenderComponent(OverviewCalendar, { initialDate: unref(newDate) }, null, _parent));
      _push(ssrRenderComponent(OverviewLifestyleScore, { lifestyleScore: 82 }, null, _parent));
      _push(ssrRenderComponent(OverviewPainFactors, { painFactors: factors }, null, _parent));
      _push(`</div></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/demo/[token]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BYchQI9H.mjs.map
