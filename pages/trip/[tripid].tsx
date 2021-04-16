import React, { useState, useEffect, useContext } from "react"
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next"
//import absoluteUrl from "next-absolute-url"

import TripDetail from "../../components/Trip/TripDetail"

import { Trip } from "../../models/interfaces"

interface Props {
  trip?: Trip
  errors?: any
}

const TripDetailPage: NextPage<Props> = ({
  trip,
  errors
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <TripDetail trip={trip} />
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { req, params } = ctx
  const { tripid } = params
  // const { origin } = absoluteUrl(req)
  // const apiUrl = `${origin}/api/trip/${tripid}`
  // const apiUrl = `http://localhost:3000/api/trip/${tripid}`
  const apiUrl = `${process.env.BASE_URL}/api/trip/${tripid}`

  // const cookies = parseCookies(ctx)
  // const { sessionId } = cookies
  //console.log('cookies:', cookies);
  //console.log('sessionId:', sessionId);
  const res = await fetch(apiUrl)
  const resData = await res.json()
  const { trip } = resData
  // console.log("res:", trip)

  if (trip) {
    return {
      props: {
        trip
      }
    }
  } else {
    return {
      props: {
        errors: "Not logged in!"
      }
    }
  }
}

export default TripDetailPage
