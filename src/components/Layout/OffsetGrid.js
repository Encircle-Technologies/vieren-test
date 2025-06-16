import styled from "styled-components"

export default styled.div`
  display: grid;
  ${({ bleed }) => {
    switch (true) {
      case !bleed.includes("right") && !bleed.includes("left"):
        return `
          > * {
            grid-column: 1 / 2;
          }

          grid-template-columns: 1fr;
        `
      case bleed.includes("right") && !bleed.includes("left"):
        return `
          > * {
            grid-column: 1 / 2;
          }
          grid-template-columns: minmax(359px, 23fr) 1fr;

          @media (min-width: 800px) {
            grid-template-columns: 23fr 1fr;
          }
        `
      case bleed.includes("left") && !bleed.includes("right"):
        return `
            > * {
              grid-column: 2 / 3;
            }
            grid-template-columns: 1fr minmax(359px, 23fr);

            @media (min-width: 800px) {
              grid-template-columns: 1fr 23fr;
            }
          `
      default:
        return `
        > * {
          grid-column: 2 / 3;
        }

        grid-template-columns: 1fr minmax(343px, 22fr) 1fr;
        @media (min-width: 800px) {
          grid-template-columns: 1fr 22fr 1fr;
        }
        `
    }
  }}
  /* ${({ sectionMargin }) => {
    switch (sectionMargin) {
      case "left":
        return `
        > * {
          grid-column: 2 / 3;
        }

        grid-template-columns: 1fr minmax(359px, 23fr);
        @media (min-width: 800px) {
          grid-template-columns: 1fr 23fr;
        }
        `
      case "right":
        return `
        > * {
          grid-column: 1 / 2;
        }

        grid-template-columns: minmax(359px, 23fr) 1fr;
        @media (min-width: 800px) {
          grid-template-columns: 23fr 1fr;
        }
  
        `
      default:
        return `
        > * {
          grid-column: 2 / 3;
        }

        grid-template-columns: 1fr minmax(343px, 22fr) 1fr;
        @media (min-width: 800px) {
          grid-template-columns: 1fr 22fr 1fr;
        }
        `
    }
  }} */

/* padding: ${({ sectionPadding }) => sectionPadding.mobile || "0"}; */
`
