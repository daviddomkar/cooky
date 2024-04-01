import type { Theme } from "unocss/preset-uno";
import { defineConfig, presetUno, presetIcons, presetWebFonts } from "unocss";
import { presetForms } from "@julr/unocss-preset-forms";
import transformerDirectives from "@unocss/transformer-directives";
import { presetTheme } from "unocss-preset-theme";

const lightTheme = {
  colors: {
    primary: "#ffbd3e",
    secondary: "#ff5f54",
    surface: "#ffffff",
    "surface-container": "#f5f5f5",
    "surface-dimmed": "#d9d9d9",
    outline: "#808080",
    error: "#f87171",
    "on-primary": "#ffffff",
    "on-surface": "#101010",
    "on-surface-variant": "#c6c6c6",
    "on-surface-dimmed": "#8e8e8e",
  },
} as Theme;

const darkTheme = {
  colors: {
    primary: "#ffbd3e",
    secondary: "#ff5f54",
    surface: "#222222",
    "surface-container": "#101010",
    "surface-dimmed": "#101010",
    outline: "#808080",
    error: "#f87171",
    "on-primary": "#ffffff",
    "on-surface": "#ffffff",
    "on-surface-variant": "#ffffff",
    "on-surface-dimmed": "#ffffff",
  },
} as Theme;

