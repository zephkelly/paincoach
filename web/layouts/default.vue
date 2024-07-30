<template>
    <slot/>
</template>

<style lang="css">
main {
    padding: 1rem;
    background-color: var(--background-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: calc(100vh - 2rem);
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 5px;
}

/* For Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
</style>