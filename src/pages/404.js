import React from "react"
import Head from "../components/Layout/Head"
import Grid from "../components/Layout/Grid"
import { H2 } from "../components/Elements/H2"

export default function NotFoundPage() {
  return (
    <>
      <Head pageTitle="Page Not Found" />
      <div
        style={{
          backgroundColor: "var(--black)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <Grid>
          <H2 style={{ color: "var(--white)" }}>404: Page Not Found</H2>
        </Grid>
      </div>
    </>
  )
}
