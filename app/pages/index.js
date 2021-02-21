import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import {
  InstantSearch,
  SearchBox,
  connectHits,
  connectHighlight,
} from "react-instantsearch-dom";
import { useQuery, gql } from "@apollo/client";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import PrimaryLayout from "../layouts/primary";

const searchClient = instantMeiliSearch("http://localhost:7700");

const PACKAGES_QUERY = gql`
  query GetPackages {
    packages(query: "", local: true) {
      id
      name
    }
  }
`;

const BaseHighlight = ({ highlight, attribute, hit }) => {
  const parsedHit = highlight({
    highlightProperty: "_highlightResult",
    attribute,
    hit,
  });

  return (
    <span>
      {parsedHit.map((part, index) =>
        part.isHighlighted ? (
          <mark key={index}>{part.value}</mark>
        ) : (
          <span key={index}>{part.value}</span>
        )
      )}
    </span>
  );
};

const Highlight = connectHighlight(BaseHighlight);

const BaseHits = ({ hits, stack }) => (
  <ol className="space-y-3">
    {hits.map((hit) => (
      <li
        className="bg-white shadow overflow-hidden sm:px-6 sm:rounded-md"
        key={hit.objectID}
      >
        <Link href={`/${stack}/post/${hit.ParentId || hit.Id}`}>
          <a className="flex flex-col px-4 py-4 cursor-pointer">
            <div className="flex justify-between">
              <h3 className="text-md font-medium mb-2">{hit.Title}</h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {hit.Score} votes
              </span>
            </div>
            <Highlight attribute="Body" hit={hit} />
          </a>
        </Link>
      </li>
    ))}
  </ol>
);

const Hits = connectHits(BaseHits);

export default function Home() {
  const [stack, setStack] = useState(null);

  const { loading, error, data } = useQuery(PACKAGES_QUERY);

  // wtf
  const stacks =
    !loading && !error
      ? data.packages.map((pkg) => ({
          value: pkg.name,
          name: pkg.name,
        }))
      : [];
  useEffect(() => {
    if (stacks.length > 0) setStack(stacks[0].value);
  }, [data]);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PrimaryLayout>
        {loading && <p>Loading...</p>}
        {error && <p>Error...</p>}
        {!loading && !error && (
          <>
            {/* <div>
              <label
                for="stack"
                className="block text-sm font-medium text-gray-700"
              >
                Stack
              </label>
              <select
                id="stack"
                name="stack"
                onChange={(e) => setStack(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {stacks.map(({ value, name }) => (
                  <option key={value} value={value} selected={value === stack}>
                    {name}
                  </option>
                ))}
              </select>
            </div> */}

            <InstantSearch
              indexName={`${stack}_post`}
              searchClient={searchClient}
            >
              <div className="flex space-x-4 mb-4">
                <div>
                  <select
                    id="stack"
                    name="stack"
                    onChange={(e) => setStack(e.target.value)}
                    value={stack}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {stacks.map(({ value, name }) => (
                      <option key={value} value={value}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <SearchBox />
              </div>
              <Hits stack={stack} />
            </InstantSearch>
          </>
        )}
      </PrimaryLayout>
    </div>
  );
}
