import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import "../styles/globals.css";

// Ugh
if (typeof window !== 'undefined') {
  TimeAgo.addDefaultLocale(en);
}

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
