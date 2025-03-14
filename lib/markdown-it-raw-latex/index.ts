// https://github.com/microsoft/vscode-markdown-it-katex
import type MarkdownIt from "markdown-it";
import type { StateBlock, StateInline } from "markdown-it";
import { escapeHTML } from "hexo-util";

function isWhitespace(char: string) {
  return /^\s$/u.test(char);
}
function isWordCharacterOrNumber(char: string) {
  return /^[\w\d]$/u.test(char);
}
// Test if potential opening or closing delimieter
// Assumes that there is a "$" at state.src[pos]
function isValidInlineDelim(state: StateInline, pos: number) {
  const prevChar = state.src[pos - 1];
  const char = state.src[pos];
  const nextChar = state.src[pos + 1];
  if (char !== "$") {
    return { can_open: false, can_close: false };
  }
  let canOpen = false;
  let canClose = false;
  if (
    prevChar !== "$" &&
    prevChar !== "\\" &&
    (prevChar === undefined ||
      isWhitespace(prevChar) ||
      !isWordCharacterOrNumber(prevChar))
  ) {
    canOpen = true;
  }
  if (
    nextChar !== "$" &&
    (nextChar == undefined ||
      isWhitespace(nextChar) ||
      !isWordCharacterOrNumber(nextChar))
  ) {
    canClose = true;
  }
  return { can_open: canOpen, can_close: canClose };
}
function isValidBlockDelim(state: StateBlock | StateInline, pos: number) {
  const prevChar = state.src[pos - 1];
  const char = state.src[pos];
  const nextChar = state.src[pos + 1];
  const nextCharPlus1 = state.src[pos + 2];
  if (
    char === "$" &&
    prevChar !== "$" &&
    prevChar !== "\\" &&
    nextChar === "$" &&
    nextCharPlus1 !== "$"
  ) {
    return { can_open: true, can_close: true };
  }
  return { can_open: false, can_close: false };
}