export default defineConfig({
  presets: [
    presetForms(),
    presetUno(),
    presetIcons({
      collections: {
        cooky: {
          breakfast:
            '<svg viewBox="0 0 24 24" fill="none"><path d="M17.3414 1.00086H16.0818C16.0218 1.78189 16.6216 2.32268 16.6216 3.10371C16.6216 3.88474 16.0228 4.30527 16.0827 5.32667H17.3423C17.3423 4.48554 17.8812 4.065 17.8812 3.10371C17.8812 2.14242 17.2814 1.7819 17.3414 1.00086Z" fill="white"/><path d="M13.9226 1H12.663C12.603 1.78103 13.2028 2.32182 13.2028 3.10285C13.2028 3.88388 12.6039 4.30441 12.6639 5.32581H13.9235C13.9235 4.48468 14.4624 4.06414 14.4624 3.10285C14.4624 2.14156 13.8626 1.78104 13.9226 1Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.7446 7.24838V10.9734C14.4024 11.4799 15.2933 12.2189 15.6029 14.0375C17.3268 14.5176 17.8316 15.1002 18.0021 16.6209C19.0548 16.8673 19.5649 17.1505 20.2213 18.1229C20.5667 17.51 20.5938 16.9787 20.5812 15.96C20.5812 15.96 21.576 16.2979 22.4405 16.0201C23.2851 15.7487 24 14.8701 24 14.1576V11.8145C24 10.9514 23.2322 10.107 22.5005 9.83183C21.5514 9.47482 20.5812 9.83183 20.5812 9.83183V7.24838H10.7446ZM20.5812 11.9947V13.9173C20.5812 14.9987 22.5605 14.9387 22.5605 13.9774V11.9947C22.5605 10.9734 20.5812 10.733 20.5812 11.9947Z" fill="white"/><path d="M12.1796 19.5649H7.8611L5.8218 14.3379C5.04654 11.8145 14.9431 11.6943 14.1589 14.3379L12.1796 19.5649Z" fill="currentColor"/><path d="M4.38691 19.5648H6.30624L4.74678 15.4193C4.74678 15.4193 3.00738 15.7798 3.42724 16.9814C3.84709 18.183 4.38691 19.5648 4.38691 19.5648Z" fill="currentColor"/><path d="M2.88748 19.5648H0.968143C0.668053 18.3632 2.28769 18.0028 2.28769 18.0028L2.88748 19.5648Z" fill="currentColor"/><path d="M15.6385 19.5048H13.6836L15.2719 15.4193C15.2719 15.4193 17.0436 15.7746 16.6159 16.9587C16.1883 18.1429 15.6385 19.5048 15.6385 19.5048Z" fill="currentColor"/><path d="M17.1624 19.5048H19.0453C19.3397 18.3032 17.7508 17.9427 17.7508 17.9427L17.1624 19.5048Z" fill="currentColor"/><path d="M21.181 20.9467H0.00828124C0.00828124 20.9467 0.00828129 22.689 1.32783 22.689H19.9214C21.181 22.689 21.181 20.9467 21.181 20.9467Z" fill="currentColor"/></svg>',
          dinner:
            '<svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.3921 6.14003C13.4837 5.94591 13.5349 5.72894 13.5349 5.5C13.5349 4.67157 12.864 4 12.0365 4C11.2089 4 10.538 4.67157 10.538 5.5C10.538 5.7229 10.5866 5.93445 10.6737 6.12462C6.10667 6.72252 2.51378 10.4209 2.07248 15.04H21.8806C21.4429 10.4589 17.9054 6.78354 13.3921 6.14003ZM5.35447 13.6442C6.55892 10.3311 9.56649 9.04 11.497 9.04C11.7619 9.04 11.9765 8.8251 11.9765 8.56C11.9765 8.2949 11.7619 8.08 11.497 8.08C9.22663 8.08 5.81608 9.56725 4.45328 13.3158C4.36272 13.565 4.49104 13.8404 4.73989 13.9311C4.98875 14.0217 5.2639 13.8933 5.35447 13.6442Z" fill="currentColor"/><path d="M23.7694 16.06H0.23125C0.0768033 16.06 -0.0374219 16.2043 0.0114266 16.351C0.506703 17.8381 2.03579 19 3.10574 19H21.0871C21.9262 19 23.4506 17.7445 23.9851 16.3588C24.0422 16.211 23.9277 16.06 23.7694 16.06Z" fill="currentColor"/></svg>',
          lunch:
            '<svg viewBox="0 0 24 24" fill="none"><path d="M4.90005 21.8815C4.32353 22.3117 2.49541 20.4876 3.09655 19.8673C4.35929 18.5641 15.5418 8.19633 15.5418 8.19633C13.8825 5.48534 17.2851 3.04207 19.3296 1.32426C19.6116 1.08722 20.4118 0.731822 21.013 1.32414C21.0132 1.35693 17.5769 4.72636 17.5259 4.99721C17.4749 5.26806 17.8265 5.64893 18.1271 5.4712C18.4277 5.29347 21.8547 2.39056 22.0351 2.27203L22.6363 2.86446C21.3433 4.34821 19.3897 6.47838 19.3296 6.77455C19.2694 7.07072 19.6903 7.42622 19.9909 7.24849C20.2915 7.07076 23.5983 3.87159 23.5983 3.87159C24.1995 4.40483 24.0081 5.24775 23.7787 5.5304C21.8547 7.90017 19.6903 10.6253 16.9246 9.49967C16.8554 9.443 6.13143 20.9627 4.90005 21.8815Z" fill="currentColor"/><path d="M20.1697 19.9183C20.7783 20.5394 18.9276 22.3657 18.3439 21.935C17.7418 21.4906 14.9661 18.5891 12.249 15.714L13.9722 14.0161C16.7548 16.6393 19.5629 19.2989 20.1697 19.9183Z" fill="currentColor"/><path d="M10.9871 11.206C9.18601 9.51262 7.84552 8.2556 7.84552 8.2556C9.94982 4.1086 2.85531 0.55403 0.751008 2.33129C-1.69281 4.3953 2.25408 11.5732 6.46269 9.61819C6.48673 9.59873 7.74504 10.933 9.43849 12.7319L10.9871 11.206Z" fill="currentColor"/></svg>',
          sauces:
            '<svg viewBox="0 0 24 24" fill="none"><path d="M9.88 0H14.92V3.72H9.88V0Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.88 5.76H14.92V8.66069L17.8 13.08V21.6C17.8 22.9255 16.7255 24 15.4 24H9.4C8.07452 24 7 22.9255 7 21.6V13.08L9.88 8.66069V5.76ZM8.74 14.88L10.24 20.34H14.56L16 14.88C14.68 12.48 10.12 12.48 8.74 14.88Z" fill="currentColor"/></svg>',
          snacks:
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9.11447 4.27541L1.44179 9.97465L22.5547 7.47805L10.3392 4.05287C9.91737 3.93458 9.4619 4.01734 9.11447 4.27541Z" fill="currentColor"/><path d="M22.966 8.26645L1.23615 10.8287L1.30197 11.4596C1.37862 12.1943 2.07171 12.7243 2.83618 12.6327L21.7063 10.3719C22.358 10.2939 22.8604 9.78366 22.9041 9.1555L22.966 8.26645Z" fill="currentColor"/><path d="M1.23615 17.1601V16.0847C1.54428 16.1049 1.68154 16.0307 1.92163 15.8876C3.56679 18.3185 6.24018 17.4644 7.19986 15.5591C8.22808 16.0847 9.3934 15.9533 10.2845 15.1649C12.1949 15.4429 13.2822 15.4207 15.2886 14.5736C15.6999 15.0335 16.591 15.0992 17.4136 14.705C19.4015 16.1504 21.6636 15.0335 21.8007 13.6538C22.2699 13.8049 22.5369 13.8388 23.0345 13.5881L23.0662 15.0128C23.0871 15.9572 22.3584 16.7633 21.3802 16.8779L3.38842 18.9861C2.24453 19.1202 1.23615 18.2647 1.23615 17.1601Z" fill="currentColor"/><path d="M6.85691 12.9968C3.90933 13.391 2.3097 13.8393 1.09884 12.734C0.789597 13.2611 -0.0490787 13.6062 0.00225597 14.1794C0.00225597 15.2306 1.23594 15.4934 1.99018 15.0335C2.74442 14.5736 2.53857 16.0847 3.56679 16.4132C4.32771 16.6563 5.48615 16.6103 5.96598 15.8876C6.44582 15.1649 6.51396 14.8364 6.92545 14.705C7.33695 14.5736 7.54711 15.433 9.05045 14.9021C7.8167 14.4126 7.35678 13.9806 6.85691 12.9968Z" fill="currentColor"/><path d="M17.4137 11.7873C20.0584 11.4813 22.3011 11.359 23.3088 10.3688C23.6733 10.7495 23.9518 10.944 23.9942 11.42C24.0935 12.5369 22.8974 12.9311 22.0063 12.8654C21.1152 12.7997 21.2492 13.8782 20.3611 14.3108C19.7039 14.631 18.787 14.7582 18.2361 14.2451C17.6853 13.7321 17.8934 13.6538 17.6878 13.5881C17.4821 13.5224 17.345 13.9823 16.1798 14.1359C17.2305 13.5389 17.1102 12.6702 17.4137 11.7873Z" fill="currentColor"/><path d="M16.5224 11.8142L7.74824 12.8654C7.74824 12.8654 9.11921 15.1649 12.9579 14.4422C16.7966 13.7195 16.5224 11.8142 16.5224 11.8142Z" fill="currentColor"/></svg>',
          soups:
            '<svg viewBox="0 0 24 24"><path d="M7.96942 3H6.71297C6.65314 3.7622 7.25145 4.28995 7.25145 5.05215C7.25145 5.81435 6.65406 6.22474 6.71389 7.22152H7.97034C7.97034 6.40067 8.5079 5.99026 8.5079 5.05215C8.5079 4.11404 7.90959 3.76221 7.96942 3Z" fill="currentColor"/><path d="M12.2773 3H11.0208C10.961 3.7622 11.5593 4.28995 11.5593 5.05215C11.5593 5.81435 10.9619 6.22474 11.0217 7.22152H12.2782C12.2782 6.40067 12.8157 5.99026 12.8157 5.05215C12.8157 4.11404 12.2174 3.76221 12.2773 3Z" fill="currentColor"/><path d="M16.5851 3H15.3287C15.2688 3.7622 15.8671 4.28995 15.8671 5.05215C15.8671 5.81435 15.2697 6.22474 15.3296 7.22152H16.586C16.586 6.40067 17.1236 5.99026 17.1236 5.05215C17.1236 4.11404 16.5253 3.76221 16.5851 3Z" fill="currentColor"/><path d="M5.63177 18.9479V20.2964C5.63177 20.685 5.95322 21 6.34974 21H17.6578C18.0544 21 18.3758 20.685 18.3758 20.2964V18.9479C19.624 18.7476 21.6927 16.9264 22.7435 15.1368C22.9404 14.8015 23.1066 14.4665 23.2469 14.1401H0.725682C0.725678 14.14 0.725687 14.1401 0.725682 14.1401C1.57953 16.131 3.33461 18.2476 5.63177 18.9479Z" fill="currentColor"/><path d="M0.298917 12.8502H23.6943C23.9692 11.8308 24 11.063 24 10.9153C24 10.4463 23.8802 10.0358 23.3418 10.0358H0.605956C0.24698 10.0358 -0.0521098 10.329 0.00764496 10.7394C0.0114007 10.7652 0.0145725 10.8188 0.0191618 10.8963C0.0383963 11.2212 0.08253 11.9666 0.298917 12.8502Z" fill="currentColor"/></svg>',
          search:
            '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="10" r="7" stroke="currentColor" stroke-width="2"/><line x1="16.4132" y1="15.5534" x2="21.7072" y2="20.8474" stroke="currentColor" stroke-width="2"/></svg>',
          favourites:
            '<svg viewBox="0 0 24 24" fill="none"><path d="M23.853 8.97842C23.2002 12.883 20.3711 15.7217 12.806 21.7417C12.3852 22.0766 11.785 22.0871 11.3535 21.7658C3.52827 15.9389 0.638382 12.7714 0.0949103 8.70905C0.0324876 8.3464 0 7.97363 0 7.59335C0 7.56244 0.000232054 7.53155 0.000696163 7.50074C0.000464109 7.49236 0.000232054 7.484 0 7.47562H0.00104425C0.0643951 3.88853 3.01856 1 6.65347 1C8.84418 1 10.7876 2.04923 12 3.66825C13.2124 2.04923 15.1558 1 17.3465 1C20.9814 1 23.9356 3.88853 23.999 7.47562H24C23.9998 7.48211 23.9995 7.48861 23.9993 7.49509C23.9998 7.52779 24 7.56054 24 7.59335C24 8.06846 23.9493 8.53181 23.853 8.97842Z" fill="currentColor"/></svg>',
          hamburger:
            '<svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.8867 10.2647H2.28706C2.18075 10.2647 2.09259 10.191 2.08636 10.0863C2.00986 8.80066 1.9635 1.00001 12.1043 1C22.2472 0.999988 22.1688 8.80382 22.0873 10.0871C22.0807 10.1915 21.9927 10.2647 21.8867 10.2647ZM8.13913 5.7353C8.13913 6.19012 7.76539 6.55883 7.30435 6.55883C6.84332 6.55883 6.46958 6.19012 6.46958 5.7353C6.46958 5.28047 6.84332 4.91177 7.30435 4.91177C7.76539 4.91177 8.13913 5.28047 8.13913 5.7353ZM16.9043 6.55883C17.3653 6.55883 17.7391 6.19012 17.7391 5.7353C17.7391 5.28047 17.3653 4.91177 16.9043 4.91177C16.4433 4.91177 16.0695 5.28047 16.0695 5.7353C16.0695 6.19012 16.4433 6.55883 16.9043 6.55883ZM12.9391 4.5C12.9391 4.95482 12.5654 5.32353 12.1043 5.32353C11.6433 5.32353 11.2695 4.95482 11.2695 4.5C11.2695 4.04518 11.6433 3.67647 12.1043 3.67647C12.5654 3.67647 12.9391 4.04518 12.9391 4.5Z" fill="currentColor"/><path d="M15.7422 15.4508C15.0786 15.5486 14.443 15.3547 13.8362 14.9294C13.0467 14.3761 12.5195 14.2239 12.1201 14.2307C11.7235 14.2374 11.2621 14.4037 10.6059 14.8965C9.34191 15.8457 8.03041 15.3411 7.20287 14.966C7.01496 14.8808 6.85213 14.8027 6.69942 14.7295C6.45327 14.6114 6.23338 14.5059 5.97706 14.4038C5.59917 14.2531 5.2888 14.1765 5.00871 14.1765C4.69954 14.1765 4.52471 14.2364 4.39679 14.3013C4.25518 14.3731 4.14579 14.459 3.94387 14.6174C3.9088 14.6449 3.87094 14.6746 3.82963 14.7068C3.57344 14.9066 3.22181 15.167 2.73195 15.3472C2.23611 15.5296 1.66569 15.6069 0.970217 15.5586C0.395347 15.5186 -0.0378604 15.0265 0.00262118 14.4594C0.0431028 13.8923 0.541944 13.4649 1.11681 13.5048C1.56916 13.5363 1.83352 13.4804 2.0029 13.4181C2.17824 13.3536 2.32227 13.2579 2.53564 13.0915C2.56071 13.072 2.58805 13.0503 2.61754 13.0269C2.81202 12.8726 3.10001 12.6441 3.44238 12.4704C3.87533 12.2507 4.37875 12.1177 5.00871 12.1177C5.66775 12.1177 6.26188 12.2968 6.75891 12.4949C7.07233 12.6198 7.41647 12.784 7.70835 12.9232C7.84446 12.9881 7.96922 13.0476 8.07418 13.0952C8.88825 13.4642 9.12019 13.4248 9.34182 13.2583C10.1712 12.6355 11.0604 12.1895 12.0843 12.1722C13.1055 12.1549 14.0689 12.567 15.0449 13.251C15.3103 13.4371 15.4147 13.4181 15.4321 13.4149L15.4338 13.4146C15.5075 13.4037 15.6392 13.3529 15.943 13.1402C16.0034 13.0979 16.0706 13.0483 16.1446 12.9936C16.6914 12.5897 17.6089 11.9118 18.8869 11.9118C19.5805 11.9118 20.1313 12.0709 20.5956 12.3338C20.9753 12.5488 21.2765 12.8277 21.4785 13.0148C21.4946 13.0297 21.5101 13.0441 21.5249 13.0578C21.5332 13.0653 21.5412 13.0727 21.549 13.0798C21.7742 13.2857 21.9039 13.3844 22.0517 13.4462C22.1827 13.5011 22.4071 13.5582 22.8363 13.5091C23.4088 13.4437 23.9266 13.8485 23.993 14.4132C24.0593 14.978 23.649 15.4888 23.0765 15.5543C22.3579 15.6364 21.7593 15.5603 21.2366 15.3415C20.7308 15.1298 20.376 14.8144 20.1304 14.5899C20.1182 14.5787 20.1063 14.5678 20.0946 14.5571C20.084 14.5474 20.0736 14.5379 20.0635 14.5286C19.8365 14.3206 19.7142 14.2085 19.5567 14.1194C19.422 14.0431 19.2318 13.9706 18.8869 13.9706C18.3423 13.9706 18.0035 14.2123 17.4271 14.6234C17.3408 14.685 17.2492 14.7503 17.1507 14.8192C16.8233 15.0485 16.3431 15.3623 15.7422 15.4508Z" fill="currentColor"/><path d="M2.38763 17.2647L21.8994 17.2647C22.0049 17.2647 22.0833 17.3423 22.0924 17.446C22.1839 18.4879 22.1669 21.2385 20.3929 21.6391C18.8392 21.9899 17.001 21.9802 14.2365 21.9656C13.6381 21.9625 12.9959 21.9591 12.3042 21.9591C11.4981 21.9591 10.7191 21.9703 9.97658 21.981C7.13873 22.0218 4.8342 22.0549 3.58528 21.4257C2.07734 20.6659 1.91628 18.5267 2.20559 17.409C2.2281 17.3221 2.29666 17.2647 2.38763 17.2647Z" fill="currentColor"/></svg>',
          "my-recipes":
            '<svg viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 2.5585C3 1.14548 4.14548 0 5.5585 0H18.8627C19.8518 0 20.6537 0.801836 20.6537 1.79095V19.8284C20.6537 20.8175 19.8518 21.6193 18.8627 21.6193H11.4431V20.8518H18.9906C19.4145 20.8518 19.7582 20.5082 19.7582 20.0842V17.6537H5.49454C4.6114 17.6537 3.89548 18.3696 3.89548 19.2527C3.89548 20.1359 4.6114 20.8518 5.49454 20.8518H5.81435V21.6193H5.5585C4.14548 21.6193 3 20.4739 3 19.0608V2.5585ZM8.24493 12.4087H15.4087V13.5601C15.4087 13.8427 15.1796 14.0718 14.897 14.0718H8.75663C8.47403 14.0718 8.24493 13.8427 8.24493 13.5601V12.4087ZM14.2359 5.22403C14.4654 5.15443 14.7088 5.11701 14.961 5.11701C16.3387 5.11701 17.4555 6.23385 17.4555 7.61155C17.4555 8.8364 16.5728 9.85506 15.4087 10.066V11.6412H8.24493V10.066C7.08091 9.85506 6.19813 8.8364 6.19813 7.61155C6.19813 6.23385 7.31497 5.11701 8.69267 5.11701C8.98726 5.11701 9.26993 5.16807 9.5323 5.26183C9.86993 4.28414 10.7984 3.5819 11.8908 3.5819C12.9691 3.5819 13.8876 4.26609 14.2359 5.22403Z" fill="currentColor"/><path d="M5.43058 19.2527C5.43058 19.0055 5.63104 18.805 5.87832 18.805H18.1591C18.4064 18.805 18.6069 19.0055 18.6069 19.2527C18.6069 19.5 18.4064 19.7005 18.1591 19.7005H5.87832C5.63104 19.7005 5.43058 19.5 5.43058 19.2527Z" fill="currentColor"/><path d="M10.6115 20.4041H6.64587V23.7437C6.64587 23.9632 6.9042 24.0808 7.06975 23.9366L8.46067 22.7251C8.55699 22.6413 8.70042 22.6413 8.79674 22.7251L10.1877 23.9366C10.3532 24.0808 10.6115 23.9632 10.6115 23.7437V20.4041Z" fill="currentColor"/></svg>',
          notification:
            '<svg viewBox="0 0 24 24"><path d="M3 18H22V20.4H3V18Z" fill="currentColor"/><path d="M5.375 9.49091C5.375 5.63496 8.46831 2.50909 12.2841 2.50909H12.8239C16.6396 2.50909 19.733 5.63496 19.733 9.49091V18H5.375V9.49091Z" fill="currentColor"/><path d="M10.6648 1.85455C10.6648 0.830308 11.4864 0 12.5 0C13.5136 0 14.3352 0.830308 14.3352 1.85455V2.94545H10.6648V1.85455Z" fill="currentColor"/><path d="M14.875 21.6C14.875 22.9255 13.8117 24 12.5 24C11.1883 24 10.125 22.9255 10.125 21.6H14.875Z" fill="currentColor"/></svg>',
          print:
            '<svg viewBox="0 0 24 24" fill="none"><path d="M4.83019 3.34965C4.83019 2.05198 5.91141 1 7.24528 1H16.7547C18.0886 1 19.1698 2.05198 19.1698 3.34965V5.6993H4.83019V3.34965Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3.62264 6.87413C1.6219 6.87413 0 8.45208 0 10.3986V14.951C0 16.2487 1.08122 17.3007 2.41509 17.3007H4.83019V19.6504C4.83019 20.948 5.91141 22 7.24528 22H16.7547C18.0886 22 19.1698 20.948 19.1698 19.6504V17.3007H21.5849C22.9188 17.3007 24 16.2487 24 14.951V10.3986C24 8.45208 22.3781 6.87413 20.3774 6.87413H3.62264ZM7.24528 14.951H16.7547V19.6504H7.24528V14.951ZM19.1698 12.014C19.8367 12.014 20.3774 11.488 20.3774 10.8392C20.3774 10.1903 19.8367 9.66434 19.1698 9.66434C18.5029 9.66434 17.9623 10.1903 17.9623 10.8392C17.9623 11.488 18.5029 12.014 19.1698 12.014Z" fill="currentColor"/></svg>',
          ingredients:
            '<svg viewBox="0 0 24 24" fill="none"><path d="M4.8 13.4H1.2V9.8H4.8V13.4ZM9.6 9.8H6V13.4H9.6V9.8ZM7.2 5H3.6V8.6H7.2V5ZM19.2 12.2C14.7 12.2 12.336 13.7 10.8 14.6H0C0 17.252 2.148 19.4 4.8 19.4H6C7.2 19.4 8.304 18.956 9.144 18.2C10.872 16.736 12.816 15.488 15.06 15.032C16.332 14.78 17.736 14.6 19.2 14.6H24V12.2H19.2Z" fill="currentColor"/></svg>',
          list: '<svg viewBox="0 0 24 24" fill="none"><path d="M0 1.9726C0 0.883164 0.883164 0 1.9726 0H8.54795C9.63738 0 10.5205 0.883164 10.5205 1.9726V8.54795C10.5205 9.63738 9.63738 10.5205 8.54795 10.5205H1.9726C0.883164 10.5205 0 9.63738 0 8.54795V1.9726Z" fill="currentColor"/><path d="M13.4795 1.9726C13.4795 0.883164 14.3626 0 15.4521 0H22.0274C23.1168 0 24 0.883164 24 1.9726V8.54795C24 9.63738 23.1168 10.5205 22.0274 10.5205H15.4521C14.3626 10.5205 13.4795 9.63738 13.4795 8.54795V1.9726Z" fill="currentColor"/><path d="M0 15.4521C0 14.3626 0.883164 13.4795 1.9726 13.4795H8.54795C9.63738 13.4795 10.5205 14.3626 10.5205 15.4521V22.0274C10.5205 23.1168 9.63738 24 8.54795 24H1.9726C0.883164 24 0 23.1168 0 22.0274V15.4521Z" fill="currentColor"/><path d="M13.4795 18.7397C13.4795 15.8346 15.8346 13.4795 18.7397 13.4795C21.6449 13.4795 24 15.8346 24 18.7397C24 21.6449 21.6449 24 18.7397 24C15.8346 24 13.4795 21.6449 13.4795 18.7397Z" fill="currentColor"/></svg>',
          logout:
            '<svg viewBox="0 0 24 24" fill="none"><path d="M14.8784 5.91927V3.03963C14.8784 1.97938 14.0189 1.11987 12.9586 1.11987H3.03988C1.97962 1.11987 1.12012 1.97938 1.12012 3.03963V17.7578C1.12012 18.818 1.97962 19.6775 3.03988 19.6775H12.9586C14.0189 19.6775 14.8784 18.818 14.8784 17.7578V13.8383M13.9185 9.75878H20.1577" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M0 1.8215C0 0.620864 1.18819 -0.218297 2.31971 0.183209L8.64098 2.42624C9.40694 2.69803 9.91875 3.42272 9.91875 4.23547V22.0786C9.91875 23.4045 8.60658 24.3313 7.357 23.8879L1.27777 21.7307C0.511806 21.4589 0 20.7342 0 19.9215V1.8215Z" fill="currentColor"/><path d="M23.4461 9.1496C23.8351 9.52672 23.8351 10.1508 23.4461 10.5279L19.4258 14.4257C18.8169 15.016 17.7978 14.5845 17.7978 13.7365V5.941C17.7978 5.09298 18.8169 4.66155 19.4258 5.25184L23.4461 9.1496Z" fill="currentColor"/><path d="M0 1.51981C0 0.680441 0.680441 0 1.51981 0H3.1996V4.39944C3.1996 5.23881 2.51915 5.91925 1.67979 5.91925H1.51981C0.680441 5.91925 0 5.23881 0 4.39944V1.51981Z" fill="currentColor"/></svg>',
          pencil:
            '<svg viewBox="0 0 24 24" fill="none"><path d="M1.4012 18.1508L-0.00263553 23.7661C-0.0392546 23.9126 0.0934237 24.0453 0.2399 24.0087L5.85523 22.6048C5.87209 22.6006 5.88825 22.5943 5.90334 22.5859L1.42011 18.1027C1.41179 18.1178 1.40541 18.134 1.4012 18.1508Z" fill="currentColor"/><path d="M19.3917 9.10864L6.89884 21.6015L2.4045 17.1072L14.8974 4.6143L19.3917 9.10864Z" fill="currentColor"/><path d="M20.3817 8.11869L23.8863 4.61406C23.8863 4.61406 24.6354 3.86501 22.3882 1.61784C20.141 -0.629329 19.392 0.119727 19.392 0.119727L15.8874 3.62435L20.3817 8.11869Z" fill="currentColor"/></svg>',
          recipes:
            '<svg viewBox="0 0 20 24" fill="none"><path d="M4.2 24C3.04 24 2.05 23.59 1.23 22.77C0.41 21.95 0 20.96 0 19.8V4.2C0 3.04 0.41 2.05 1.23 1.23C2.05 0.41 3.04 0 4.2 0H16.8C17.46 0 18.0252 0.2348 18.4956 0.7044C18.966 1.174 19.2008 1.7392 19.2 2.4V17.43C19.2 17.59 19.1352 17.7352 19.0056 17.8656C18.876 17.996 18.6408 18.1408 18.3 18.3C18.02 18.44 17.8 18.64 17.64 18.9C17.48 19.16 17.4 19.46 17.4 19.8C17.4 20.14 17.48 20.4452 17.64 20.7156C17.8 20.986 18.02 21.1808 18.3 21.3C18.58 21.42 18.8 21.5852 18.96 21.7956C19.12 22.006 19.2 22.2308 19.2 22.47V22.77C19.2 23.11 19.0848 23.4 18.8544 23.64C18.624 23.88 18.3392 24 18 24H4.2ZM6 15.6C6.34 15.6 6.6252 15.4848 6.8556 15.2544C7.086 15.024 7.2008 14.7392 7.2 14.4V3.6C7.2 3.26 7.0848 2.9752 6.8544 2.7456C6.624 2.516 6.3392 2.4008 6 2.4C5.66 2.4 5.3752 2.5152 5.1456 2.7456C4.916 2.976 4.8008 3.2608 4.8 3.6V14.4C4.8 14.74 4.9152 15.0252 5.1456 15.2556C5.376 15.486 5.6608 15.6008 6 15.6ZM4.2 21.6H15.39C15.27 21.32 15.1752 21.0352 15.1056 20.7456C15.036 20.456 15.0008 20.1408 15 19.8C15 19.48 15.03 19.17 15.09 18.87C15.15 18.57 15.25 18.28 15.39 18H4.2C3.68 18 3.25 18.1752 2.91 18.5256C2.57 18.876 2.4 19.3008 2.4 19.8C2.4 20.32 2.57 20.75 2.91 21.09C3.25 21.43 3.68 21.6 4.2 21.6Z" fill="currentColor"/></svg>',
          reviews:
            '<svg viewBox="0 0 24 24" fill="none"><path d="M21.6 0H2.4C1.08 0 0 1.08 0 2.4V24L4.8 19.2H21.6C22.92 19.2 24 18.12 24 16.8V2.4C24 1.08 22.92 0 21.6 0ZM13.884 11.484L12 15.6L10.116 11.484L6 9.6L10.116 7.716L12 3.6L13.884 7.716L18 9.6L13.884 11.484Z" fill="currentColor"/></svg>',
          roles:
            '<svg viewBox="0 0 24 24" fill="none"><path d="M9.53264 9.02817C12.0257 9.02817 14.0467 7.00714 14.0467 4.51408C14.0467 2.02102 12.0257 0 9.53264 0C7.03958 0 5.01855 2.02102 5.01855 4.51408C5.01855 7.00714 7.03958 9.02817 9.53264 9.02817Z" fill="currentColor"/><path d="M10.8639 22.2093C10.6153 21.9634 10.453 21.6436 10.4015 21.2977C10.3499 20.9518 10.4119 20.5985 10.578 20.2908L10.9767 19.5385L10.1567 19.2902C9.82228 19.1855 9.53114 18.9746 9.32747 18.6895C9.1238 18.4044 9.01872 18.0606 9.02817 17.7103V16.168C9.02753 15.8192 9.1391 15.4795 9.34639 15.1991C9.55368 14.9187 9.84568 14.7123 10.1793 14.6106L10.9993 14.3623L10.6081 13.61C10.4468 13.3065 10.3855 12.9598 10.4328 12.6194C10.48 12.279 10.6336 11.9622 10.8714 11.7141C10.2926 11.6382 9.7097 11.598 9.12597 11.5937C7.40183 11.5531 5.68998 11.8935 4.11251 12.5905C2.53504 13.2876 1.13082 14.3241 0 15.6263V21.457C0 21.6565 0.0792649 21.8479 0.220357 21.989C0.36145 22.1301 0.552812 22.2093 0.752347 22.2093H10.8639Z" fill="currentColor"/><path d="M23.8491 15.9196L22.3444 15.4682C22.2401 15.0966 22.0937 14.7382 21.908 14.3998L22.6604 13.0005C22.6895 12.9485 22.7001 12.8883 22.6905 12.8295C22.681 12.7708 22.6518 12.717 22.6077 12.677L21.5168 11.5785C21.4748 11.5377 21.4212 11.5107 21.3634 11.5013C21.3055 11.4918 21.2461 11.5004 21.1933 11.5259L19.8015 12.2782C19.4589 12.0921 19.0984 11.9409 18.7256 11.8268L18.2667 10.3221C18.2465 10.2666 18.2096 10.2188 18.1611 10.1851C18.1126 10.1514 18.0549 10.1336 17.9958 10.134H16.4309C16.3723 10.1357 16.3155 10.1553 16.2684 10.1903C16.2213 10.2253 16.1861 10.274 16.1676 10.3297L15.7162 11.8343C15.3362 11.9449 14.9701 12.0989 14.6253 12.2933L13.2636 11.5409C13.2106 11.5128 13.1502 11.502 13.0908 11.5101C13.0314 11.5182 12.976 11.5448 12.9325 11.5861L11.8266 12.6695C11.783 12.7114 11.7543 12.7664 11.7448 12.8262C11.7353 12.8859 11.7455 12.9471 11.7739 13.0005L12.5263 14.3698C12.3247 14.7096 12.1607 15.0703 12.0372 15.4456L10.5325 15.9045C10.4756 15.921 10.4257 15.9557 10.3903 16.0032C10.355 16.0508 10.3362 16.1086 10.3369 16.1679V17.7102C10.3362 17.7694 10.355 17.8273 10.3903 17.8748C10.4257 17.9224 10.4756 17.957 10.5325 17.9735L12.0372 18.4324C12.15 18.8009 12.3013 19.1565 12.4886 19.4932L11.7363 20.9227C11.7079 20.9761 11.6977 21.0373 11.7072 21.097C11.7167 21.1568 11.7454 21.2118 11.789 21.2537L12.91 22.3446C12.9534 22.3859 13.0088 22.4125 13.0682 22.4206C13.1276 22.4287 13.188 22.4179 13.241 22.3898L14.6479 21.6374C14.9827 21.8175 15.3358 21.9613 15.7012 22.0663L16.1526 23.6086C16.1715 23.6655 16.2078 23.715 16.2565 23.7501C16.3051 23.7852 16.3635 23.8041 16.4234 23.8042H17.9657C18.0244 23.8025 18.0811 23.7829 18.1282 23.7479C18.1753 23.7129 18.2105 23.6643 18.2291 23.6086L18.6805 22.0663C19.0415 21.9626 19.3897 21.8187 19.7187 21.6374L21.1406 22.3898C21.1936 22.4179 21.254 22.4287 21.3134 22.4206C21.3728 22.4125 21.4282 22.3859 21.4717 22.3446L22.5701 21.2537C22.6114 21.2103 22.638 21.1549 22.6461 21.0955C22.6542 21.0361 22.6434 20.9756 22.6152 20.9227L21.8629 19.5083C22.0429 19.1787 22.1866 18.8306 22.2917 18.47L23.7964 18.0111C23.853 17.9929 23.9026 17.958 23.9389 17.911C23.9752 17.864 23.9963 17.8071 23.9996 17.7478V16.1904C24.0014 16.1359 23.9884 16.0819 23.9619 16.0342C23.9353 15.9865 23.8964 15.9468 23.8491 15.9196ZM17.2059 19.4707C16.7086 19.4722 16.222 19.326 15.8078 19.0508C15.3935 18.7756 15.0703 18.3837 14.8789 17.9247C14.6876 17.4656 14.6368 16.9602 14.7329 16.4722C14.829 15.9843 15.0677 15.5358 15.4188 15.1837C15.77 14.8315 16.2177 14.5914 16.7053 14.4938C17.193 14.3963 17.6986 14.4456 18.1582 14.6356C18.6178 14.8255 19.0107 15.1476 19.2872 15.561C19.5636 15.9744 19.7112 16.4605 19.7112 16.9578C19.7112 17.623 19.4475 18.261 18.9778 18.732C18.5082 19.2031 17.871 19.4687 17.2059 19.4707Z" fill="currentColor"/></svg>',
          users:
            '<svg viewBox="0 0 24 24" fill="none"><path d="M5.4 2C6.19565 2 6.95871 2.31767 7.52132 2.88313C8.08393 3.44859 8.4 4.21552 8.4 5.0152C8.4 5.81488 8.08393 6.58181 7.52132 7.14727C6.95871 7.71273 6.19565 8.03041 5.4 8.03041C4.60435 8.03041 3.84129 7.71273 3.27868 7.14727C2.71607 6.58181 2.4 5.81488 2.4 5.0152C2.4 4.21552 2.71607 3.44859 3.27868 2.88313C3.84129 2.31767 4.60435 2 5.4 2ZM19.2 2C19.9957 2 20.7587 2.31767 21.3213 2.88313C21.8839 3.44859 22.2 4.21552 22.2 5.0152C22.2 5.81488 21.8839 6.58181 21.3213 7.14727C20.7587 7.71273 19.9957 8.03041 19.2 8.03041C18.4044 8.03041 17.6413 7.71273 17.0787 7.14727C16.5161 6.58181 16.2 5.81488 16.2 5.0152C16.2 4.21552 16.5161 3.44859 17.0787 2.88313C17.6413 2.31767 18.4044 2 19.2 2ZM0 13.258C0 11.0381 1.7925 9.23649 4.00125 9.23649H5.6025C6.19875 9.23649 6.765 9.3684 7.275 9.60208C7.22625 9.87345 7.20375 10.1561 7.20375 10.4426C7.20375 11.8823 7.83375 13.1751 8.8275 14.0608H0.79875C0.36 14.0608 0 13.699 0 13.258ZM15.1988 14.0608H15.1725C16.17 13.1751 16.7963 11.8823 16.7963 10.4426C16.7963 10.1561 16.77 9.87722 16.725 9.60208C17.235 9.36463 17.8013 9.23649 18.3975 9.23649H19.9988C22.2075 9.23649 24 11.0381 24 13.258C24 13.7028 23.64 14.0608 23.2013 14.0608H15.1988ZM8.4 10.4426C8.4 9.48295 8.77929 8.56264 9.45442 7.88408C10.1295 7.20553 11.0452 6.82432 12 6.82432C12.9548 6.82432 13.8705 7.20553 14.5456 7.88408C15.2207 8.56264 15.6 9.48295 15.6 10.4426C15.6 11.4022 15.2207 12.3225 14.5456 13.0011C13.8705 13.6796 12.9548 14.0608 12 14.0608C11.0452 14.0608 10.1295 13.6796 9.45442 13.0011C8.77929 12.3225 8.4 11.4022 8.4 10.4426ZM4.8 20.291C4.8 17.517 7.03875 15.2669 9.79875 15.2669H14.2013C16.9613 15.2669 19.2 17.517 19.2 20.291C19.2 20.845 18.7538 21.2973 18.1988 21.2973H5.80125C5.25 21.2973 4.8 20.8488 4.8 20.291Z" fill="currentColor"/></svg>',
          admin:
            '<svg viewBox="0 0 24 24" fill="none"><path d="M17.1689 18.6104C17.7303 18.6104 18.2077 18.4141 18.6012 18.0216C18.9946 17.629 19.1909 17.1516 19.19 16.5893C19.19 16.0278 18.9937 15.5509 18.6012 15.1583C18.2086 14.7658 17.7312 14.5691 17.1689 14.5682C16.6075 14.5682 16.1305 14.7649 15.7379 15.1583C15.3454 15.5518 15.1487 16.0287 15.1478 16.5893C15.1478 17.1507 15.3445 17.6281 15.7379 18.0216C16.1314 18.415 16.6084 18.6113 17.1689 18.6104ZM17.1689 22.6526C17.8821 22.6526 18.5266 22.494 19.1024 22.177C19.6773 21.8599 20.1534 21.4318 20.5307 20.8929C20.0186 20.5839 19.4819 20.3508 18.9205 20.1936C18.3591 20.0364 17.7752 19.9578 17.1689 19.9578C16.5625 19.9578 15.9787 20.0364 15.4172 20.1936C14.8558 20.3508 14.3196 20.5843 13.8084 20.8942C14.1848 21.4332 14.6609 21.8608 15.2367 22.177C15.8107 22.494 16.4547 22.6526 17.1689 22.6526ZM17.1689 24C15.6679 24 14.3941 23.4772 13.3476 22.4316C12.3011 21.386 11.7784 20.1123 11.7792 18.6104C11.7792 17.1094 12.302 15.8356 13.3476 14.7891C14.3932 13.7426 15.667 13.2199 17.1689 13.2207C18.6699 13.2207 19.9436 13.7435 20.9901 14.7891C22.0366 15.8347 22.5594 17.1085 22.5585 18.6104C22.5585 20.1114 22.0357 21.3851 20.9901 22.4316C19.9445 23.4781 18.6708 24.0009 17.1689 24ZM10.4318 23.9488C7.72535 23.1448 5.47653 21.5051 3.68538 19.0294C1.89513 16.5529 1 13.7633 1 10.6607V4.88974C1 4.43162 1.1325 4.01707 1.39748 3.64608C1.66247 3.2751 2.00157 3.00561 2.41478 2.83764L9.67056 0.142825C9.93285 0.0476083 10.1866 0 10.4318 0C10.6771 0 10.9308 0.0476083 11.1931 0.142825L18.4489 2.83764C18.8621 3.00561 19.2012 3.2751 19.4662 3.64608C19.7312 4.01797 19.8637 4.43252 19.8637 4.88974V10.9948C19.4864 10.8412 19.0543 10.7245 18.5675 10.6445C18.0788 10.5655 17.6126 10.5259 17.1689 10.5259C14.9268 10.5259 13.0189 11.3128 11.4451 12.8866C9.87132 14.4604 9.08444 16.3683 9.08444 18.6104C9.08444 19.5356 9.24029 20.4393 9.55199 21.3214C9.86369 22.2017 10.329 23.0146 10.9479 23.7602L10.6892 23.8545C10.6084 23.8823 10.5226 23.9138 10.4318 23.9488Z" fill="currentColor"/></svg>',
          cooky:
            '<svg viewBox="0 0 24 24" fill="none"><path d="M21.2 21.6C21.2 22.2365 20.9471 22.847 20.4971 23.2971C20.047 23.7471 19.4365 24 18.8 24C18.1635 24 17.553 23.7471 17.1029 23.2971C16.6529 22.847 16.4 22.2365 16.4 21.6V15.6H14V3.6C14 2.64522 14.3793 1.72955 15.0544 1.05442C15.7295 0.379285 16.6452 0 17.6 0H21.2V21.6ZM4.4 12C3.76348 12 3.15303 11.7471 2.70294 11.2971C2.25286 10.847 2 10.2365 2 9.6V1.2C2 0.88174 2.12643 0.576516 2.35147 0.351472C2.57652 0.126428 2.88174 0 3.2 0C3.51826 0 3.82348 0.126428 4.04853 0.351472C4.27357 0.576516 4.4 0.88174 4.4 1.2V6H5.6V1.2C5.6 0.88174 5.72643 0.576516 5.95147 0.351472C6.17652 0.126428 6.48174 0 6.8 0C7.11826 0 7.42348 0.126428 7.64853 0.351472C7.87357 0.576516 8 0.88174 8 1.2V6H9.2V1.2C9.2 0.88174 9.32643 0.576516 9.55147 0.351472C9.77652 0.126428 10.0817 0 10.4 0C10.7183 0 11.0235 0.126428 11.2485 0.351472C11.4736 0.576516 11.6 0.88174 11.6 1.2V9.6C11.6 10.2365 11.3471 10.847 10.8971 11.2971C10.447 11.7471 9.83652 12 9.2 12V21.6C9.2 22.2365 8.94714 22.847 8.49706 23.2971C8.04697 23.7471 7.43652 24 6.8 24C6.16348 24 5.55303 23.7471 5.10294 23.2971C4.65286 22.847 4.4 22.2365 4.4 21.6V12Z" fill="currentColor"/></svg>',
        },
      },
    }),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "ABeeZee:400",
        display: {
          name: "Bebas Neue", // "Pilcrow Rounded", // "Supreme", // "Bevellier",
          weights: [400],
          provider: "fontshare",
        },
      },
    }),
    presetTheme({
      theme: {
        dark: darkTheme,
      },
    }),
  ],

  transformers: [transformerDirectives()],
  theme: lightTheme,
  content: {
    pipeline: {
      include: [/\.(vue|mdx?|html|stories.ts)($|\?)/],
    },
  },
  safelist: `i-cooky:breakfast
  i-cooky:lunch
  i-cooky:dinner
  i-cooky:snacks
  i-cooky:soups
  i-cooky:sauces
  i-cooky:my-recipes
  i-cooky:favourites
  i-cooky:recipes
  i-cooky:list
  i-cooky:ingredients
  i-cooky:reviews
  i-cooky:users
  i-cooky:roles`.split(/\s+/),
});
