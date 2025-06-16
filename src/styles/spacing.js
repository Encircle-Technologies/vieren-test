import { css } from "styled-components"

export const margin = css`
  // Set mobile defaults
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 0;
  margin-right: 0;

  // Old template margin parsing, evalutes to an empty string if the value is not present
  ${({ margin }) =>
    margin?.mobile
      ? `
    ${
      margin.mobile.top.value
        ? `margin-top : ${margin.mobile.top.value}${margin.mobile.top.unit};`
        : ``
    }
    ${
      margin.mobile.right.value
        ? `margin-right : ${margin.mobile.right.value}${margin.mobile.right.unit};`
        : ``
    }
    ${
      margin.mobile.bottom.value
        ? `margin-bottom : ${margin.mobile.bottom.value}${margin.mobile.bottom.unit};`
        : ``
    }
    ${
      margin.mobile.left.value
        ? `margin-left : ${margin.mobile.left.value}${margin.mobile.left.unit};`
        : ``
    }
  `
      : ``}

  // New template margin parsing, evaluates to an empty string if the value is not present
  ${({ $margin }) =>
    Array.isArray($margin?.mobile)
      ? $margin?.mobile?.map(row =>
          row?.direction?.map(
            dir => dir && `margin-${dir}: ${row.value}${row.unit}; `
          )
        )
      : ""}


  @media (min-width: 800px) {
    // Set desktop defaults
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;

    // Old template margin parsing, evalutes to an empty string if the value is not present
  ${({ margin }) =>
    margin?.desktop
      ? `
    ${
      margin.desktop.top.value
        ? `margin-top : ${margin.desktop.top.value}${margin.desktop.top.unit};`
        : ``
    }
    ${
      margin.desktop.right.value
        ? `margin-right : ${margin.desktop.right.value}${margin.desktop.right.unit};`
        : ``
    }
    ${
      margin.desktop.bottom.value
        ? `margin-bottom : ${margin.desktop.bottom.value}${margin.desktop.bottom.unit};`
        : ``
    }
    ${
      margin.desktop.left.value
        ? `margin-left : ${margin.desktop.left.value}${margin.desktop.left.unit};`
        : ``
    }
  `
      : ``}

    ${({ $margin }) =>
      Array.isArray($margin?.desktop)
        ? $margin?.desktop?.map(row =>
            row?.direction?.map(
              dir => dir && `margin-${dir}: ${row.value}${row.unit};`
            )
          )
        : ""}
  }
`

export const padding = css`
  // Set mobile defaults
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 0;
  padding-right: 0;

  // Old template padding parsing, evalutes to an empty string if the value is not present
  ${({ padding }) =>
    padding?.mobile
      ? `
    ${
      padding.mobile.top.value
        ? `padding-top : ${padding.mobile.top.value}${padding.mobile.top.unit};`
        : ``
    }
    ${
      padding.mobile.right.value
        ? `padding-right : ${padding.mobile.right.value}${padding.mobile.right.unit};`
        : ``
    }
    ${
      padding.mobile.bottom.value
        ? `padding-bottom : ${padding.mobile.bottom.value}${padding.mobile.bottom.unit};`
        : ``
    }
    ${
      padding.mobile.left.value
        ? `padding-left : ${padding.mobile.left.value}${padding.mobile.left.unit};`
        : ``
    }
  `
      : ``}

  // New template padding parsing, evaluates to an empty string if the value is not present
  ${({ $padding }) =>
    Array.isArray($padding?.mobile)
      ? $padding?.mobile?.map(row =>
          row?.direction?.map(
            dir => dir && `padding-${dir}: ${row.value}${row.unit};`
          )
        )
      : ""}


  @media (min-width: 800px) {
    // Set desktop defaults
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;

    // Old template padding parsing, evalutes to an empty string if the value is not present
  ${({ padding }) =>
    padding?.desktop
      ? `
    ${
      padding.desktop.top.value
        ? `padding-top : ${padding.desktop.top.value}${padding.desktop.top.unit};`
        : ``
    }
    ${
      padding.desktop.right.value
        ? `padding-right : ${padding.desktop.right.value}${padding.desktop.right.unit};`
        : ``
    }
    ${
      padding.desktop.bottom.value
        ? `padding-bottom : ${padding.desktop.bottom.value}${padding.desktop.bottom.unit};`
        : ``
    }
    ${
      padding.desktop.left.value
        ? `padding-left : ${padding.desktop.left.value}${padding.desktop.left.unit};`
        : ``
    }
  `
      : ``}

    ${({ $padding }) =>
      Array.isArray($padding?.desktop)
        ? $padding?.desktop?.map(row =>
            row?.direction?.map(
              dir => dir && `padding-${dir}: ${row.value}${row.unit}; `
            )
          )
        : ""}
  }
`
