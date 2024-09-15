<template>
    <div class="mockup-container" :class="{ half: halfScreen, 'full-width': fullWidth }">
        <div v-if="halfScreen && !nofade" class="fade"></div>
        <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
            <title>phone_14_01</title>
            <defs>
                <linearGradient id="g1" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,51.778,-1.226,0,356.834,144.368)">
                    <stop offset="0" stop-color="#68595f"/>
                    <stop offset=".019" stop-color="#896e80"/>
                    <stop offset=".038" stop-color="#5e3b5b"/>
                    <stop offset=".082" stop-color="#2b1d2a"/>
                    <stop offset=".105" stop-color="#704a6a"/>
                    <stop offset=".905" stop-color="#615060"/>
                    <stop offset=".939" stop-color="#2b1d2a"/>
                    <stop offset=".965" stop-color="#5e3b5b"/>
                    <stop offset=".983" stop-color="#845675"/>
                    <stop offset="1" stop-color="#5b4a5c"/>
                </linearGradient>
                <linearGradient id="g2" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,51.767,-0.613,0,357.447,144.382)">
                    <stop offset="0" stop-color="#676067"/>
                    <stop offset=".064" stop-color="#654e63"/>
                    <stop offset=".186" stop-color="#786f77"/>
                    <stop offset=".806" stop-color="#786f77"/>
                    <stop offset=".919" stop-color="#654e63"/>
                    <stop offset="1" stop-color="#676067"/>
                </linearGradient>
                <linearGradient id="g3" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,32.8,.7,0,144.758,133.469)">
                    <stop offset="0" stop-color="#68595f"/>
                    <stop offset=".019" stop-color="#896e80"/>
                    <stop offset=".038" stop-color="#5e3b5b"/>
                    <stop offset=".082" stop-color="#2d1e2c"/>
                    <stop offset=".105" stop-color="#704a6a"/>
                    <stop offset=".905" stop-color="#615060"/>
                    <stop offset=".939" stop-color="#2d1e2c"/>
                    <stop offset=".965" stop-color="#5e3b5b"/>
                    <stop offset=".983" stop-color="#845675"/>
                    <stop offset="1" stop-color="#5b4a5c"/>
                </linearGradient>
                <linearGradient id="g4" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,32.793,.35,0,144.408,133.478)">
                    <stop offset="0" stop-color="#676067"/>
                    <stop offset=".064" stop-color="#654e63"/>
                    <stop offset=".186" stop-color="#786f77"/>
                    <stop offset=".806" stop-color="#786f77"/>
                    <stop offset=".919" stop-color="#654e63"/>
                    <stop offset="1" stop-color="#676067"/>
                </linearGradient>
                <linearGradient id="g5" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,-32.802,1434.593,0,-571.464,166.279)">
                    <stop offset="0" stop-color="#68595f"/>
                    <stop offset=".053" stop-color="#2d1e2c"/>
                    <stop offset=".518" stop-color="#5e3b5b"/>
                    <stop offset=".965" stop-color="#2d1e2c"/>
                    <stop offset="1" stop-color="#5b4a5c"/>
                </linearGradient>
                <linearGradient id="g6" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,32.8,.7,0,144.758,174.735)">
                    <stop offset="0" stop-color="#68595f"/>
                    <stop offset=".019" stop-color="#896e80"/>
                    <stop offset=".038" stop-color="#5e3b5b"/>
                    <stop offset=".082" stop-color="#2d1e2c"/>
                    <stop offset=".105" stop-color="#704a6a"/>
                    <stop offset=".905" stop-color="#615060"/>
                    <stop offset=".939" stop-color="#2d1e2c"/>
                    <stop offset=".965" stop-color="#5e3b5b"/>
                    <stop offset=".983" stop-color="#845675"/>
                    <stop offset="1" stop-color="#5b4a5c"/>
                </linearGradient>
                <linearGradient id="g7" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,32.793,.35,0,144.408,174.744)">
                    <stop offset="0" stop-color="#676067"/>
                    <stop offset=".064" stop-color="#654e63"/>
                    <stop offset=".186" stop-color="#786f77"/>
                    <stop offset=".806" stop-color="#786f77"/>
                    <stop offset=".919" stop-color="#654e63"/>
                    <stop offset="1" stop-color="#676067"/>
                </linearGradient>
                <linearGradient id="g8" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,-32.802,1434.593,0,-571.464,207.545)">
                    <stop offset="0" stop-color="#68595f"/>
                    <stop offset=".053" stop-color="#2d1e2c"/>
                    <stop offset=".518" stop-color="#5e3b5b"/>
                    <stop offset=".965" stop-color="#2d1e2c"/>
                    <stop offset="1" stop-color="#5b4a5c"/>
                </linearGradient>
                <linearGradient id="g9" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,16.836,.7,0,144.758,102.479)">
                    <stop offset="0" stop-color="#68595f"/>
                    <stop offset=".019" stop-color="#896e80"/>
                    <stop offset=".038" stop-color="#5e3b5b"/>
                    <stop offset=".082" stop-color="#2d1e2c"/>
                    <stop offset=".105" stop-color="#704a6a"/>
                    <stop offset=".905" stop-color="#615060"/>
                    <stop offset=".939" stop-color="#2d1e2c"/>
                    <stop offset=".965" stop-color="#5e3b5b"/>
                    <stop offset=".983" stop-color="#845675"/>
                    <stop offset="1" stop-color="#5b4a5c"/>
                </linearGradient>
                <linearGradient id="g10" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,16.829,.35,0,144.408,102.487)">
                    <stop offset="0" stop-color="#676067"/>
                    <stop offset=".064" stop-color="#654e63"/>
                    <stop offset=".186" stop-color="#786f77"/>
                    <stop offset=".806" stop-color="#786f77"/>
                    <stop offset=".919" stop-color="#654e63"/>
                    <stop offset="1" stop-color="#676067"/>
                </linearGradient>
                <linearGradient id="g11" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,-16.837,377.975,0,-43.155,119.324)">
                    <stop offset="0" stop-color="#68595f"/>
                    <stop offset=".053" stop-color="#2d1e2c"/>
                    <stop offset=".518" stop-color="#5e3b5b"/>
                    <stop offset=".965" stop-color="#2d1e2c"/>
                    <stop offset="1" stop-color="#5b4a5c"/>
                </linearGradient>
                <linearGradient id="g12" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,-5.861,5.862,0,261.866,60.635)">
                    <stop offset="0" stop-color="#666666"/>
                    <stop offset="1" stop-color="#010104"/>
                </linearGradient>
                <linearGradient id="g13" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(2.465,2.866,-2.866,2.465,263.659,56.142)">
                    <stop offset="0" stop-color="#171919"/>
                    <stop offset="1" stop-color="#4e4f51"/>
                </linearGradient>
                <linearGradient id="g14" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0,3.349,-3.349,0,266.541,56.248)">
                    <stop offset="0" stop-color="#0b131c"/>
                    <stop offset="1" stop-color="#354039"/>
                </linearGradient>
                <linearGradient id="g15" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-2.975,-2.975,2.975,-2.975,264.841,60.819)">
                    <stop offset="0" stop-color="#231f20"/>
                    <stop offset=".785" stop-color="#0095ee"/>
                    <stop offset="1" stop-color="#231f20"/>
                </linearGradient>
                <radialGradient id="g16" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(1.488,0,0,1.488,264.841,57.844)">
                    <stop offset="0" stop-color="#231f20"/>
                    <stop offset=".733" stop-color="#00adee"/>
                    <stop offset="1" stop-color="#231f20"/>
                </radialGradient>
                <radialGradient id="g17" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(.531,0,0,.531,265.658,58.62)">
                    <stop offset="0" stop-color="#cccccc"/>
                    <stop offset="1" stop-color="#000000"/>
                </radialGradient>
            </defs>
            <g id="Layer 1">
                <path id="&lt;Path&gt;" class="s0" d="m322 464.2h-142.2c-18.6 0-33.6-15-33.6-33.6v-362.4c0-18.6 15-33.6 33.6-33.6h142.2c18.6 0 33.6 15 33.6 33.6v362.4c0 18.6-15 33.6-33.6 33.6z"/>
                <path id="&lt;Path&gt;" fill-rule="evenodd" class="s1" d="m321.2 460.9h-140.6c-17 0-30.8-13.8-30.8-30.8v-361.4c0-17 13.8-30.8 30.8-30.8h140.6c17 0 30.9 13.8 30.9 30.8v361.4c0 17-13.9 30.8-30.9 30.8z"/>
                <clipPath id="screenClip">
                    <path d="m305 44.7h16.4c13.2 0 24 10.8 24 24.1v361.2c0 13.3-10.8 24.1-24 24.1h-140.9c-13.3 0-24.1-10.8-24.1-24.1v-361.2c0-13.3 10.8-24.1 24.1-24.1 5.2 0 10.5 0 16.1 0z"/>
                </clipPath>
                <image x="156.4" y="44.7" width="188.4" height="409.4" clip-path="url(#screenClip)" :href="src" preserveAspectRatio="xMidYMid slice"/>
                <g id="&lt;Group&gt;">
                    <g id="&lt;Group&gt;">
                        <path id="&lt;Path&gt;" class="s3" d="m355.6 196.1v-51.7h1.2v51.7z"/>
                        <path id="&lt;Path&gt;" class="s4" d="m356.8 196.1v-51.7l0.6 0.7c-0.3 5.5-0.2 44.9 0 50.4z"/>
                    </g>
                    <g id="&lt;Group&gt;">
                        <path id="&lt;Path&gt;" class="s5" d="m145.5 166.3v-32.8h-0.7v32.8z"/>
                        <path id="&lt;Path&gt;" class="s6" d="m144.8 166.3v-32.8l-0.4 0.4c0.2 3.5 0.2 28.5 0 31.9z"/>
                        <path id="&lt;Path&gt;" class="s7" d="m146.2 166.3h-0.7v-32.8h0.7z"/>
                    </g>
                    <g id="&lt;Group&gt;">
                        <path id="&lt;Path&gt;" class="s8" d="m145.5 207.5v-32.8h-0.7v32.8z"/>
                        <path id="&lt;Path&gt;" class="s9" d="m144.8 207.5v-32.8l-0.4 0.5c0.2 3.5 0.2 28.4 0 31.9z"/>
                        <path id="&lt;Path&gt;" class="s10" d="m146.2 207.5h-0.7v-32.8h0.7z"/>
                    </g>
                    <g id="&lt;Group&gt;">
                        <path id="&lt;Path&gt;" class="s11" d="m145.5 119.3v-16.8h-0.7v16.8z"/>
                        <path id="&lt;Path&gt;" class="s12" d="m144.8 119.3v-16.8l-0.4 0.4c0.2 3.3 0.2 12.7 0 16z"/>
                        <path id="&lt;Path&gt;" class="s13" d="m146.2 119.3h-0.7v-16.8h0.7z"/>
                    </g>
                </g>
                <g id="&lt;Group&gt;" style="mix-blend-mode: multiply">
                    <path id="&lt;Path&gt;" class="s1" d="m266.7 64.7h-33.4c-3.8 0-6.8-3.1-6.8-6.9 0-3.7 3-6.8 6.8-6.8h33.4c3.8 0 6.8 3.1 6.8 6.8 0 3.8-3 6.9-6.8 6.9z"/>
                    <g id="&lt;Group&gt;">
                        <path id="&lt;Path&gt;" class="s14" d="m267.8 57.8c0 1.7-1.3 3-3 3-1.6 0-2.9-1.3-2.9-3 0-1.6 1.3-2.9 2.9-2.9 1.7 0 3 1.3 3 2.9z"/>
                        <path id="&lt;Mesh&gt;" class="s15" d="m262.9 59.8q0.5 0.5 1.1 0.7c-0.1-0.5-0.3-0.9-0.4-1.5-0.4-0.1-1.1-0.2-1.4-0.3q0.2 0.6 0.7 1.1zm-0.7-1.1c0.3 0.1 1 0.2 1.4 0.3-0.1-0.9-0.1-1.9 0.1-2.9-0.5 0.1-0.9 0.2-1.3 0.4-0.4 0.7-0.4 1.5-0.2 2.2zm0.2-2.2c0.4-0.2 0.8-0.3 1.3-0.4 0-0.3 0.2-0.7 0.3-0.9q-0.6 0.2-1.1 0.7-0.3 0.3-0.5 0.6zm1.6 4c0.6 0.2 1.2 0.2 1.8 0 0.1-0.4 0.3-0.9 0.3-1.5-0.6 0.1-1.9 0.1-2.5 0 0.1 0.6 0.3 1 0.4 1.5zm-0.4-1.5c0.6 0.1 1.9 0.1 2.5 0 0.1-1 0.1-2.1-0.1-2.9-0.7-0.1-1.7-0.1-2.3 0-0.2 1-0.2 2-0.1 2.9zm0.1-2.9c0.6-0.1 1.6-0.1 2.3 0 0-0.3-0.1-0.7-0.2-0.9-0.6-0.2-1.2-0.2-1.8 0-0.1 0.2-0.3 0.6-0.3 0.9zm2.1 4.4q0.6-0.3 1-0.7 0.5-0.5 0.7-1.1c-0.3 0.1-1 0.2-1.4 0.3 0 0.6-0.2 1.1-0.3 1.5zm0.3-1.5c0.4-0.1 1.1-0.2 1.4-0.3 0.2-0.7 0.1-1.5-0.2-2.2-0.4-0.2-0.8-0.3-1.3-0.4 0.2 0.8 0.2 1.9 0.1 2.9zm-0.1-2.9c0.5 0.1 0.9 0.2 1.3 0.4q-0.2-0.3-0.5-0.6-0.4-0.5-1-0.7c0.1 0.2 0.2 0.6 0.2 0.9z"/>
                        <path id="&lt;Path&gt;" class="s16" d="m263.1 57.8c0-0.9 0.8-1.7 1.7-1.7 1 0 1.7 0.8 1.7 1.7 0 1-0.7 1.7-1.7 1.7-0.9 0-1.7-0.7-1.7-1.7z"/>
                        <g id="Camera 00000181771962106803296260000008551096653390836141 ">
                            <path id="&lt;Path&gt;" class="s17" d="m266.3 57.8c0 0.9-0.6 1.5-1.5 1.5-0.8 0-1.4-0.6-1.4-1.5 0-0.8 0.6-1.4 1.4-1.4 0.9 0 1.5 0.6 1.5 1.4z"/>
                            <path id="&lt;Path&gt;" class="s18" d="m266.3 57.8c0 0.9-0.6 1.5-1.5 1.5-0.8 0-1.4-0.6-1.4-1.5 0-0.8 0.6-1.4 1.4-1.4 0.9 0 1.5 0.6 1.5 1.4z"/>
                        </g>
                        <path id="&lt;Path&gt;" class="s19" d="m266.2 58.6c0-0.3-0.2-0.5-0.5-0.5-0.3 0-0.6 0.2-0.6 0.5 0 0.3 0.3 0.6 0.6 0.6 0.3 0 0.5-0.3 0.5-0.6z"/>
                    </g>
                </g>
            </g>
        </svg>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    src: string;
    halfScreen?: boolean;
    fullWidth?: boolean;
    nofade?: boolean;
}>();
</script>

