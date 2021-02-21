import React, { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import he from "he";
import DOMPurify from "dompurify";
import PrimaryLayout from "../../../layouts/primary";
import TimeAgo from 'react-time-ago';

const SanitizeHTML = ({ html }) => {
  return (
    <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
  );
};

const POST_QUERY = gql`
  query GetPost($stack: String!, $id: ID!) {
    post(stack: $stack, id: $id) {
      id
      postId
      title
      body
      score
      createdAt
      postTypeId
      posts {
        id
        postId
        body
        score
        createdAt
        postTypeId
      }
    }
  }
`;

const Post = () => {
  const router = useRouter();
  const { stack, id } = router.query;

  const { loading, error, data } = useQuery(POST_QUERY, {
    variables: {
      stack,
      id,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <PrimaryLayout>
      <main
        className="flex-1 relative overflow-y-auto focus:outline-none"
        tabIndex={-1}
      >
        <div className="py-8 xl:py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3">
            <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
              <div>
                <div>
                  <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {data.post.title}
                      </h1>
                      <p className="mt-2 text-sm text-gray-500">
                        #{data.post.postId} opened by{" "}
                        <a href="#" className="font-medium text-gray-900">
                          Anonymous{" "}
                        </a>
                        in{" "}
                        <a href="#" className="font-medium text-gray-900">
                          {stack}
                        </a>
                      </p>
                    </div>
                  </div>
                  <aside className="mt-8 xl:hidden">
                    <h2 className="sr-only">Details</h2>
                    <div className="space-y-5">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="h-5 w-5 text-gray-400"
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
                        <span className="text-gray-900 text-sm font-medium">
                          {data.post.posts.length} responses
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="flex flex-col text-gray-900 text-sm font-medium">
                          <span>Posted <TimeAgo date={new Date(data.post.createdAt)} /></span>
                          <span className="text-xs">{data.post.createdAt}</span>
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 border-t border-b border-gray-200 py-6 space-y-8">
                      <div>
                        <h2 className="text-sm font-medium text-gray-500">
                          Tags
                        </h2>
                        <ul className="mt-2 leading-8">
                          <li className="inline">
                            <a
                              href="#"
                              className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                            >
                              <div className="absolute flex-shrink-0 flex items-center justify-center">
                                <span
                                  className="h-1.5 w-1.5 rounded-full bg-rose-500"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="ml-3.5 text-sm font-medium text-gray-900">
                                Bug
                              </div>
                            </a>
                          </li>
                          <li className="inline">
                            <a
                              href="#"
                              className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                            >
                              <div className="absolute flex-shrink-0 flex items-center justify-center">
                                <span
                                  className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="ml-3.5 text-sm font-medium text-gray-900">
                                Accessibility
                              </div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </aside>
                  <div className="py-3 xl:pt-6 xl:pb-0">
                    <h2 className="sr-only">Description</h2>
                    <div className="prose max-w-none">
                      <SanitizeHTML html={he.decode(data.post.body)} />
                    </div>
                  </div>
                </div>
              </div>
              <section
                aria-labelledby="activity-title"
                className="mt-8 xl:mt-10"
              >
                <div>
                  <div className="divide-y divide-gray-200">
                    <div className="pb-4">
                      <h2
                        id="activity-title"
                        className="text-lg font-medium text-gray-900"
                      >
                        Activity
                      </h2>
                    </div>
                    <div className="pt-6">
                      {/* Activity feed*/}
                      <div className="flow-root">
                        <ul className="-mb-8">
                          {data.post.posts.map(post => (
                            <li>
                              <div className="relative pb-8">
                                <span
                                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                />
                                <div className="relative flex items-start space-x-3">
                                  <div className="relative">
                                    <div
                                      className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                                    />
                                    <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                                      <svg
                                        className="h-5 w-5 text-gray-400"
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
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div>
                                      <div className="flex justify-between text-sm">
                                        <a
                                          href="#"
                                          className="font-medium text-gray-900"
                                        >
                                          Anonymous{" "}
                                        </a>
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                          {post.score} votes
                                        </span>
                                      </div>
                                      <p className="mt-0.5 text-sm text-gray-500">
                                        Posted <TimeAgo date={new Date(post.createdAt)} />
                                      </p>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-700 prose">
                                      <SanitizeHTML html={he.decode(post.body)} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6">
                        <div className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <div
                                className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                              />
                              <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                                <svg
                                  className="h-5 w-5 text-gray-400"
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
                              </span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 flex items-center">
                            <span className="text-sm font-medium text-gray-900">Posted</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <aside className="hidden xl:block xl:pl-8">
              <h2 className="sr-only">Details</h2>
              <div className="space-y-5">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                  <span className="text-gray-900 text-sm font-medium">
                    {data.post.posts.length} responses
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="flex flex-col text-gray-900 text-sm font-medium">
                    <span>Posted <TimeAgo date={new Date(data.post.createdAt)} /></span>
                    <span className="text-xs">{data.post.createdAt}</span>
                  </span>
                </div>
              </div>
              <div className="mt-6 border-t border-gray-200 py-6 space-y-8">
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Tags</h2>
                  <ul className="mt-2 leading-8">
                    <li className="inline">
                      <a
                        href="#"
                        className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                      >
                        <div className="absolute flex-shrink-0 flex items-center justify-center">
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-rose-500"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3.5 text-sm font-medium text-gray-900">
                          Bug
                        </div>
                      </a>
                    </li>
                    <li className="inline">
                      <a
                        href="#"
                        className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                      >
                        <div className="absolute flex-shrink-0 flex items-center justify-center">
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3.5 text-sm font-medium text-gray-900">
                          Accessibility
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </PrimaryLayout>
  );
};

export default Post;
