import React from "react"
import { NextPage } from "next"
import Link from "next/link"
import Router from "next/router"
import { useQuery, useMutation, queryCache } from "react-query"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

import withLayout from "../../hocs/withLayout"
import utilities from "../../utilities"

import Section from "../Layout/Section"
import Button from "../Elements/Button"

interface Props {}

async function fetchTripsRequest() {
  const res = await fetch("/api/trips")
  const data = await res.json()
  const { trips } = data
  return trips
}

const Home: NextPage<Props> = ({}) => {
  const { data: trips, error, isFetching } = useQuery(
    "trips",
    fetchTripsRequest
  )

  const [mutateDeleteTrip] = useMutation(
    (tripId: number) =>
      fetch(`/api/trip/${tripId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      }),
    {
      onSuccess: () => {
        queryCache.invalidateQueries("trips")
      }
    }
  )

  function confirmDelete(tripId: number) {
    const choseToDelete = window.confirm("Delete trip?")
    if (choseToDelete) {
      mutateDeleteTrip(tripId)
    }
  }
  return (
    <Section>
      <div>
        <h2 className="mt-6 text-3xl leading-9 font-extrabold">My Trips</h2>
      </div>
      <div className="flex flex-col mt-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Date Start
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Date End
                    </th>
                    {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th> */}
                    <th className="px-6 py-3 bg-gray-50"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trips
                    ? trips.map((trip: Trip) => {
                        return (
                          <tr key={trip.id} className="hover:bg-blue-100">
                            <td className="px-6 py-4 whitespace-no-wrap">
                              <div className="flex items-center">
                                {/* <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
                              alt=""
                            />
                          </div> */}
                                <div className="ml-4">
                                  <div className="text-sm leading-5 font-medium text-gray-900">
                                    <Link href={`/trip/${trip.id}`}>
                                      {trip.nickname}
                                    </Link>
                                  </div>
                                  {/* <div className="text-sm leading-5 text-gray-500">
                              jane.cooper@example.com
                            </div> */}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap">
                              <div className="text-sm leading-5 text-gray-900">
                                {dayjs.utc(trip.dateStart).format("MM/DD/YYYY")}
                              </div>
                              {/* <div className="text-sm leading-5 text-gray-500">
                          Optimization
                        </div> */}
                            </td>
                            <td className="text-sm px-6 py-4 whitespace-no-wrap">
                              {/* <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span> */}
                              {dayjs.utc(trip.dateEnd).format("MM/DD/YYYY")}
                            </td>
                            {/* <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                        Admin
                      </td> */}
                            <td
                              className="px-6 py-4 whitespace-no-wrap text-right 
                            text-sm leading-5 font-medium"
                            >
                              <Link href={`/trip/${trip.id}/edit`}>
                                <a className="text-blue-600 hover:text-blue-900 mr-4">
                                  Edit
                                </a>
                              </Link>
                              <a
                                href="#"
                                className="text-red-600 hover:text-red-900"
                                onClick={() => confirmDelete(trip.id)}
                              >
                                Delete
                              </a>
                            </td>
                          </tr>
                        )
                      })
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default withLayout(Home)

export interface Trip {
  id: number
  nickname: string
  dateStart: Date
  dateEnd: Date
  headerImageUrl: string
  userId: number
  tripNotes: Array<TripNote>
}

export interface TripNote {
  id: number
  title: string
  subtitle: string
  tripNoteType: TripNoteType
  tag: string
  userId: number
  tripId: number
  tripNoteItems: Array<TripNoteItem>
}

export enum TripNoteType {
  Lodging = 1,
  Transit = 2,
  Excursion = 3
}

export interface TripNoteItem {
  id: number
  title: string
  subtitle: string
  details: string
  tripNoteId: number
  tripNoteImages: Array<TripNoteImage>
}

export interface TripNoteImage {
  id: number
  name: string
  sourceUrl: string
  tripNoteItemId: number
}