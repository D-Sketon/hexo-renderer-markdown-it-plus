import { describe, it, expect } from "vitest";
import { unescapeHTML } from "hexo-util";
const render = require("../dist/lib/renderer");

describe("renderer", () => {
  it("plugin - katex - one line", () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          plugins: [
            {
              plugin: {
                name: "@vscode/markdown-it-katex",
                enable: true,
              },
            },
          ],
        },
      },
    };
    const data = {
      text: "$a^2 + b^2 = c^2$",
    };
    const result = render.call(Hexo, data);
    expect(result)
      .toBe(`<p><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>a</mi><mn>2</mn></msup><mo>+</mo><msup><mi>b</mi><mn>2</mn></msup><mo>=</mo><msup><mi>c</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">a^2 + b^2 = c^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8974em;vertical-align:-0.0833em;"></span><span class="mord"><span class="mord mathnormal">a</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8141em;"></span><span class="mord"><span class="mord mathnormal">b</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.8141em;"></span><span class="mord"><span class="mord mathnormal">c</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8141em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></p>
`);
    Hexo.config.markdown_it_plus.plugins[0].plugin.enable = false;
    const result2 = render.call(Hexo, data);
    expect(result2).toBe("<p>$a^2 + b^2 = c^2$</p>\n");
  });

  it("plugin - katex - multiple lines", () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          plugins: [
            {
              plugin: {
                name: "@vscode/markdown-it-katex",
                enable: true,
              },
            },
          ],
        },
      },
    };
    const data = {
      text: `$$
a^2 + b^2 = c^2
$$`,
    };
    const result = render.call(Hexo, data);
    expect(result)
      .toBe(`<p class="katex-block"><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msup><mi>a</mi><mn>2</mn></msup><mo>+</mo><msup><mi>b</mi><mn>2</mn></msup><mo>=</mo><msup><mi>c</mi><mn>2</mn></msup></mrow><annotation encoding="application/x-tex">a^2 + b^2 = c^2
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9474em;vertical-align:-0.0833em;"></span><span class="mord"><span class="mord mathnormal">a</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8641em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8641em;"></span><span class="mord"><span class="mord mathnormal">b</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8641em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.8641em;"></span><span class="mord"><span class="mord mathnormal">c</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8641em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span></span></span></span></span></span></span></span></span></p>
`);
    Hexo.config.markdown_it_plus.plugins[0].plugin.enable = false;
    const result2 = render.call(Hexo, data);
    expect(result2).toBe(`<p>$$<br />
a^2 + b^2 = c^2<br />
$$</p>
`);
  });

  it('plugin - raw latex - math block', () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          rawLaTeX: true,
        },
      },
    };
    let data = {
      text: "$$a^2 + b^2 = c^2$$",
    };
    let result = render.call(Hexo, data);
    expect(unescapeHTML(result)).toBe("<p>$$a^2 + b^2 = c^2\n$$</p>");

    data = {
      text: `$$
a^2 + b^2 = c^2
$$`,
    };
    result = render.call(Hexo, data);
    expect(unescapeHTML(result)).toBe("<p>$$a^2 + b^2 = c^2\n$$</p>");
    
    data = {
      text: String.raw`$$\int \frac{x^3}{(1+x^2)^{3/2}}  $$`
    }
    result = render.call(Hexo, data);
    expect(unescapeHTML(result)).toBe(String.raw`<p>$$\int \frac{x^3}{(1+x^2)^{3/2}}  
$$</p>`);

    data = {
      text: String.raw`$$
\begin{align}
&\underset{\boldsymbol{w}}{\min}\sum_{i=1}^N{\left( \boldsymbol{p}_i\boldsymbol{w} \right) ^2 },\,\, s.t. \,\left\| \boldsymbol{w} \right\| _2=1 \notag
\\
\Rightarrow &\underset{\boldsymbol{w}}{\min}\,\,\boldsymbol{w}^T\boldsymbol{P}^T\boldsymbol{Pw},\,\, s.t.\, \boldsymbol{w}^T\boldsymbol{w}=1
\end{align}
$$`
    }
    result = render.call(Hexo, data);
    expect(unescapeHTML(result)).toBe(String.raw`<p>$$\begin{align}
&\underset{\boldsymbol{w}}{\min}\sum_{i=1}^N{\left( \boldsymbol{p}_i\boldsymbol{w} \right) ^2 },\,\, s.t. \,\left\| \boldsymbol{w} \right\| _2=1 \notag
\\
\Rightarrow &\underset{\boldsymbol{w}}{\min}\,\,\boldsymbol{w}^T\boldsymbol{P}^T\boldsymbol{Pw},\,\, s.t.\, \boldsymbol{w}^T\boldsymbol{w}=1
\end{align}
$$</p>`);
  });

  it('plugin - raw latex - inline math', () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          rawLaTeX: true,
        },
      },
    };
    let data = {
      text: "$a^2+b^2=c^2$",
    };
    let result = render.call(Hexo, data);
    expect(unescapeHTML(result)).toBe("<p>$a^2+b^2=c^2$</p>\n");

    data = {
      text: `$
a^2+b^2=c^2
$`,
    };

    result = render.call(Hexo, data);
    expect(unescapeHTML(result)).toBe("<p>$\na^2+b^2=c^2\n$</p>\n");

    data = {
      text: String.raw`$\int \frac{x^3}{(1+x^2)^{3/2}}  $`
    }
    result = render.call(Hexo, data);
    expect(unescapeHTML(result)).toBe(String.raw`<p>$\int \frac{x^3}{(1+x^2)^{3/2}}  $</p>
`);
  });

  it('plugin - raw latex - math in code block', () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          rawLaTeX: true,
        },
      },
    };
    const data = {
      text: "```latex\n$$a^2 + b^2 = c^2$$\n```",
    };
    const result = render.call(Hexo, data);
    expect(unescapeHTML(result)).toBe("<pre><code class=\"latex\">$$a^2 + b^2 = c^2$$\n</code></pre>\n");
  });

  it('plugin - emoji - ":smile:"', () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          plugins: [
            {
              plugin: {
                name: "markdown-it-emoji",
                enable: true,
              },
            },
          ],
        },
      },
    };
    const data = {
      text: ":smile:",
    };
    const result = render.call(Hexo, data);
    expect(result).toBe("<p>😄</p>\n");

    Hexo.config.markdown_it_plus.plugins[0].plugin.enable = false;
    const result2 = render.call(Hexo, data);
    expect(result2).toBe("<p>:smile:</p>\n");
  });

  it('plugin - sub - "H~2~O"', () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          plugins: [
            {
              plugin: {
                name: "markdown-it-sub",
                enable: true,
              },
            },
          ],
        },
      },
    };
    const data = {
      text: "H~2~O",
    };
    const result = render.call(Hexo, data);
    expect(result).toBe("<p>H<sub>2</sub>O</p>\n");

    Hexo.config.markdown_it_plus.plugins[0].plugin.enable = false;
    const result2 = render.call(Hexo, data);
    expect(result2).toBe("<p>H~2~O</p>\n");
  });

  it('plugin - sup - "2^10^"', () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          plugins: [
            {
              plugin: {
                name: "markdown-it-sup",
                enable: true,
              },
            },
          ],
        },
      },
    };
    const data = {
      text: "2^10^",
    };
    const result = render.call(Hexo, data);
    expect(result).toBe("<p>2<sup>10</sup></p>\n");

    Hexo.config.markdown_it_plus.plugins[0].plugin.enable = false;
    const result2 = render.call(Hexo, data);
    expect(result2).toBe("<p>2^10^</p>\n");
  });

  it('plugin - deflist - "term: definition"', () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          plugins: [
            {
              plugin: {
                name: "markdown-it-deflist",
                enable: true,
              },
            },
          ],
        },
      },
    };
    const data = {
      text: "term\n: definition",
    };
    const result = render.call(Hexo, data);
    expect(result).toBe("<dl>\n<dt>term</dt>\n<dd>definition</dd>\n</dl>\n");

    Hexo.config.markdown_it_plus.plugins[0].plugin.enable = false;
    const result2 = render.call(Hexo, data);
    expect(result2).toBe("<p>term<br />\n: definition</p>\n");
  });

  it('plugin - abbr - "*HTML* is an abbreviation for Hyper Text Markup Language"', () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          plugins: [
            {
              plugin: {
                name: "markdown-it-abbr",
                enable: true,
              },
            },
          ],
        },
      },
    };
    const data = {
      text: `*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium
The HTML specification
is maintained by the W3C.`,
    };
    const result = render.call(Hexo, data);
    expect(result).toBe(
      `<p>The <abbr title="Hyper Text Markup Language">HTML</abbr> specification<br />
is maintained by the <abbr title="World Wide Web Consortium">W3C</abbr>.</p>\n`
    );

    Hexo.config.markdown_it_plus.plugins[0].plugin.enable = false;
    const result2 = render.call(Hexo, data);
    expect(result2).toBe(
      `<p>*[HTML]: Hyper Text Markup Language<br />
*[W3C]:  World Wide Web Consortium<br />
The HTML specification<br />
is maintained by the W3C.</p>\n`
    );
  });

  it('plugin - footnote - "Footnote[^1]"', () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          plugins: [
            {
              plugin: {
                name: "markdown-it-footnote",
                enable: true,
              },
            },
          ],
        },
      },
    };
    const data = {
      text:`Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.

    Subsequent paragraphs are indented to show that they
belong to the previous footnote.`,
    };
    const result = render.call(Hexo, data);
    expect(result).toBe(
      `<p>Here is a footnote reference,<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> and another.<sup class="footnote-ref"><a href="#fn2" id="fnref2">[2]</a></sup></p>
<hr class="footnotes-sep" />
<section class="footnotes">
<ol class="footnotes-list">
<li id="fn1" class="footnote-item"><p>Here is the footnote. <a href="#fnref1" class="footnote-backref">↩︎</a></p>
</li>
<li id="fn2" class="footnote-item"><p>Here’s one with multiple blocks.</p>
<p>Subsequent paragraphs are indented to show that they<br />
belong to the previous footnote. <a href="#fnref2" class="footnote-backref">↩︎</a></p>
</li>
</ol>
</section>\n`);

  });

  it('plugin - ins - "++inserted++"', () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          plugins: [
            {
              plugin: {
                name: "markdown-it-ins",
                enable: true,
              },
            },
          ],
        },
      },
    };
    const data = {
      text: "++inserted++",
    };
    const result = render.call(Hexo, data);
    expect(result).toBe("<p><ins>inserted</ins></p>\n");

    Hexo.config.markdown_it_plus.plugins[0].plugin.enable = false;
    const result2 = render.call(Hexo, data);
    expect(result2).toBe("<p>++inserted++</p>\n");
  });

  it('plugin - mark - "==marked=="', () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          plugins: [
            {
              plugin: {
                name: "markdown-it-mark",
                enable: true,
              },
            },
          ],
        },
      },
    };
    const data = {
      text: "==marked==",
    };
    const result = render.call(Hexo, data);
    expect(result).toBe("<p><mark>marked</mark></p>\n");

    Hexo.config.markdown_it_plus.plugins[0].plugin.enable = false;
    const result2 = render.call(Hexo, data);
    expect(result2).toBe("<p>==marked==</p>\n");
  });

  it('plugin - toc - "[TOC]"', () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          plugins: [
            {
              plugin: {
                name: "markdown-it-toc-and-anchor",
                enable: true,
                options: {
                  tocFirstLevel: 1
                }
              },
            },
          ],
        },
      },
    };
    const data = {
      text: `test
@[toc]
# Heading`,
    };
    const result = render.call(Hexo, data);
    expect(result).toBe(`<p>test<br />
<ul class="markdownIt-TOC">
<li><a href="#heading">Heading</a></li>
</ul>
</p>
<h1 id="heading"><a class="markdownIt-Anchor" href="#heading"></a> Heading</h1>\n`);
  });

  it('plugin - container - warning', () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          plugins: [
            {
              plugin: {
                name: "markdown-it-container",
                enable: true,
              },
            },
          ],
        },
      },
    };
    const data = {
      text: "::: warning\n*here be dragons*\n:::",
    };
    const result = render.call(Hexo, data);
    expect(result).toBe("<blockquote class=\"warning custom-block\"><p class=\"custom-block-title\">WARNING</p>\n<p><em>here be dragons</em></p>\n</blockquote>\n");

    data.text = "::: warning custom-title\n*here be dragons*\n:::";
    const result3 = render.call(Hexo, data);
    expect(result3).toBe("<blockquote class=\"warning custom-block\"><p class=\"custom-block-title\">custom-title</p>\n<p><em>here be dragons</em></p>\n</blockquote>\n");

    Hexo.config.markdown_it_plus.plugins[0].plugin.enable = false;
    const result2 = render.call(Hexo, data);
    expect(result2).toBe("<p>::: warning custom-title<br />\n<em>here be dragons</em><br />\n:::</p>\n");
  });

  it('plugin - container - details', () => {
    const Hexo = {
      config: {
        markdown_it_plus: {
          plugins: [
            {
              plugin: {
                name: "markdown-it-container",
                enable: true,
              },
            },
          ],
        },
      },
    };
    const data = {
      text: "::: details\n*here be dragons*\n:::",
    };
    const result = render.call(Hexo, data);
    expect(result).toBe("<details class=\"details custom-block\"><summary>Details</summary><div class=\"detail-content\">\n<p><em>here be dragons</em></p>\n</div></details>\n");

    data.text = "::: details custom-title\n*here be dragons*\n:::";
    const result3 = render.call(Hexo, data);
    expect(result3).toBe("<details class=\"details custom-block\"><summary>custom-title</summary><div class=\"detail-content\">\n<p><em>here be dragons</em></p>\n</div></details>\n");

    Hexo.config.markdown_it_plus.plugins[0].plugin.enable = false;
    const result2 = render.call(Hexo, data);
    expect(result2).toBe("<p>::: details custom-title<br />\n<em>here be dragons</em><br />\n:::</p>\n");
  });
});
