import{u as r}from"./CsR-CCGQ.js";import{r as n}from"./BE0YQD_y.js";const v=()=>{const a=n(r("factorsExpanded",()=>({psychological:!1,exercise:!1,nutrition:!1,social:!1,sleep:!1}))),t=e=>(a.value={...a.value,[e]:!a.value[e]},a.value[e]),l=()=>{a.value=Object.keys(a.value).reduce((e,s)=>(e[s]=!1,e),{})};return{factorsExpanded:a,toggleFactor:t,disableAllButThenToggle:e=>{const s=a.value[e];return l(),a.value={...a.value,[e]:!s},a.value[e]},disableAllFactors:l,isFactorExpanded:e=>!!a.value[e],isAnyFactorExpanded:()=>Object.values(a.value).some(e=>e)}};export{v as u};
