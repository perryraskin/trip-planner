import React from "react"
import { NextPage } from "next"
import Link from "next/link"
import Router from "next/router"
import { useQuery, useMutation, queryCache } from "react-query"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { useCurrentUser } from "feather-client-react"

import withLayout from "../../hocs/withLayout"
import utilities from "../../utilities"
import { Trip } from "../../models/interfaces"

import Section from "../Layout/Section"
import Button from "../Elements/Button"
import PostRegister from "./PostRegister"

interface Props {}

const Home: NextPage<Props> = ({}) => {
  const { loading, currentUser } = useCurrentUser()
  const [userObject, setUserObject] = React.useState(null)
  const [userTrips, setUserTrips] = React.useState(null)

  async function fetchTripsRequest(featherId) {
    const res = await fetch(`/api/user/${featherId}/trips`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": currentUser ? currentUser.tokens.idToken : null
      }
    })
    const data = await res.json()
    const { trips } = data
    setUserTrips(trips)
  }

  async function fetchUser(featherId) {
    const res = await fetch(`/api/user/${featherId}`)
    const data = await res.json()
    const { user } = data
    setUserObject(user)
    fetchTripsRequest(featherId)
  }

  // const { data: trips, error, isFetching } = useQuery(
  //   "trips",
  //   fetchTripsRequest
  // )

  const [mutateDeleteTrip] = useMutation(
    (tripId: number) =>
      fetch(`/api/trip/${tripId}/delete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": currentUser ? currentUser.tokens.idToken : null
        }
      }),
    {
      onSuccess: () => {
        fetchTripsRequest(currentUser.id)
      }
    }
  )

  function confirmDelete(tripId: number) {
    const choseToDelete = window.confirm("Delete trip?")
    if (choseToDelete) {
      mutateDeleteTrip(tripId)
    }
  }

  if (!currentUser && !userObject) {
    return (
      <Section>
        <p>Not logged in!</p>
      </Section>
    )
  } else if (!userObject) {
    fetchUser(currentUser.id)
    return <PostRegister setUserObject={setUserObject} />
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
                  {userTrips
                    ? userTrips.map((trip: Trip) => {
                        return (
                          <tr key={trip.id} className="hover:bg-gray-50">
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
                                  <div className="text-sm leading-5 font-medium">
                                    <Link
                                      href="/trip/[tripid]"
                                      as={`/trip/${trip.id}`}
                                    >
                                      <a className="text-gray-900">
                                        {trip.nickname}
                                      </a>
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
                              <Link
                                href="/trip/[tripid]/edit"
                                as={`/trip/${trip.id}/edit`}
                              >
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
