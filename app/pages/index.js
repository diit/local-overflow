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
      // <li
      //   className="bg-white shadow overflow-hidden sm:px-6 sm:rounded-md"
      //   key={hit.objectID}
      // >
      //   <Link href={`/${stack}/post/${hit.ParentId || hit.Id}`}>
      //     <a className="flex flex-col px-4 py-4 cursor-pointer">
      //       <div className="flex justify-between">
      //         <h3 className="text-md font-medium mb-2">{hit.Title}</h3>
      //         <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      //           {hit.Score} votes
      //         </span>
      //       </div>
      //       <Highlight attribute="Body" hit={hit} />
      //     </a>
      //   </Link>
      // </li>
      <li
        className="bg-white px-4 py-6 shadow sm:p-6 sm:rounded-lg"
        key={hit.objectID}
      >
        <Link href={`/${stack}/post/${hit.ParentId || hit.Id}`}>
          <a>
            <article aria-labelledby="question-title-81614">
              <div>
                {/* <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      <a href="#" className="hover:underline">
                        Dries Vincent
                      </a>
                    </p>
                    <p className="text-sm text-gray-500">
                      <a href="#" className="hover:underline">
                        December 9 at 11:43 AM
                      </a>
                    </p>
                  </div>
                  <div className="flex-shrink-0 self-center flex">
                    <div className="relative inline-block text-left">
                      <div>
                        <button
                          type="button"
                          className="-m-2 p-2 rounded-full flex items-center text-gray-400 hover:text-gray-600"
                          id="options-menu-0"
                          aria-expanded="false"
                          aria-haspopup="true"
                        >
                          <span className="sr-only">Open options</span>
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                      <div
                        className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu-0"
                      >
                        <div className="py-1">
                          <a
                            href="#"
                            className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                          >
                            <svg
                              className="mr-3 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>Add to favorites</span>
                          </a>
                          <a
                            href="#"
                            className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                          >
                            <svg
                              className="mr-3 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Embed</span>
                          </a>
                          <a
                            href="#"
                            className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                          >
                            <svg
                              className="mr-3 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Report content</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* mt-4  */}
                <h2
                  id="question-title-81614"
                  className="text-base font-medium text-gray-900"
                >
                  {hit.Title}
                </h2>
              </div>
              <div className="mt-2 text-sm text-gray-700 space-y-4">
                <Highlight attribute="Body" hit={hit} />
              </div>
              <div className="mt-6 flex justify-between space-x-8">
                <div className="flex space-x-6">
                  <span className="inline-flex items-center text-sm">
                    <button className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span className="font-medium text-gray-900">2{hit.Score}</span>
                      <span className="sr-only">votes</span>
                    </button>
                  </span>
                  {/* <span className="inline-flex items-center text-sm">
                    <button className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-gray-900">11</span>
                      <span className="sr-only">replies</span>
                    </button>
                  </span> */}
                  <span className="inline-flex items-center text-sm">
                    <button className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium text-gray-900">{hit.ViewCount}</span>
                      <span className="sr-only">views</span>
                    </button>
                  </span>
                </div>
                {/* <div className="flex text-sm">
                  <span className="inline-flex items-center text-sm">
                    <button className="inline-flex space-x-2 text-gray-400 hover:text-gray-500">
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      <span className="font-medium text-gray-900">Share</span>
                    </button>
                  </span>
                </div> */}
              </div>
            </article>
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

      <PrimaryLayout className="lg:col-span-9 xl:col-span-6">
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
