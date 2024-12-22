import { useSSRContext, defineComponent, ref, computed, mergeProps, unref } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import { u as useTimelineDropdown, a as useOverviewTimeline, g as getEmptyDaysAtStart, b as generateCalendarDays, M as MainHeader } from './calendar-DzufQbjJ.mjs';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "calendar",
  __ssrInlineRender: true,
  props: {
    calendarDays: {},
    currentMonth: {}
  },
  emits: ["openDataComponent", "closeDataComponent"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const activeDay = ref(null);
    const flatCalendarDays = computed(() => {
      var _a;
      const days = [];
      const firstDay = (_a = props.calendarDays[0].date) == null ? void 0 : _a.getDay();
      if (firstDay === void 0) {
        return days;
      }
      for (let i = 0; i < firstDay; i++) {
        days.push({ date: null, painLevel: "missing", index: -1, dayOfWeek: null, dayOfWeekShort: null });
      }
      days.push(...props.calendarDays);
      while (days.length % 7 !== 0) {
        days.push({ date: null, painLevel: "missing", index: -1, dayOfWeek: null, dayOfWeekShort: null });
      }
      return days;
    });
    ref(null);
    const formatMonth = (date) => {
      return date.toLocaleString("default", { month: "long", year: "numeric" });
    };
    const formatDate = (date) => {
      return date.toISOString().split("T")[0];
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "calendar",
        role: "grid",
        "aria-labelledby": "calendar-title"
      }, _attrs))} data-v-fc1898b6><h2 id="calendar-title" class="calendar-title" data-v-fc1898b6>${ssrInterpolate(formatMonth(_ctx.currentMonth))}</h2><div class="calendar-header" data-v-fc1898b6><!--[-->`);
      ssrRenderList(daysOfWeek, (day) => {
        _push(`<div class="calendar-header-cell" data-v-fc1898b6>${ssrInterpolate(day.slice(0, 3))}</div>`);
      });
      _push(`<!--]--></div><div class="calendar-body" data-v-fc1898b6><!--[-->`);
      ssrRenderList(unref(flatCalendarDays), (day, index) => {
        _push(`<div class="${ssrRenderClass([{ "empty": !day.date }, "calendar-cell"])}" data-v-fc1898b6>`);
        if (day.painLevel !== void 0) {
          _push(`<span class="${ssrRenderClass([[
            `pain-level-${day.painLevel}`,
            { "inactive": unref(activeDay) && day.date && day.date.getTime() !== unref(activeDay).getTime() }
          ], "pain-level"])}" data-v-fc1898b6></span>`);
        } else {
          _push(`<!---->`);
        }
        if (day.date) {
          _push(`<time${ssrRenderAttr("datetime", formatDate(day.date))} data-v-fc1898b6>${ssrInterpolate(day.date.getDate())}</time>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/calendar/calendar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Calendar = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-fc1898b6"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
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
      const currentIndex = options.findIndex((timeline) => timeline.value === currentTimeline.value);
      if (currentIndex !== -1) {
        options.splice(currentIndex, 1);
      }
      return options;
    });
    computed(() => {
      return timelineLengths.find((timeline) => timeline.value === currentTimeline.value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["timeline", { open: unref(isEnabled) }]
      }, _attrs))} data-v-0d30d6af><button class="${ssrRenderClass([unref(currentTimeline), "main"])}" data-v-0d30d6af><div class="current-selection none" data-v-0d30d6af></div><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" data-v-0d30d6af><path d="M480-397.85 311.85-566h336.3L480-397.85Z" data-v-0d30d6af></path></svg></button><nav style="${ssrRenderStyle(unref(isEnabled) ? null : { display: "none" })}" class="menu" data-v-0d30d6af><ul data-v-0d30d6af><!--[-->`);
      ssrRenderList(unref(dropdownOptions), (option) => {
        _push(`<li data-v-0d30d6af><button class="${ssrRenderClass(option.value)}" data-v-0d30d6af></button></li>`);
      });
      _push(`<!--]--></ul></nav></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/calendar/timelineDropdown.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const CalendarTimelineDropdown = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-0d30d6af"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "dayOverview",
  __ssrInlineRender: true,
  props: {
    dayShort: {},
    dayNumber: {},
    month: {},
    year: {},
    painLevel: {}
  },
  setup(__props) {
    const getPainColor = (level) => {
      const painColors = ["var(--pain-0)", "var(--pain-1)", "var(--pain-2)", "var(--pain-3)"];
      return painColors[level] || painColors[0];
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: "day-overview",
        id: "calendar-day-overview"
      }, _attrs))} data-v-9e7c72dc><span class="severity-indicator" style="${ssrRenderStyle({ backgroundColor: getPainColor(_ctx.painLevel) })}" data-v-9e7c72dc></span><div class="wrapper title" data-v-9e7c72dc><h4 data-v-9e7c72dc>${ssrInterpolate(_ctx.dayShort)} ${ssrInterpolate(_ctx.dayNumber)}</h4><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed" data-v-9e7c72dc><path d="M212.31-140Q182-140 161-161q-21-21-21-51.31v-535.38Q140-778 161-799q21-21 51.31-21h346.23l-60 60H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-288.77l60-60v348.77Q820-182 799-161q-21 21-51.31 21H212.31ZM480-480ZM380-380v-137.31l362.39-362.38q9.3-9.31 20.46-13.58 11.15-4.27 22.69-4.27 11.77 0 22.61 4.27Q819-889 827.92-880.08L878.15-830q8.69 9.31 13.35 20.54 4.65 11.23 4.65 22.77t-3.96 22.38q-3.96 10.85-13.27 20.15L515.38-380H380Zm456.77-406.31-50.23-51.38 50.23 51.38ZM440-440h49.85l249.3-249.31-24.92-24.92-26.69-25.69L440-492.38V-440Zm274.23-274.23-26.69-25.69 26.69 25.69 24.92 24.92-24.92-24.92Z" data-v-9e7c72dc></path></svg></div><p class="subtitle" data-v-9e7c72dc>${ssrInterpolate(_ctx.month)} ${ssrInterpolate(_ctx.year)}</p></article>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/calendar/dayOverview.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const DayOverview = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-9e7c72dc"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "calendar",
  __ssrInlineRender: true,
  setup(__props) {
    const currentDate = ref(/* @__PURE__ */ new Date());
    useOverviewTimeline();
    const selectedDay = ref(null);
    const calendarDays = computed(() => {
      let startDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1);
      let endDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0);
      const emptyDaysAtStart = getEmptyDaysAtStart(currentDate.value, "month");
      return generateCalendarDays(startDate, endDate, emptyDaysAtStart);
    });
    const handleOpenDataComponent = (dayData) => {
      selectedDay.value = dayData;
    };
    const handleCloseDataComponent = () => {
      selectedDay.value = null;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(_attrs)} data-v-ad4feb5d>`);
      _push(ssrRenderComponent(MainHeader, {
        title: "Calendar",
        dynamicDropdownComponent: CalendarTimelineDropdown
      }, null, _parent));
      _push(`<div class="page-container" data-v-ad4feb5d>`);
      _push(ssrRenderComponent(Calendar, {
        calendarDays: unref(calendarDays),
        currentMonth: unref(currentDate),
        onOpenDataComponent: handleOpenDataComponent,
        onCloseDataComponent: handleCloseDataComponent
      }, null, _parent));
      if (unref(selectedDay)) {
        _push(ssrRenderComponent(DayOverview, unref(selectedDay), null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/demo/[token]/calendar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const calendar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ad4feb5d"]]);

export { calendar as default };
//# sourceMappingURL=calendar-DopJidpX.mjs.map
