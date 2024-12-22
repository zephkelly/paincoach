import { ref } from 'vue';
import { u as useState } from './state-_I5XcLqc.mjs';

const useFactorsExpanded = () => {
  const factorsExpanded = ref(useState("factorsExpanded", () => ({
    "psychological": false,
    "exercise": false,
    "nutrition": false,
    "social": false,
    "sleep": false
  })));
  const toggleFactor = (factor) => {
    factorsExpanded.value = {
      ...factorsExpanded.value,
      [factor]: !factorsExpanded.value[factor]
    };
    return factorsExpanded.value[factor];
  };
  const disableAllFactors = () => {
    factorsExpanded.value = Object.keys(factorsExpanded.value).reduce((acc, factor) => {
      acc[factor] = false;
      return acc;
    }, {});
  };
  const disableAllButThenToggle = (factor) => {
    const currentFactorState = factorsExpanded.value[factor];
    disableAllFactors();
    factorsExpanded.value = {
      ...factorsExpanded.value,
      [factor]: !currentFactorState
    };
    return factorsExpanded.value[factor];
  };
  const isAnyFactorExpanded = () => {
    return Object.values(factorsExpanded.value).some((value) => value);
  };
  const isFactorExpanded = (factor) => {
    return !!factorsExpanded.value[factor];
  };
  return {
    factorsExpanded,
    toggleFactor,
    disableAllButThenToggle,
    disableAllFactors,
    isFactorExpanded,
    isAnyFactorExpanded
  };
};

export { useFactorsExpanded as u };
//# sourceMappingURL=useFactorsExpanded-KdlO_xOY.mjs.map
