const syntax_colors = {
  black: "black",
  red: "red",
  blue: "#0000aa",
  lightblue: "#00aaaa",
  purple: "#5555ff",
  orange: "#aa5500",
  lightorange: "#aa5500",
  green: "#00aa00",
};

const is_blue_keyword = (str) => {
  return str === "if" ||
    str === "for" ||
    str === "else" ||
    str === "return" ||
    str === "I0" ||
    str === "U0" ||
    str === "I8" ||
    str === "U8" ||
    str === "I16" ||
    str === "I32" ||
    str === "F64"
    ? true
    : false;
};

const is_lightblue_keyword = (str) => {
  return str === "TRUE" || str === "FALSE" ? true : false;
};

const is_purple_keyword = (str) => {
  return str === "I64" || str === "U64" || str === "U32" || str === "U16"
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
  return /^[A-Z0-9_]$/i.test(val);
};

const is_next = (str, i, expected) => {
  for (; i < str.length; ++i) {
    if (str[i] === " " || str[i] === "\n") continue;
    return str[i] === expected ? true : false;
  }
  return false;
};

const jshlchl_lex = (str) => {
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
      if (is_blue_keyword(text)) {
        color = syntax_colors.blue;
      } else if (is_lightblue_keyword(text)) {
        color = syntax_colors.lightblue;
      } else if (is_purple_keyword(text)) {
        color = syntax_colors.purple;
      } else if (is_next(str, i, "(")) {
        color = syntax_colors.black;
      } else {
        color = syntax_colors.black;
      }
      i--;
      elements.push(element(text, color));
    }

    if (str[i] === '"' || str[i] === "'") {
      let string = "";
      let strsymbol = str[i];
      while (1) {
        if (str[i] === "\\") {
          elements.push(element(string, syntax_colors.orange));
          elements.push(element(str[i] + str[++i], syntax_colors.lightorange));
          string = "";
          i++;
          if (str[i] === strsymbol || i === str.length) break;
        }
        string += str[i++];
        if (str[i] === strsymbol || i === str.length) break;
      }
      if (str[i] === '"') string += '"';
      else if (str[i] === "'") string += "'";
      elements.push(element(string, syntax_colors.orange));
    }

    if (
      str[i] !== "\n" &&
      str[i] !== " " &&
      str[i] !== '"' &&
      str[i] !== "'" &&
      !lex_is_alpha(str[i]) &&
      !lex_is_digit(str[i]) &&
      str[i]
    ) {
      if (str[i] === "/" && str[i + 1] === "/") {
        i--;
        continue;
      }
      elements.push(element(str[i], "black"));
    }
  }
  return elements;
};

const set_scroll = () => {
  const stdin = document.getElementById("stdin");
  const hl = document.getElementById("hl");
  hl.scrollLeft = stdin.scrollLeft;
  hl.scrollTop = stdin.scrollTop;
};

const highlight = (e) => {
  const hl = document.getElementById("hl");
  hl.innerHTML = "";

  const elements = jshlchl_lex(e);

  for (let i = 0; i < elements.length; ++i) {
    hl.appendChild(elements[i]);
  }

  // fix break line if it is in last element
  if (elements[elements.length - 1].isEqualNode(document.createElement("br"))) {
    hl.appendChild(document.createElement("br"));
  }

  set_scroll();
};
