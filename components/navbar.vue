<template>
    <section :class="{ docked: isDocked }">
        <nav>
            <ul>
                <li>
                    <div class="image-container">
                        <img src="/public/images/logo.png" />
                    </div>
                </li>
                <li>
                    <button class="svg-container">
                        <svg stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5">
                            <path d="M3 5H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M3 12H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M3 19H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    </section>
</template>


<script lang="ts" setup>
const isDocked = ref(true);
const observer = ref<IntersectionObserver | null>(null);

onMounted(() => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  };

  observer.value = new IntersectionObserver(([entry]) => {
    isDocked.value = entry.isIntersecting;
  }, options);

  const target = document.createElement('div');
  target.style.height = '1px';
  target.style.width = '100%';
  target.style.position = 'absolute';
  target.style.top = '0';
  target.style.left = '0';
  document.body.appendChild(target);

  observer.value.observe(target);
});

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<!-- Un-Docked -->
<style lang="scss" scoped>
section {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    background-color: hsl(var(--background-color)/0.6);
    backdrop-filter: blur(8px);
    color: white;
    z-index: 1000;

    transition: background-color 0.5s cubic-bezier(0.075, 0.82, 0.165, 1), backdrop-filter 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
    will-change: background-color, backdrop-filter;

    * {
        box-sizing: border-box;
    }
}

nav {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    height: 56px;

    ul {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: row;
        justify-content: space-between;

        li {
            position: relative;
            display: flex;
            height: 100%;
            width: 100%;

            &:last-child {
                justify-content: flex-end;
            }
        }
    }
}

.image-container {
    position: relative;
    height: 100%;
    width: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    img {
        position: relative;
        top: 2px;
        left: -4px;
        width: 100px;
        transition: 
            height 0.2s cubic-bezier(0.075, 0.82, 0.165, 1),
            top 0.3s cubic-bezier(0.075, 0.82, 0.165, 1),
            left 0.3s cubic-bezier(0.075, 0.82, 0.165, 1),
            width 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
        will-change: height, top, left;

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }

        @media (prefers-color-scheme: light) {
            filter: invert(1);
        }
    }
}

.svg-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 34px;
    width: 34px;
    top: -5px;
    background-color: transparent;
    border: none;
    border-radius: 0;
    color: var(--text-color);
    cursor: pointer;

    svg {
        height: 100%;
        width: auto;
        fill: none;
        stroke: var(--text-color);
        stroke-width: 1.5;
        stroke-linecap: round;
        stroke-linejoin: round;
        transform: scaleX(-1);
        opacity: 1;
        transition: opacity 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
        will-change: opacity;
    }
}
</style>

<!-- Docked -->
<style lang="scss" scoped>
section.docked {
    background-color: transparent;
    backdrop-filter: blur(0px);

    .image-container {
        img {
            left: -9px;
            width: 200px;
            top: 2rem;
        }
    }

    .svg-container {
        svg {
            opacity: 0;
        }
    }
}
</style>