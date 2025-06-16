import React from "react"
import algoliasearch from "algoliasearch/lite"
import { InstantSearch, Index, Configure } from "react-instantsearch-dom"
import Autocomplete from "./Autocomplete"
import Results from "./Results"
import ResultInfo from "./ResultInfo"
import { TextResults, ProductResults } from "./Hits"

const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID,
  process.env.GATSBY_ALGOLIA_SEARCH_KEY
)

export default function Bar() {
  return (
    <InstantSearch
      indexName={process.env.GATSBY_ALGOLIA_PRODUCTS_INDEX}
      searchClient={searchClient}
    >
      <Autocomplete />
      <Results>
        <Index indexName={process.env.GATSBY_ALGOLIA_PRODUCTS_INDEX}>
          <Configure restrictSearchableAttributes={["title"]} hitsPerPage={3} />
          <ResultInfo title="Products" />
          <ProductResults />
        </Index>
        <Index indexName={process.env.GATSBY_ALGOLIA_PAGES_INDEX}>
          <Configure
            restrictSearchableAttributes={["title", "text"]}
            hitsPerPage="4"
          />
          <ResultInfo title="Pages" />
          <TextResults />
        </Index>
        <Index indexName={process.env.GATSBY_ALGOLIA_POSTS_INDEX}>
          <Configure restrictSearchableAttributes={["title", "text"]} />
          <ResultInfo title="Stories" />
          <TextResults last />
        </Index>
      </Results>
    </InstantSearch>
  )
}
