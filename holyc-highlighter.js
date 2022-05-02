const syntax_colors = {
  black: "#141414",
  red: "#ad4747",
  blue: "#3a75b0",
  purple: "#5c3a9c",
  orange: "#9c5717",
  green: "green",
};

const is_token = (str) => {
  return str === "if" ||
    str === "for" ||
    str === "I0" ||
    str === "U0" ||
    str === "I8" ||
    str === "U8" ||
    str === "I16" ||
    str === "U16" ||
    str === "I32" ||
    str === "U32" ||
    str === "I64" ||
    str === "U64" ||
    str === "F64"
    ? true
    : false;
};

const element = (str, color) => {
  const el = document.createElement("span");
  el.appendChild(document.createTextNode(str));
  el.style.color = color;
  return el;
};

const lex_is_digit = (val) => {
  return !isNaN(val);
};

const lex_is_alpha = (val) => {
  return /^[A-Z0-9]$/i.test(val);
};

const is_next = (str, i, expected) => {
  for (; i < str.length; ++i) {
    if (str[i] === " " || str[i] === "\n") continue;
    return str[i] === expected ? true : false;
  }
  return false;
};

const lex = (str) => {
  let elements = [];
  for (let i = 0; i < str.length; ++i) {
    if (str[i] === "/" && str[i + 1] === "/") {
      let comment = "";
      while (1) {
        comment += str[i++];
        if (str[i] === "\n" || i === str.length) break;
      }
      elements.push(element(comment, syntax_colors.green));
    }

    if (str[i] === "\n") {
      while (str[i++] === "\n") {
        elements.push(document.createElement("br"));
      }
      i--;
    }

    if (str[i] === " ") {
      let space = "";
      while (str[i++] === " ") {
        space += " ";
      }
      i--;
      elements.push(element(space, ""));
    }

    if (lex_is_digit(str[i])) {
      let number = "";
      while (lex_is_digit(str[i])) {
        number += str[i++];
      }
      i--;
      elements.push(element(number, syntax_colors.blue));
    }

    if (lex_is_alpha(str[i]) && !lex_is_digit(str[i])) {
      let text = "";
      while (lex_is_alpha(str[i])) {
        text += str[i++];
      }

      let color;
      if (is_token(text)) {
        color = syntax_colors.red;
      } else if (is_next(str, i, "(")) {
        color = syntax_colors.purple;
      } else {
        color = syntax_colors.black;
      }
      i--;
      elements.push(element(text, color));
    }

    if (str[i] === '"' || str[i] === "'") {
      let string = "";
      while (1) {
        string += str[i++];
        if (str[i] === '"' || str[i] === "'" || i === str.length) break;
      }
      if (str[i] === '"') string += '"';
      else if (str[i] === '\'') string += '\'';
      elements.push(element(string, syntax_colors.orange));
    }

    if (
      str[i] !== "\n" &&
      str[i] !== " " &&
      str[i] !== '"' &&
      str[i] !== '\'' &&
      !lex_is_alpha(str[i]) &&
      !lex_is_digit(str[i]) &&
      str[i]
    ) {
      elements.push(element(str[i], "black"));
    }
  }
  return elements;
};

const set_scroll = () => {
  const code = document.getElementById("code");
  const hl = document.getElementById("hl");
  const codeLeft = code.scrollLeft;
  const codeTop = code.scrollTop;
  hl.scrollLeft = codeLeft;
  hl.scrollTop = codeTop;
};

const highlight = (e) => {
  const hl = document.getElementById("hl");
  hl.innerHTML = "";

  const elements = lex(e);

  for (let i = 0; i < elements.length; ++i) {
    hl.appendChild(elements[i]);
  }

  set_scroll();
};
