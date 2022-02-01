import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";

import Layout from "../layout/Layout";
import AuthProvider from "../contexts/AuthContext";
import reducer from "../reducers";
import "../styles/globals.css";

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider>
            <Head>
                <title>Decentraland Administrator</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Provider store={store}>
                <AuthProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </AuthProvider>
            </Provider>
        </ChakraProvider>
    );
}

export default MyApp;
