import React from "react"
import { NextPage } from "next"
import { Router, useRouter } from "next/router"
import { useQuery, useMutation, queryCache } from "react-query"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { useCurrentUser } from "feather-client-react"

import withLayout from "../../hocs/withLayout"
import utilities from "../../utilities"

import Section from "../Layout/Section"
import Button from "../Elements/Button"

import { Trip } from "../../models/interfaces"

interface Props {}

const TripForm: NextPage<Props> = ({}) => {
  const { loading, currentUser } = useCurrentUser()
  const router = useRouter()
  const now = dayjs()
  const { data: trip } = useQuery("trip", fetchTripRequest)
  const currentTrip: Trip = trip
  const [isSubmittingData, setIsSubmittingData] = React.useState(false)

  const [nickname, setNickname] = React.useState(
    currentTrip ? currentTrip.nickname : ""
  )
  const [dateStart, setDateStart] = React.useState(
    currentTrip
      ? dayjs.utc(currentTrip.dateStart).format("YYYY-MM-DD")
      : now.format("YYYY-MM-DD")
  )
  const [dateEnd, setDateEnd] = React.useState(
    currentTrip
      ? dayjs.utc(currentTrip.dateEnd).format("YYYY-MM-DD")
      : now.add(1, "day").format("YYYY-MM-DD")
  )

  async function fetchTripRequest() {
    if (!window.location.pathname.includes("new")) {
      const tripId = window.location.pathname.replace(/[^\d.]/g, "")
      const res = await fetch(`/api/trip/${tripId}`)
      const data = await res.json()
      const { trip } = data
      setNickname(trip.nickname)
      setDateStart(dayjs.utc(trip.dateStart).format("YYYY-MM-DD"))
      setDateEnd(dayjs.utc(trip.dateEnd).format("YYYY-MM-DD"))
      return trip
    }
  }

  async function sendTripData(e, tripData) {
    e.preventDefault()
    setIsSubmittingData(true)

    let apiUrl = "/api/trips/create"
    let fetchMethod = "POST"
    if (trip) {
      apiUrl = `/api/trip/${trip.id}/update`
      fetchMethod = "PUT"
    }
    const res = await fetch(apiUrl, {
      method: fetchMethod,
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": currentUser ? currentUser.tokens.idToken : null
      },
      body: JSON.stringify(tripData)
    })
    if (res) {
      console.log(res)
      res.json().then(res => {
        const { tripResponse } = res
        if (tripResponse) router.push(`/trip/${tripResponse.id}`)
      })
    }
  }
  return (
    <Section>
      <div>
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {currentTrip ? "Edit" : "New"} Trip
                </h3>
                <p className="mt-1 text-sm leading-5 text-gray-600">
                  Here you can provide details of a Trip.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form action="#" method="POST">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-4">
                        <label className="block text-sm font-medium leading-5 text-gray-700">
                          Trip Name
                        </label>
                        <input
                          className="mt-1 form-input block w-full py-2 px-3 
                          border border-gray-300 rounded-md shadow-sm 
                          focus:outline-none focus:shadow-outline-blue focus:border-blue-300 
                          transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          placeholder="Our Hawaii Honeymoon"
                          onChange={e => setNickname(e.target.value)}
                          value={nickname}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium leading-5 text-gray-700">
                          Date Start
                        </label>
                        <input
                          id="dateStart"
                          className="mt-1 form-input block w-full py-2 px-3 
                          border border-gray-300 rounded-md shadow-sm focus:outline-none 
                          focus:shadow-outline-blue focus:border-blue-300 transition 
                          duration-150 ease-in-out sm:text-sm sm:leading-5"
                          type="date"
                          value={dateStart}
                          onChange={e => setDateStart(e.target.value)}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium leading-5 text-gray-700">
                          Date End
                        </label>
                        <input
                          id="dateEnd"
                          className="mt-1 form-input block w-full py-2 px-3 
                          border border-gray-300 rounded-md shadow-sm 
                          focus:outline-none focus:shadow-outline-blue focus:border-blue-300 
                          transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          type="date"
                          value={dateEnd}
                          onChange={e => setDateEnd(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-center sm:px-6">
                    <button
                      className={`py-2 px-4 border border-transparent text-sm 
                      leading-5 font-medium rounded-md text-white bg-blue-600 
                      shadow-sm hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue 
                      active:bg-blue-600 transition duration-150 ease-in-out w-full sm:w-1/4
                      ${isSubmittingData ? "spinner" : ""}`}
                      onClick={e =>
                        sendTripData(e, {
                          trip: {
                            nickname,
                            dateStart,
                            dateEnd
                          }
                        })
                      }
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default withLayout(TripForm)
