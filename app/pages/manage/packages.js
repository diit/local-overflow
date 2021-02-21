import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

import PrimaryLayout from "../../layouts/primary";

const PACKAGES_QUERY = gql`
  query GetPackages($query: String!) {
    packages(query: $query) {
      id
      name
      size
      updatedAt
    }
  }
`;

const ADD_PACKAGE_MUTATION = gql`
  mutation loadDataset($stack: String!) {
    loadDataset(stack: $stack) {
      updateId
    }
  }
`;

const Packages = () => {
  const packagesQuery = useQuery(PACKAGES_QUERY, {
    variables: {
      query: "",
    },
  });

  const [loadDatasetMutation, datasetLoad] = useMutation(ADD_PACKAGE_MUTATION);

  const loadDataset = (stack) => {
    // Call Mutation
    loadDatasetMutation({ variables: { stack } }).then(() => {
      // Navigate to Update screen?
    });
  };

  if (packagesQuery.loading) return <p>Loading...</p>;
  if (packagesQuery.error) return <p>Error :(</p>;

  return (
    <PrimaryLayout>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Search packages
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <div className="relative flex items-stretch flex-grow focus-within:z-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <input
              type="text"
              name="query"
              id="query"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
              placeholder="Gardening"
            />
          </div>
          <button className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <span>Search</span>
          </button>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md mt-6">
        <ul className="divide-y divide-gray-200">
          {packagesQuery.data.packages.map((pkg) => (
            <li key={pkg.id}>
              <a
                href="#"
                className="block hover:bg-gray-50"
                onClick={() => loadDataset(pkg.name)}
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {pkg.name}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {pkg.size}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
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
                        {pkg.updatedAt}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </PrimaryLayout>
  );
};

export default Packages;
