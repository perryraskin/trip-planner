import React from "react"
import { NextPage } from "next"
import Router from "next/router"
import { useQuery, useMutation, queryCache } from "react-query"

import withLayout from "../../hocs/withLayout"
import utilities from "../../utilities"

import Button from "../Elements/Button"

interface Props {}

async function fetchUsersRequest() {
  const res = await fetch("/api/users")
  const data = await res.json()
  const { users } = data
  return users
}

const Home: NextPage<Props> = ({}) => {
  const { data: users } = useQuery("users", fetchUsersRequest)
  return (
    <div className="text-center">
      <h1>Next.js TailwindCSS Starter</h1>
      <p>A super simple boilerplate for your Next.js web app</p>
      <a
        href="https://github.com/perryraskin/nextjs-tailwindcss-starter"
        target="_blank"
      >
        <Button
          text="Get Source Code"
          extend="bg-blue-600 hover:bg-blue-500 text-white"
        />
      </a>
      <p>
        {users ? users[0].name : ""}'s email is {users ? users[0].email : ""}
      </p>
      <p>{JSON.stringify(users)}</p>
    </div>
  )
}

export default withLayout(Home)
