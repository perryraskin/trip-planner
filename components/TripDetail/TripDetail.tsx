import React from "react"
import { NextPage } from "next"
import Link from "next/link"
import { Router, useRouter } from "next/router"
import { useQuery, useMutation, queryCache } from "react-query"

import withLayout from "../../hocs/withLayout"
import utilities from "../../utilities"

import Section from "../Layout/Section"
import Button from "../Elements/Button"

import dayjs from "dayjs"

import { Trip } from "../Home/Home"

interface Props {
  trip: Trip
}

const TripDetail: NextPage<Props> = ({ trip }) => {
  const router = useRouter()
  const now = dayjs()
  const [nickname, setNickname] = React.useState("")
  const [dateStart, setDateStart] = React.useState(now.format("YYYY-MM-DD"))
  const [dateEnd, setDateEnd] = React.useState(
    now.add(1, "day").format("YYYY-MM-DD")
  )

  async function sendTripData(e, tripData) {
    e.preventDefault()
    const res = await fetch("/api/trips/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tripData)
    })
    res.json().then(res => {
      console.log(res)
      router.push("/")
    })
  }
  return (
    <Section extend="mb-20 w-full py-12 px-4">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
            {trip.nickname}
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap">
            <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
              {/* Heroicon name: calendar */}
              <svg
                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              {dayjs(trip.dateStart).format("MM/DD/YYYY")} to{" "}
              {dayjs(trip.dateEnd).format("MM/DD/YYYY")}
            </div>
          </div>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <span className="shadow-sm rounded-md">
            <Link href="/trip/[tripid]/edit" as={`/trip/${trip.id}/edit`}>
              <a
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 
              text-sm leading-5 font-medium rounded-md text-gray-700 bg-white 
              hover:text-gray-500 focus:outline-none focus:shadow-outline-blue 
              focus:border-blue-300 active:text-gray-800 active:bg-gray-50 
              transition duration-150 ease-in-out"
              >
                {/* Heroicon name: pencil */}
                <svg
                  className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </a>
            </Link>
          </span>
        </div>
      </div>
    </Section>
  )
}

export default withLayout(TripDetail)
