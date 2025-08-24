// https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/containers.ts
import type MarkdownIt from "markdown-it";
import type { RenderRule } from "markdown-it/lib/renderer.mjs";
import container from "markdown-it-container";

type ContainerArgs = [typeof container, string, { render: RenderRule }];

function createContainer(
  klass: string,
  defaultTitle: string,
  md: MarkdownIt
): ContainerArgs {
  return [
    container,
    klass,
    {
      render(tokens, idx, _options, env) {
        const token = tokens[idx];
        const info = token.info.trim().slice(klass.length).trim();
        const attrs = md.renderer.renderAttrs(token);
        if (token.nesting === 1) {
          const title = md.renderInline(info || defaultTitle, {
            references: env.references,
          });
          if (klass === "details")
            return `<details class="${klass} custom-block"${attrs}><summary>${title}</summary>\n`;
          return `<div class="${klass} custom-block"${attrs}><p class="custom-block-title">${title}</p>\n`;
        } else return klass === "details" ? `</details>\n` : `</div>\n`;
      },
    },
  ];
}

export = (md: MarkdownIt, options, containerOptions?) => {
  return md.use(...createContainer("tip", containerOptions?.tipLabel || "TIP", md))
    .use(...createContainer("info", containerOptions?.infoLabel || "INFO", md))
    .use(
      ...createContainer(
        "warning",
        containerOptions?.warningLabel || "WARNING",
        md
      )
    )
    .use(
      ...createContainer(
        "danger",
        containerOptions?.dangerLabel || "DANGER",
        md
      )
    )
    .use(
      ...createContainer(
        "important",
        containerOptions?.importantLabel || "IMPORTANT",
        md
      )
    )
    .use(
      ...createContainer(
        "details",
        containerOptions?.detailsLabel || "Details",
        md
      )
    );
};
