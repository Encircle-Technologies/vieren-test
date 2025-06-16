import React from "react"
import { graphql } from "gatsby"
import Container from "./Container"
import Grid from "../../Layout/Grid"
import List from "./List"
import Item from "./Item"
import Link from "./Link"

type Props = {
  data: any
}

export default function AnchorNavigation({ data }: Props) {
  return (
    <Container>
      <Grid>
        <List>
          {data?.anchors.map(anchor => (
            <Item>
              <Link href={`#${anchor.tag}`}>{anchor.label}</Link>
            </Item>
          ))}
        </List>
      </Grid>
    </Container>
  )
}

export const fragments = graphql`
  fragment AnchorNavigationFields on WpTemplate_2021Default_Acf2021_Layouts_AnchorNavigation {
    anchors {
      label
      tag
    }
  }
`
