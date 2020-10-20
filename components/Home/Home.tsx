import React from "react"
import { NextPage } from "next"
import Router from "next/router"
import { useQuery, useMutation, queryCache } from "react-query"
import dayjs from "dayjs"

import withLayout from "../../hocs/withLayout"
import utilities from "../../utilities"

import Section from "../Layout/Section"
import Button from "../Elements/Button"

interface Trip {
  id: number
  nickname: string
  dateStart: Date
  dateEnd: Date
}

interface Props {}

async function fetchTripsRequest() {
  const res = await fetch("/api/trips")
  const data = await res.json()
  const { trips } = data
  return trips
}

const Home: NextPage<Props> = ({}) => {
  const { data: trips } = useQuery("trips", fetchTripsRequest)
  console.log(trips)
  return (
    <Section extend="mb-20">
      <h1>My Trips</h1>
      <div className="flex flex-col">
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
                          <tr key={trip.id}>
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
                                    {trip.nickname}
                                  </div>
                                  {/* <div className="text-sm leading-5 text-gray-500">
                              jane.cooper@example.com
                            </div> */}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap">
                              <div className="text-sm leading-5 text-gray-900">
                                {dayjs(trip.dateStart).format("MM/DD/YYYY")}
                              </div>
                              {/* <div className="text-sm leading-5 text-gray-500">
                          Optimization
                        </div> */}
                            </td>
                            <td className="text-sm px-6 py-4 whitespace-no-wrap">
                              {/* <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span> */}
                              {dayjs(trip.dateEnd).format("MM/DD/YYYY")}
                            </td>
                            {/* <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                        Admin
                      </td> */}
                            <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                              <a
                                href="/"
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
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
