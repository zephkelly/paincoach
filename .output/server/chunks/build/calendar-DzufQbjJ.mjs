import { useSSRContext, defineComponent, mergeProps, createVNode, resolveDynamicComponent, ref } from 'vue';
import { ssrRenderAttrs, ssrRenderVNode, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import { u as useState } from './state-_I5XcLqc.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mainHeader",
  __ssrInlineRender: true,
  props: {
    title: {},
    dynamicDropdownComponent: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "header overview" }, _attrs))} data-v-8569b159><header class="overview-header" data-v-8569b159><div class="wrapper timeline" data-v-8569b159>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.dynamicDropdownComponent), null, null), _parent);
      _push(`</div><div class="wrapper" data-v-8569b159><h1 data-v-8569b159>${ssrInterpolate(_ctx.title)}</h1></div><div class="wrapper search" data-v-8569b159><button class="btn search" data-v-8569b159><svg class="search" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed" data-v-8569b159><path d="M762.69-160.92 524.46-399.16q-30 22.77-65.79 35.27-35.79 12.5-73.87 12.5-93.58 0-159.11-65.51-65.53-65.51-65.53-159.04 0-93.52 65.51-159.1 65.51-65.57 159.04-65.57 93.52 0 159.1 65.53 65.57 65.53 65.57 159.11 0 39.23-12.88 75.02-12.89 35.8-34.89 64.64l238.23 238.23-37.15 37.16ZM384.77-403.38q72.31 0 122.46-50.16 50.16-50.15 50.16-122.46t-50.16-122.46q-50.15-50.16-122.46-50.16t-122.46 50.16Q212.15-648.31 212.15-576t50.16 122.46q50.15 50.16 122.46 50.16Z" data-v-8569b159></path></svg></button></div></header></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/app/mainHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MainHeader = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8569b159"]]);
const useTimelineDropdown = () => {
  const isEnabled = ref(false);
  function enable() {
    isEnabled.value = true;
  }
  function disable() {
    isEnabled.value = false;
  }
  function toggleEnabled() {
    isEnabled.value = !isEnabled.value;
  }
  return {
    isEnabled,
    enable,
    disable,
    toggleEnabled
  };
};
const useOverviewTimeline = () => {
  const currentTimeline = useState("currentTimeline", () => "week");
  function setTimeline(timeline) {
    currentTimeline.value = timeline;
  }
  function isCurrentTimeline(timeline) {
    return currentTimeline.value === timeline;
  }
  return {
    currentTimeline,
    setTimeline,
    isCurrentTimeline
  };
};
const daysOfWeeks = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const daysOfWeeksShort = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const daysOfWeekLabels = ["S", "M", "T", "W", "T", "F", "S"];
function getStartingDayOfWeekIndex(date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  return firstDayOfMonth.getDay();
}
function getDayOfWeek(index) {
  return daysOfWeeks[index];
}
function getDayOfWeekShort(index) {
  return daysOfWeeksShort[index];
}
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}
function getEndOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (6 - day));
  return d;
}
function getStartOfFortnight(date) {
  const d = new Date(date);
  const startOfWeek = getStartOfWeek(d);
  const dayOfMonth = startOfWeek.getDate();
  if (dayOfMonth <= 7) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  } else if (dayOfMonth <= 21) {
    return startOfWeek;
  } else {
    const lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const twoWeeksBeforeEnd = new Date(lastDayOfMonth);
    twoWeeksBeforeEnd.setDate(lastDayOfMonth.getDate() - 13);
    return getStartOfWeek(twoWeeksBeforeEnd);
  }
}
function getEndOfFortnight(date) {
  const start = getStartOfFortnight(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 13);
  return end;
}
function generateCalendarDays(startDate, endDate, emptyDaysAtStart) {
  const days = [];
  let currentDate = new Date(startDate);
  let dayIndex = 0;
  while (currentDate <= endDate) {
    days.push({
      date: new Date(currentDate),
      index: dayIndex + emptyDaysAtStart,
      painLevel: Math.floor(Math.random() * 4),
      dayOfWeek: getDayOfWeek(currentDate.getDay()),
      dayOfWeekShort: getDayOfWeekShort(currentDate.getDay())
    });
    currentDate.setDate(currentDate.getDate() + 1);
    dayIndex++;
  }
  return days;
}
function getEmptyDaysAtStart(date, timeline) {
  let startDate;
  switch (timeline) {
    case "week":
      startDate = getStartOfWeek(date);
      break;
    case "fortnight":
      startDate = getStartOfFortnight(date);
      break;
    case "month":
    default:
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      break;
  }
  return startDate.getDay();
}
function currentDateMonthDay() {
  const today = /* @__PURE__ */ new Date();
  const options = { month: "long", day: "numeric" };
  return today.toLocaleDateString("en-US", options);
}

export { MainHeader as M, useOverviewTimeline as a, generateCalendarDays as b, getStartingDayOfWeekIndex as c, getStartOfFortnight as d, getEndOfFortnight as e, getStartOfWeek as f, getEmptyDaysAtStart as g, getEndOfWeek as h, currentDateMonthDay as i, daysOfWeekLabels as j, useTimelineDropdown as u };
//# sourceMappingURL=calendar-DzufQbjJ.mjs.map
