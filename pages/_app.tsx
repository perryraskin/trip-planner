import React from "react"
import Head from "next/head"
import App from "next/app"
import { FeatherClient, FeatherProvider } from "feather-client-react"

const feather = FeatherClient("pk_live_WJkRoJB9SE4N9TXzcA7GblNIYr0Eth")

import "../styles/tailwind.css"
import "react-awesome-lightbox/build/style.css"

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          ></meta>
          {/* General tags */}
          <meta
            key="description"
            property="description"
            content="Trip Planner App"
          />
          <title key="title">Trip Planner App</title>
          {/* OpenGraph tags */}
          <meta
            key="og:url"
            property="og:url"
            content="https://github.com/perryraskin/trip-planner"
          />
          <meta key="og:title" property="og:title" content="Trip Planner App" />
          <meta
            key="og:description"
            property="og:description"
            content="Trip Planner App"
          />
          {/* <meta key="og:image" property="og:image" content="" /> */}
          <meta key="og:type" property="og:type" content="website" />
          {/* Twitter Card tags */}
          <meta
            key="twitter:title"
            property="twitter:title"
            content="Trip Planner App"
          />
          <meta
            key="twitter:description"
            property="twitter:description"
            content="Trip Planner App"
          />
          {/* <meta key="twitter:image" property="twitter:image" content="" /> */}
          <meta key="twitter:card" property="twitter:card" content="summary" />
        </Head>
        <div className="bg-gray-100">
          <FeatherProvider client={feather}>
            <Component {...pageProps} />
          </FeatherProvider>
        </div>
      </>
    )
  }
}

export default MyApp
