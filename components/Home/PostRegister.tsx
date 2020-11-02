import React from "react"
import { NextPage } from "next"
import { Router, useRouter } from "next/router"
import Link from "next/link"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { useCurrentUser } from "feather-client-react"

import withLayout from "../../hocs/withLayout"
import Section from "../Layout/Section"

interface Props {
  setUserObject: (user: any) => void
}

const PostRegister: NextPage<Props> = ({ setUserObject }) => {
  const { loading, currentUser } = useCurrentUser()
  const [isAddingUserToDB, setIsAddingUserToDB] = React.useState(false)

  async function addUserToDB(e) {
    e.preventDefault()
    setIsAddingUserToDB(true)

    let apiUrl = "/api/users/create"
    let fetchMethod = "POST"
    const res = await fetch(apiUrl, {
      method: fetchMethod,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: {
          name: "",
          email: currentUser.email,
          featherId: currentUser.id
        }
      })
    })
    if (res) {
      console.log(res)
      res.json().then(res => {
        const { user } = res
        setUserObject(user)
      })
    }
  }
  return (
    <Section extend="text-center">
      {/* <p className="mt-6 text-xl leading-9 font-extrabold">Welcome!</p> */}
      <button
        type="button"
        className={`inline-flex items-center px-4 py-2 border-2 border-white 
        text-sm leading-5 font-bold rounded-md text-white mr-4
        bg-blue-600 hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue 
        focus:border-blue-700 active:bg-blue-700 transition duration-150 ease-in-out
        ${isAddingUserToDB ? "spinner" : ""}`}
        onClick={e => addUserToDB(e)}
      >
        Success! Click here to continue.
      </button>
    </Section>
  )
}

export default withLayout(PostRegister)
