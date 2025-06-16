import styled from "styled-components"

export const Column = styled.div`
  background-color: ${process.env.NODE_ENV === "development"
    ? "rgba(30,144,255, 0.5)"
    : "transparent"};
  box-sizing: border-box;
  height: 100%;
  width: 100%;
`

export const Container = styled.div`
  --page-margin: calc(1 / 30 * 100vw);

  --grid-all: 1 / 31; /* 100% */

  --grid-left-half: 1 / 16; /* left 50% */
  --grid-right-half: 16 / 31; /* right 50% */

  --grid-left-third: 1 / 11; /* left 33% */
  --grid-center-third: 11 / 21; /* center 33% */
  --grid-right-third: 21 / 31; /* right 33% */

  --grid-left-twothird: 1 / 21; /* left 67% */
  --grid-right-twothird: 11 / 31; /* right 67% */

  --grid-left-fourty: 1 / 13; /* left 40% */
  --grid-right-sixty: 13 / 31; /* right 60% */

  --grid-right-fourty: 1 / 19; /* right 40% */
  --grid-left-sixty: 19 / 31; /* left 60% */

  /* position: ${({ kind }) => (kind === "colour" ? "relative" : "absolute")};
  top: 0;
  left: 0;
  height: auto;
  width: 100%; */

  display: ${({ collapseTo }) => (collapseTo === "2xrows" ? "grid" : "flex")};
  flex-direction: ${({ stackingOrder }) =>
    stackingOrder === "normal" ? "column" : "column-reverse"};

  // detect non-iOS devices and apply gap property on flexbox
  /* @supports not (-webkit-touch-callout: none) { */
    @media (max-width: 799px) {
      column-gap: 0;
      row-gap: 0;
      ${({
        collapseTo,
        gap,
        sectionMargin,
        $sectionMargin,
        sectionPadding,
        $sectionPadding,
      }) =>
        collapseTo === "2xrows"
          ? `
              column-gap: ${gap || 0};
              row-gap: ${gap || 0};
            `
          : collapseTo === "rows" && sectionMargin && sectionPadding
          ? `
              column-gap: ${
                gap
                  ? `min(${gap}, calc(1 / 30 * (100vw${
                      sectionMargin.mobile.left.value
                        ? ` - ${sectionMargin.mobile.left.value}${
                            sectionMargin.mobile.left.unit === "%"
                              ? "vw"
                              : sectionMargin.mobile.left.unit
                          }`
                        : ""
                    }${
                      sectionMargin.mobile.right.value
                        ? ` - ${sectionMargin.mobile.right.value}${
                            sectionMargin.mobile.right.unit === "%"
                              ? "vw"
                              : sectionMargin.mobile.right.unit
                          }`
                        : ""
                    }${
                      sectionPadding.mobile.left.value
                        ? ` - ${sectionPadding.mobile.left.value}${
                            sectionPadding.mobile.left.unit === "%"
                              ? "vw"
                              : sectionPadding.mobile.left.unit
                          }`
                        : ""
                    }${
                      sectionPadding.mobile.right.value
                        ? ` - ${sectionPadding.mobile.right.value}${
                            sectionPadding.mobile.right.unit === "%"
                              ? "vw"
                              : sectionPadding.mobile.right.unit
                          }`
                        : ""
                    })))`
                  : `0px`
              };
          row-gap: ${gap ? `${gap}` : 0};
        `
          : collapseTo === "rows" && $sectionMargin && $sectionPadding
          ? `
              column-gap: ${
                gap
                  ? `min(${gap}, calc(1 / 30 * (100vw${
                      Array.isArray($sectionMargin.mobile)
                        ? $sectionMargin.mobile.reduce((acc, curr) => {
                            if (
                              curr.direction.includes("left") &&
                              curr.direction.includes("right")
                            ) {
                              return acc.concat(
                                ` - (2 * ${curr.value}${
                                  curr.unit === "%" ? "vw" : curr.unit
                                })`
                              )
                            } else if (
                              (curr.direction.includes("left") &&
                                !curr.direction.includes("right")) ||
                              (curr.direction.includes("right") &&
                                !curr.direction.includes("left"))
                            ) {
                              return acc.concat(
                                ` - ${curr.value}${
                                  curr.unit === "%" ? "vw" : curr.unit
                                }`
                              )
                            } else {
                              return acc
                            }
                          }, "")
                        : ""
                    }${
                      Array.isArray($sectionPadding.mobile)
                        ? $sectionPadding.mobile.reduce((acc, curr) => {
                            if (
                              curr.direction.includes("left") &&
                              curr.direction.includes("right")
                            ) {
                              return acc.concat(
                                ` - (2 * ${curr.value}${
                                  curr.unit === "%" ? "vw" : curr.unit
                                })`
                              )
                            } else if (
                              (curr.direction.includes("left") &&
                                !curr.direction.includes("right")) ||
                              (curr.direction.includes("right") &&
                                !curr.direction.includes("left"))
                            ) {
                              return acc.concat(
                                ` - ${curr.value}${
                                  curr.unit === "%" ? "vw" : curr.unit
                                }`
                              )
                            } else {
                              return acc
                            }
                          }, "")
                        : ""
                    })))`
                  : `0px`
              };
              row-gap: ${gap ? `${gap}` : 0};
        `
          : ""} // parent template string literal
    } // media query
  /* } // supports webkit touch callout */

  & > ${Column} {
    padding: ${({ bleed }) =>
      `0 ${bleed?.includes("right") ? "var(--page-margin)" : "0"} 0 ${
        bleed?.includes("left") ? "var(--page-margin)" : "0"
      }`};
  }

  // detect iOS devices only under 800px, where flex + gap are used
  /* @supports (-webkit-touch-callout: none) {
    @media (max-width: 799px) {
      ${({ collapseTo, gap, stackingOrder }) =>
        collapseTo === "2xrows"
          ? `
          column-gap: ${gap || 0};
          row-gap: ${gap || 0};
        `
          : `
          & > ${Column} {
            margin-bottom: ${gap ? `${gap}` : 0};
          }

          & > ${Column}:last-child {
            margin-bottom: 0;
          }
      `}
    }
  } */

  ${({ template, bleed, stackingOrder }) => {
    const leftPadding = bleed?.includes("left") ? "var(--page-margin)" : 0
    const rightPadding = bleed?.includes("right") ? "var(--page-margin)" : 0

    switch (template) {
      case "1fr":
        return `
          @media (min-width: 800px) {
            grid-template-columns: repeat(30, 1fr);

            & > ${Column} {
              grid-column: var(--grid-all);
            }
          }
        `
      case "2fr 1fr":
        return `
          & > ${Column}:nth-child(2n+0) ${Content} {
            max-width: 67%;
            margin: 0 0 0 auto;
          }
              
          @media (min-width: 800px) {
            grid-template-columns: repeat(30, 1fr);
            
            & > ${Column}:nth-child(odd) {
              grid-column: var(--grid-left-twothird);
              padding: 0 0 0 ${leftPadding};
            }
            & > ${Column}:nth-child(even) {
              grid-column: var(--grid-right-third);
              padding: 0 ${rightPadding} 0 0;
            }
            & > ${Column}:nth-child(2n+0) ${Content} {
              max-width: 100%;
              margin: 0;
            }
          }
        `
      // return `
      //   ${
      //     stackingOrder === "normal"
      //       ? `& > ${Column}:nth-child(even) ${Content} {
      //     max-width: 67%;
      //     margin: 0 0 0 auto;
      //   }`
      //       : `& > ${Column}:nth-child(odd) ${Content} {
      //     max-width: 67%;
      //     margin: 0 0 0 auto;
      //   }`
      //   }
      //   @media (min-width: 800px) {
      //     & > ${Column}:nth-child(odd) {
      //       grid-column: var(--grid-left-twothird);
      //       padding: 0 0 0 ${leftPadding};
      //     }
      //     & > ${Column}:nth-child(even) {
      //         grid-column: var(--grid-right-third);
      //         padding: 0 ${rightPadding} 0 0;
      //     }
      //     ${
      //       stackingOrder === "normal"
      //         ? `& > ${Column}:nth-child(even) ${Content} {
      //     max-width: 100%;
      //     margin: 0;
      //     }`
      //         : `& > ${Column}:nth-child(odd) ${Content} {
      //     max-width: 100%;
      //     margin: 0;
      //     }`
      //     }
      //   }
      // `
      case "3fr 2fr":
        return `
          @media (min-width: 800px) {
            grid-template-columns: repeat(30, 1fr);

            & > ${Column}:nth-child(odd) {
              grid-column: var(--grid-left-sixty);
              padding: 0 0 0 ${leftPadding};
            }
            & > ${Column}:nth-child(even) {
              grid-column: var(--grid-right-fourty);
              padding: 0 ${rightPadding} 0 0;
            }
          }
        `
      case "1fr 1fr":
        return `
          @media (min-width: 800px) {
            grid-template-columns: repeat(30, 1fr);

            & > ${Column}:nth-child(odd) {
              grid-column: var(--grid-left-half);
              padding: 0 0 0 ${leftPadding};
            }
            & > ${Column}:nth-child(even) {
              grid-column: var(--grid-right-half);
              padding: 0 ${rightPadding} 0 0;
            }
          }
        `
      case "2fr 3fr":
        return `
          @media (min-width: 800px) {
            grid-template-columns: repeat(30, 1fr);

            & > ${Column}:nth-child(odd) {
            grid-column: var(--grid-left-fourty);
            padding: 0 0 0 ${leftPadding};
            }
            & > ${Column}:nth-child(even) {
              grid-column: var(--grid-right-sixty);
              padding: 0 ${rightPadding} 0 0;
            }
          }
        `
      case "1fr 2fr":
        return `
          & > ${Column}:nth-child(2n+1) ${Content} {
            max-width: 67%;
          }
          
          @media (min-width: 800px) {
            grid-template-columns: repeat(30, 1fr);

            & > ${Column}:nth-child(odd) {
              grid-column: var(--grid-left-third);
              padding: 0 0 0 ${leftPadding};
            }
            & > ${Column}:nth-child(even) {
              grid-column: var(--grid-right-twothird);
              padding: 0 ${rightPadding} 0 0;
            }

            & > ${Column}:nth-child(2n+1) ${Content} {
              max-width: 100%;
            }
            
          }
        `
      case "1fr 1fr 1fr":
        return `
          @media (min-width: 800px) {
            grid-template-columns: repeat(30, 1fr);

            & > ${Column}:nth-child(3n+1) {
              grid-column: var(--grid-left-third);
              padding: 0 0 0 ${leftPadding};
            }
            & > ${Column}:nth-child(3n+2) {
              grid-column: var(--grid-center-third);
              padding: 0 calc(${rightPadding} / 2) 0 calc(${leftPadding} / 2);
            }
            & > ${Column}:nth-child(3n+3) {
              grid-column: var(--grid-right-third);
              padding: 0 ${rightPadding} 0 0;
            }
          }
        `
      case "1fr 1fr 1fr 1fr":
        return `

          & > ${Column}:nth-child(2n+1) {
            grid-column: var(--grid-left-half);
          }
          & > ${Column}:nth-child(2n+2) {
            grid-column: var(--grid-right-half);
          }

          @media (min-width: 800px) {
            ${
              leftPadding && rightPadding
                ? `
              grid-template-columns: repeat(30, 1fr);

              --grid-left-fourth: 2 / 9; /* left 25% */
              --grid-left-center-fourth: 9 / 16; /* left-center 25% */
              --grid-right-center-fourth: 16 / 23; /* right-center 25% */
              --grid-right-fourth: 23 / 30; /* right 25% */
            `
                : leftPadding && !rightPadding
                ? `
              grid-template-columns: repeat(29, 1fr);

              --grid-left-fourth: 2 / 9; /* left 25% */
              --grid-left-center-fourth: 9 / 16; /* left-center 25% */
              --grid-right-center-fourth: 16 / 23; /* right-center 25% */
              --grid-right-fourth: 23 / 30; /* right 25% */
            `
                : !leftPadding && rightPadding
                ? `
              grid-template-columns: repeat(29, 1fr);

              --grid-left-fourth: 1 / 8; /* left 25% */
              --grid-left-center-fourth: 8 / 15; /* left-center 25% */
              --grid-right-center-fourth: 15 / 22; /* right-center 25% */
              --grid-right-fourth: 22 / 29; /* right 25% */
                `
                : `
              grid-template-columns: repeat(28, 1fr);

              --grid-left-fourth: 1 / 8; /* left 25% */
              --grid-left-center-fourth: 8 / 15; /* left-center 25% */
              --grid-right-center-fourth: 15 / 22; /* right-center 25% */
              --grid-right-fourth: 22 / 29; /* right 25% */
            `
            }

            & > ${Column}:nth-child(4n+1) {
              grid-column: var(--grid-left-fourth);
              padding: 0 0 0 0;
            }
            & > ${Column}:nth-child(4n+2) {
              grid-column: var(--grid-left-center-fourth);
              padding: 0 0 0 0;
            }
            & > ${Column}:nth-child(4n+3) {
              grid-column: var(--grid-right-center-fourth);
              padding: 0 0 0 0;
            }
            & > ${Column}:nth-child(4n+4) {
              grid-column: var(--grid-right-fourth);
              padding: 0 0 0 0;
            }
          }
        `
      case "1fr 1fr 1fr 1fr 1fr":
        return `
          @media (min-width: 800px) {
            grid-template-columns: repeat(32, 1fr);
            
            ${leftPadding &&
              rightPadding &&
              `
              /* When both bleeds are present, start 1 column later, end 1 column earlier */
              --grid-left-fifth: 2 / 8;
              --grid-left-center-fifth: 8 / 14;
              --grid-center-fifth: 14 / 20;
              --grid-right-center-fifth: 20 / 26;
              --grid-right-fifth: 26 / 32;
            `}
           

            & > ${Column}:nth-child(4n+1) {
              grid-column: var(--grid-left-fifth);
              padding: 0;
            }
            & > ${Column}:nth-child(4n+2) {
              grid-column: var(--grid-left-center-fifth);
              padding: 0;
            }
            & > ${Column}:nth-child(4n+3) {
              grid-column: var(--grid-center-fifth);
              padding: 0;
            }
            & > ${Column}:nth-child(4n+4) {
              grid-column: var(--grid-right-center-fifth);
              padding: 0;
            }
            & > ${Column}:nth-child(4n+5) {
              grid-column: var(--grid-right-fifth);
              padding: 0;
            }
          }
        `
      default:
        return ``
    }
  }}

  @media (min-width: 800px) {
    display: grid;
    /* grid-template-columns: ${({ template }) =>
      template === "1fr 1fr 1fr 1fr" || template === "1fr 1fr 1fr 1fr 1fr"
        ? "repeat(32, 1fr)"
        : "repeat(30, 1fr)"}; */
    /* column-gap: ${({ gap }) =>
      gap ? `min(${gap}, calc(1/30*100vw))` : `0px`}; */

      
      /**
        This section for console log testing
      */

     /* ${({ $sectionPadding }) => {
       console.log(
         `${
           Array.isArray($sectionPadding.desktop)
             ? $sectionPadding.desktop.reduce((acc, curr) => {
                 if (
                   curr.direction.includes("left") &&
                   curr.direction.includes("right")
                 ) {
                   return acc.concat(` - (2 * ${curr.value}${curr.unit})`)
                 } else if (
                   (curr.direction.includes("left") &&
                     !curr.direction.includes("right")) ||
                   (curr.direction.includes("right") &&
                     !curr.direction.include("left"))
                 ) {
                   return acc.concat(` - ${curr.value}${curr.unit}`)
                 } else {
                   return acc
                 }
               }, "[$sectionPadding.desktop]")
             : ""
         }`
       )
       console.log(
         `${
           Array.isArray($sectionPadding.mobile)
             ? $sectionPadding.mobile.reduce((acc, curr) => {
                 if (
                   curr.direction.includes("left") &&
                   curr.direction.includes("right")
                 ) {
                   return acc.concat(` - (2 * ${curr.value}${curr.unit})`)
                 } else if (
                   (curr.direction.includes("left") &&
                     !curr.direction.includes("right")) ||
                   (curr.direction.includes("right") &&
                     !curr.direction.include("left"))
                 ) {
                   return acc.concat(` - ${curr.value}${curr.unit}`)
                 } else {
                   return acc
                 }
               }, "[$sectionPadding.mobile]")
             : ""
         }`
       )
     }} */



    column-gap: ${({
      gap,
      sectionMargin,
      $sectionMargin,
      sectionPadding,
      $sectionPadding,
    }) =>
      gap && sectionMargin && sectionPadding
        ? `min(${gap}, calc(1 / 30 * (100vw${
            sectionMargin.desktop.left.value
              ? ` - ${sectionMargin.desktop.left.value}${sectionMargin.desktop.left.unit}`
              : ""
          }${
            sectionMargin.desktop.right.value
              ? ` - ${sectionMargin.desktop.right.value}${sectionMargin.desktop.right.unit}`
              : ""
          }${
            sectionPadding.desktop.left.value
              ? ` - ${sectionPadding.desktop.left.value}${sectionPadding.desktop.left.unit}`
              : ""
          }${
            sectionPadding.desktop.right.value
              ? ` - ${sectionPadding.desktop.right.value}${sectionPadding.desktop.right.unit}`
              : ""
          })))`
        : gap && $sectionMargin && $sectionPadding
        ? `min(${gap}, calc(1 / 30 * (100vw${
            Array.isArray($sectionMargin.desktop)
              ? $sectionMargin.desktop.reduce((acc, curr) => {
                  if (
                    curr.direction.includes("left") &&
                    curr.direction.includes("right")
                  ) {
                    return acc.concat(
                      ` - (2 * ${curr.value}${
                        curr.unit === "%" ? "vw" : curr.unit
                      })`
                    )
                  } else if (
                    (curr.direction.includes("left") &&
                      !curr.direction.includes("right")) ||
                    (curr.direction.includes("right") &&
                      !curr.direction.includes("left"))
                  ) {
                    return acc.concat(
                      ` - ${curr.value}${curr.unit === "%" ? "vw" : curr.unit}`
                    )
                  } else {
                    return acc
                  }
                }, "")
              : ""
          }${
            Array.isArray($sectionPadding.desktop)
              ? $sectionPadding.desktop.reduce((acc, curr) => {
                  if (
                    curr.direction.includes("left") &&
                    curr.direction.includes("right")
                  ) {
                    return acc.concat(
                      ` - (2 * ${curr.value}${
                        curr.unit === "%" ? "vw" : curr.unit
                      })`
                    )
                  } else if (
                    (curr.direction.includes("left") &&
                      !curr.direction.includes("right")) ||
                    (curr.direction.includes("right") &&
                      !curr.direction.includes("left"))
                  ) {
                    return acc.concat(
                      ` - ${curr.value}${curr.unit === "%" ? "vw" : curr.unit}`
                    )
                  } else {
                    return acc
                  }
                }, "")
              : ""
          })))` // end string template literal for gap && $sectionMargin && $sectionPadding
        : "0px"}; // end column gap string template literal;
    row-gap: ${({ gap }) => gap || `0px`};
  } // media query
` // Container CSS

export const Content = styled.div`
  background-color: ${process.env.NODE_ENV === "development"
    ? "rgba(255,140,105,0.5)"
    : "transparent"};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: ${({ options }) =>
    options.alignContent ? options.alignContent : `flex-start`};
  height: 100%;
  width: 100%;
`
