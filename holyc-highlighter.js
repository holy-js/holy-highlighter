const syntax_colors = {
  black: "#141414",
  red: "#ad4747",
  blue: "#3a75b0",
  purple: "#5c3a9c",
  orange: "#9c5717",
  green: "green",
};

const is_token = (str) => {
  return str === "if" ? true : false;
};

const element = (str, color) => {
  const el = document.createElement("span");
  el.appendChild(document.createTextNode(str));
  el.style.color = color;
  return el;
};

const is_digit = (val) => {
  return !isNaN(val);
};

const is_alpha = (val) => {
  if (is_digit(val)) return;
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

    if (is_digit(str[i])) {
      let number = "";
      while (is_digit(str[i])) {
        number += str[i++];
      }
      i--;
      elements.push(element(number, syntax_colors.blue));
    }

    if (is_alpha(str[i])) {
      console.log("aqui");
      let text = "";
      while (is_alpha(str[i])) {
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

    if (str[i] === '"') {
      let string = "";
      while (1) {
        string += str[i++];
        if (str[i] === '"' || i === str.length) break;
      }
      if (str[i] === '"') string += '"';
      elements.push(element(string, syntax_colors.orange));
    }

    if (
      str[i] !== "\n" &&
      str[i] !== " " &&
      str[i] !== '"' &&
      !is_alpha(str[i]) &&
      !is_digit(str[i]) &&
      str[i]
    ) {
      elements.push(element(str[i], "black"));
    }
  }
  return elements;
};

const highlight = (e) => {
  const hl = document.getElementById("hl");
  hl.innerHTML = "";

  const elements = lex(e);

  for (let i = 0; i < elements.length; ++i) {
    hl.appendChild(elements[i]);
  }

  hl.scrollTop = hl.scrollHeight;
};