<style lang="scss" scoped>
.mockup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 300px;
    position: relative;
}

svg {
    position: absolute;
    height: 100%;
    width: auto;
    .s0 { fill: #5e465d } 
    .s1 { fill: #1d1d1b } 
    .s2 { fill: #ffffff } 
    .s3 { fill: url(#g1) } 
    .s4 { fill: url(#g2) } 
    .s5 { fill: url(#g3) } 
    .s6 { fill: url(#g4) } 
    .s7 { fill: url(#g5) } 
    .s8 { fill: url(#g6) } 
    .s9 { fill: url(#g7) } 
    .s10 { fill: url(#g8) } 
    .s11 { fill: url(#g9) } 
    .s12 { fill: url(#g10) } 
    .s13 { fill: url(#g11) } 
    .s14 { fill: url(#g12) } 
    .s15 { fill: url(#g13) } 
    .s16 { fill: url(#g14) } 
    .s17 { fill: url(#g15) } 
    .s18 { mix-blend-mode: multiply;fill: url(#g16) } 
    .s19 { mix-blend-mode: screen;fill: url(#g17) } 
}

.fade {
    position: absolute;
    height: 100%;
    width: 100%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, var(--text-color) 100%);
    opacity: 0.2;
    border-radius: 8px;
}

.mockup-container.half {
    overflow: hidden;

    svg {
        top: -10%;
        height: 160%;
    }
}

.mockup-container.full-width {
    width: 100%;
}
</style>