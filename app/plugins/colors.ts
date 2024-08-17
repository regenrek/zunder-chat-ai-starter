import { computed, watch } from "vue";
import { get, hexToRgb } from "../utils";
import { defineNuxtPlugin, useAppConfig, useNuxtApp, useHead } from "#imports";
import colors from "#tailwind-config/theme/colors";

export default defineNuxtPlugin({
  enforce: "post",
  setup() {
    const appConfig = useAppConfig();
    const nuxtApp = useNuxtApp();

    const root = computed(() => {
      const primary: Record<string, string> | undefined = get(
        colors,
        appConfig.ui.primary
      );
      const gray: Record<string, string> | undefined = get(
        colors,
        appConfig.ui.gray
      );

      if (!primary) {
        console.warn(
          `[@nuxt/ui] Primary color '${appConfig.ui.primary}' not found in Tailwind config`
        );
      }
      if (!gray) {
        console.warn(
          `[@nuxt/ui] Gray color '${appConfig.ui.gray}' not found in Tailwind config`
        );
      }

      return `:root {
${Object.entries(primary || colors.green)
  .map(([key, value]) => `--color-primary-${key}: ${hexToRgb(value)};`)
  .join("\n")}
--color-primary-DEFAULT: var(--color-primary-500);

${Object.entries(gray || colors.cool)
  .map(([key, value]) => `--color-gray-${key}: ${hexToRgb(value)};`)
  .join("\n")}
}

.dark {
  --color-primary-DEFAULT: var(--color-primary-400);
}
`;
    });

    if (import.meta.client) {
      watch(root, () => {
        window.localStorage.setItem("nuxt-ui-root", root.value);
      });

      appConfig.ui.primary =
        window.localStorage.getItem("nuxt-ui-primary") || appConfig.ui.primary;
      appConfig.ui.gray =
        window.localStorage.getItem("nuxt-ui-gray") || appConfig.ui.gray;
    }

    const headData: any = {
      style: [
        {
          innerHTML: () => root.value,
          tagPriority: -2,
          id: "nuxt-ui-colors",
        },
      ],
    };

    if (import.meta.server) {
      headData.script = [
        {
          innerHTML: `
          if (localStorage.getItem('nuxt-ui-root')) {
            document.querySelector('style#nuxt-ui-colors').innerHTML = localStorage.getItem('nuxt-ui-root')
          }
        `,
          type: "text/javascript",
          tagPriority: -1,
        },
      ];
    }

    // SPA mode
    if (
      import.meta.client &&
      nuxtApp.isHydrating &&
      !nuxtApp.payload.serverRendered
    ) {
      const style = document.createElement("style");
      style.innerHTML = root.value;
      style.setAttribute("data-nuxt-ui-colors", "");
      document.head.appendChild(style);

      headData.script = [
        {
          innerHTML:
            "document.head.removeChild(document.querySelector('[data-nuxt-ui-colors]'))",
        },
      ];
    }

    useHead(headData);
  },
});