function inlineMath(state: StateInline, silent: boolean) {
  if (state.src[state.pos] !== "$") {
    return false;
  }
  const lastToken = state.tokens.at(-1);
  if (lastToken?.type === "html_inline") {
    // We may be inside of inside of inline html
    if (/^<\w+.+[^/]>$/.test(lastToken.content)) {
      return false;
    }
  }
  let res = isValidInlineDelim(state, state.pos);
  if (!res.can_open) {
    if (!silent) {
      state.pending += "$";
    }
    state.pos += 1;
    return true;
  }
  // First check for and bypass all properly escaped delimieters
  // This loop will assume that the first leading backtick can not
  // be the first character in state.src, which is known since
  // we have found an opening delimieter already.
  let start = state.pos + 1;
  let match = start;
  let pos;
  while ((match = state.src.indexOf("$", match)) !== -1) {
    // Found potential $, look for escapes, pos will point to
    // first non escape when complete
    pos = match - 1;
    while (state.src[pos] === "\\") {
      pos -= 1;
    }
    // Even number of escapes, potential closing delimiter found
    if ((match - pos) % 2 == 1) {
      break;
    }
    match += 1;
  }
  // No closing delimter found.  Consume $ and continue.
  if (match === -1) {
    if (!silent) {
      state.pending += "$";
    }
    state.pos = start;
    return true;
  }
  // Check if we have empty content, ie: $$.  Do not parse.
  if (match - start === 0) {
    if (!silent) {
      state.pending += "$$";
    }
    state.pos = start + 1;
    return true;
  }
  // Check for valid closing delimiter
  res = isValidInlineDelim(state, match);
  if (!res.can_close) {
    if (!silent) {
      state.pending += "$";
    }
    state.pos = start;
    return true;
  }
  if (!silent) {
    const token = state.push("math_inline", "math", 0);
    token.markup = "$";
    token.content = state.src.slice(start, match);
  }
  state.pos = match + 1;
  return true;
}
function blockMath(
  state: StateBlock,
  start: number,
  end: number,
  silent: boolean
) {
  var lastLine,
    next,
    lastPos,
    found = false,
    token,
    pos = state.bMarks[start] + state.tShift[start],
    max = state.eMarks[start];
  if (pos + 2 > max) {
    return false;
  }
  if (state.src.slice(pos, pos + 2) !== "$$") {
    return false;
  }
  pos += 2;
  let firstLine = state.src.slice(pos, max);
  if (silent) {
    return true;
  }
  if (firstLine.trim().slice(-2) === "$$") {
    // Single line expression
    firstLine = firstLine.trim().slice(0, -2);
    found = true;
  }
  for (next = start; !found; ) {
    next++;
    if (next >= end) {
      break;
    }
    pos = state.bMarks[next] + state.tShift[next];
    max = state.eMarks[next];
    if (pos < max && state.tShift[next] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      break;
    }
    if (state.src.slice(pos, max).trim().slice(-2) === "$$") {
      lastPos = state.src.slice(0, max).lastIndexOf("$$");
      lastLine = state.src.slice(pos, lastPos);
      found = true;
    } else if (state.src.slice(pos, max).trim().includes("$$")) {
      lastPos = state.src.slice(0, max).trim().indexOf("$$");
      lastLine = state.src.slice(pos, lastPos);
      found = true;
    }
  }
  state.line = next + 1;
  token = state.push("math_block", "math", 0);
  token.block = true;
  token.content =
    (firstLine && firstLine.trim() ? firstLine + "\n" : "") +
    state.getLines(start + 1, next, state.tShift[start], true) +
    (lastLine && lastLine.trim() ? lastLine : "");
  token.map = [start, state.line];
  token.markup = "$$";
  return true;
}
function inlineMathBlock(state: StateInline, silent: boolean) {
  var start, match, token, res, pos;
  if (state.src.slice(state.pos, state.pos + 2) !== "$$") {
    return false;
  }
  res = isValidBlockDelim(state, state.pos);
  if (!res.can_open) {
    if (!silent) {
      state.pending += "$$";
    }
    state.pos += 2;
    return true;
  }
  // First check for and bypass all properly escaped delimieters
  // This loop will assume that the first leading backtick can not
  // be the first character in state.src, which is known since
  // we have found an opening delimieter already.
  start = state.pos + 2;
  match = start;
  while ((match = state.src.indexOf("$$", match)) !== -1) {
    // Found potential $$, look for escapes, pos will point to
    // first non escape when complete
    pos = match - 1;
    while (state.src[pos] === "\\") {
      pos -= 1;
    }
    // Even number of escapes, potential closing delimiter found
    if ((match - pos) % 2 == 1) {
      break;
    }
    match += 2;
  }
  // No closing delimter found.  Consume $$ and continue.
  if (match === -1) {
    if (!silent) {
      state.pending += "$$";
    }
    state.pos = start;
    return true;
  }
  // Check if we have empty content, ie: $$$$.  Do not parse.
  if (match - start === 0) {
    if (!silent) {
      state.pending += "$$$$";
    }
    state.pos = start + 2;
    return true;
  }
  // Check for valid closing delimiter
  res = isValidBlockDelim(state, match);
  if (!res.can_close) {
    if (!silent) {
      state.pending += "$$";
    }
    state.pos = start;
    return true;
  }
  if (!silent) {
    token = state.push("math_block", "math", 0);
    token.block = true;
    token.markup = "$$";
    token.content = state.src.slice(start, match);
  }
  state.pos = match + 2;
  return true;
}
export = function math_plugin(md: MarkdownIt) {
  md.inline.ruler.after("escape", "math_inline", inlineMath);
  md.inline.ruler.after("escape", "math_inline_block", inlineMathBlock);
  md.block.ruler.after("blockquote", "math_block", blockMath, {
    alt: ["paragraph", "reference", "blockquote", "list"],
  });
  md.renderer.rules.math_inline = (tokens, idx) => {
    const content = tokens[idx].content;
    // To support expression like $`1+1 = 2`$, check if the the expression has leading and trailing "`".
    const hasBacktick =
      content.length > 2 &&
      content[0] === "`" &&
      content[content.length - 1] === "`";
    const sanitized = hasBacktick ? content.slice(1, -1) : content;
    return `$${escapeHTML(sanitized)}$`;
  };
  md.renderer.rules.math_inline_block = md.renderer.rules.math_block = (
    tokens,
    idx
  ) => `<p>$$${escapeHTML(tokens[idx].content)}$$</p>`;
};
