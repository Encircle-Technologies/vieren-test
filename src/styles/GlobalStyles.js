import { createGlobalStyle } from "styled-components"

export default createGlobalStyle`

:root {
  --black: #000000;
  --gray: #4d4d4d;
  --white: #ffffff;
  --red: #e02020;
}

body {
  ${process.env.IS_GATSBY_PREVIEW && `background-color: var(--white);`}
}

body.noscroll {
  overflow: hidden;
}

input, textarea {
  appearance: none;
  border-radius: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

p > a {
  font-weight: 700;
}

p > a.shortcode-styled-link {
  font-weight: inherit;
  text-decoration: underline;
  /* position: relative; */
}
/* .shortcode-styled-link::after {
  border-bottom-color: inherit;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  content: "";
  display: block;

  position: absolute;
  left: 0;
  bottom: -4px;

  width: 0;
  transition: width 0.5s ease-in;
}

.shortcode-styled-link:focus {
  outline: none;
}

.shortcode-styled-link:hover::after,
.shortcode-styled-link:active::after,
.shortcode-styled-link:focus::after {
  width: 100%;
} */
.no-scroll {
    overflow: hidden;
    height: 100%;
}
`
