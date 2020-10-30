import React from "react"
import { NextPage } from "next"
import Link from "next/link"
import { Router, useRouter } from "next/router"
import { useQuery, useMutation, queryCache } from "react-query"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import S3 from "react-s3-uploader"
import {
  Image,
  Video,
  Transformation,
  CloudinaryContext
} from "cloudinary-react"
import Dropzone from "react-dropzone"
import Lightbox from "react-awesome-lightbox"

import withLayout from "../../hocs/withLayout"
import utilities from "../../utilities"

import Section from "../Layout/Section"
import Button from "../Elements/Button"
import TripNoteItemForm from "../Forms/TripNoteItemForm"

import {
  Trip,
  TripNote,
  TripNoteType,
  TripNoteItem,
  TripNoteCost,
  TripNoteItemImage
} from "../../models/interfaces"
import tripnotes from "../../pages/api/tripNotes"
import { toArray } from "lodash"

interface Props {
  tripNote: TripNote
}

const TripNoteDetail: NextPage<Props> = ({ tripNote }) => {
  const router = useRouter()
  const now = dayjs()
  const imageRef = React.createRef<HTMLInputElement>()
  const [tripNoteItems, setTripNoteItems] = React.useState(
    tripNote ? tripNote.TripNoteItems : null
  )
  const [activeItem, setActiveItem] = React.useState(0)
  const [isAddingItem, setIsAddingItem] = React.useState(false)
  const [isUploadingFiles, setIsUploadingFiles] = React.useState(false)
  const [isViewingImages, setIsViewingImages] = React.useState(false)
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

  let images = []
  tripNoteItems[activeItem].TripNoteItemImages.forEach(image => {
    images.push({
      url: image.sourceUrl,
      title: image.name
    })
  })

  async function confirmDelete(tripNoteId: number) {
    const choseToDelete = window.confirm("Delete Trip Note?")
    if (choseToDelete) {
      const res = await fetch(`/api/tripnote/${tripNoteId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await res.json()
      if (!data.error) {
        console.log(data)
        document.getElementById(tripNoteId.toString()).remove()
      }
    }
  }

  async function fetchTripNoteRequest() {
    const res = await fetch(`/api/tripNote/${tripNote.id}`)
    const resData = await res.json()
    const tripNoteResponse: TripNote = resData.tripNote
    setTripNoteItems(tripNoteResponse.TripNoteItems)
  }

  async function handleAddImages(tripNoteItemId: number) {
    if (imageRef.current.files.length > 10)
      alert("File upload limit is 10 files. Please try again.")
    else {
      setIsUploadingFiles(true)
      const fileArray = toArray(imageRef.current.files)
      fileArray.map(file => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "ionrtpdh") // Replace the preset name with your own
        formData.append("api_key", "438372236167455") // Replace API key with your own Cloudinary key

        fetch(`https://api.cloudinary.com/v1_1/raskin-me/image/upload`, {
          method: "POST",
          headers: { "X-Requested-With": "XMLHttpRequest" },
          body: formData
        })
          .then(res => res.json())
          .then(res => {
            console.log(res)
            const sourceUrl = res.secure_url

            fetch(`/api/tripNoteItemImages/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                tripNoteItemImage: {
                  tripNoteItemId: tripNote.TripNoteItems[activeItem].id,
                  name: file.name,
                  sourceUrl
                }
              })
            })
          })
      })

      //count to 5 then reload the TripNoteItem
      setTimeout(function() {
        setIsUploadingFiles(false)
        fetchTripNoteRequest()
      }, 5000)
    }
  }

  function handleClickImage(index: number) {
    setCurrentImageIndex(index)
    setIsViewingImages(true)
  }

  if (!tripNote) {
    return (
      <Section extend="mb-20 w-full py-12 px-4">
        <p>Oh no! An error has occured :(</p>
      </Section>
    )
  }
  return (
    <Section extend="mb-20 w-full py-12 px-4">
      <div className="uppercase text-xxs font-semibold">
        <Link href="/">
          <a>Trips</a>
        </Link>{" "}
        /{" "}
        <Link href="/trip/[tripid]" as={`/trip/${tripNote.Trip.id}`}>
          <a>{tripNote.Trip.nickname}</a>
        </Link>{" "}
        / {tripNote.title}
      </div>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <div>
            <h2 className="mt-6 text-3xl leading-9 font-extrabold">
              {tripNote.title}
              <span
                className="sm:ml-6 ml-2 px-4 py-1 inline-flex text-sm leading-5 
                                font-semibold rounded-full bg-indigo-600 text-white"
              >
                {tripNote.tripNoteType === TripNoteType.Lodging
                  ? "Lodging"
                  : ""}
              </span>
            </h2>
          </div>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap">
            <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
              <span className="mb-6">
                {tripNote.subtitle} [{tripNote.tag}]
              </span>
            </div>
          </div>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <span className="shadow-sm rounded-md">
            <Link
              href="/trip/[tripid]/tripnote/[tripnoteid]/edit"
              as={`/trip/${tripNote.tripId}/tripnote/${tripNote.id}/edit`}
            >
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
      <div className="mt-5 md:mt-0 md:col-span-2">
        <div className="shadow sm:rounded-md sm:overflow-hidden bg-white">
          <ul className="flex">
            {tripNoteItems.length > 0 ? (
              tripNoteItems.map((item: TripNoteItem, index) => {
                const isActiveItem = index === activeItem
                return (
                  <li key={item.id} className="flex-1 mr-2">
                    <a
                      className={`text-center leading-9 block uppercase text-xs font-semibold
                        tracking-wide py-2 px-4 cursor-pointer hover:border-blue-600 hover:text-blue-600
                        ${
                          isActiveItem && !isAddingItem
                            ? "text-blue-600  border-blue-600 border-b-2 "
                            : "text-gray-400  hover:border-gray-50 hover:bg-gray-50 border-gray-200 border-b"
                        }`}
                      href="#"
                      onClick={() => {
                        setIsAddingItem(false)
                        setActiveItem(index)
                      }}
                    >
                      {item.title}
                    </a>
                  </li>
                )
              })
            ) : (
              <TripNoteItemForm
                tripNote={tripNote}
                setTripNoteItems={setTripNoteItems}
                activeItem={0}
                setActiveItem={setActiveItem}
                setIsAddingItem={setIsAddingItem}
              />
            )}
            {tripNoteItems.length > 0 && tripNoteItems.length < 4 ? (
              <li className="flex-1 mr-2">
                <a
                  className={`text-center leading-9 block uppercase text-xs font-semibold
                  border-gray-200 cursor-pointer hover:text-blue-600
                  hover:border-blue-600 hover:border-b hover:bg-gray-50 py-2 px-4
                  ${
                    isAddingItem
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-400 border-b"
                  }`}
                  href="#"
                  onClick={() => setIsAddingItem(true)}
                >
                  New item
                </a>
              </li>
            ) : null}
          </ul>
          <div className={`mb-10 ${isAddingItem ? "" : "hidden"}`}>
            <TripNoteItemForm
              tripNote={tripNote}
              setTripNoteItems={setTripNoteItems}
              activeItem={tripNote.TripNoteItems.length}
              setActiveItem={setActiveItem}
              setIsAddingItem={setIsAddingItem}
            />
          </div>

          {/* ITEM TAB SECTION */}
          <div className={`${isAddingItem ? "hidden" : ""}`}>
            <h3
              className={`ml-6 text-base leading-9 
            ${
              tripNoteItems[activeItem] &&
              tripNoteItems[activeItem].subtitle.length > 0
                ? ""
                : "hidden"
            }`}
            >
              {tripNoteItems[activeItem]
                ? tripNoteItems[activeItem].subtitle
                : ""}
            </h3>
            <div
              className={`m-6 ${
                tripNoteItems.length == 0 ||
                (tripNoteItems[activeItem].TripNoteItemImages &&
                  tripNoteItems[activeItem].TripNoteItemImages.length > 0)
                  ? "hidden"
                  : ""
              }`}
            >
              <label className="block text-sm font-medium leading-5 text-gray-700">
                Details
              </label>
              <textarea
                className="mt-1 form-input block w-full py-2 px-3 
                border border-gray-300 rounded-md shadow-sm focus:outline-none 
                focus:shadow-outline-blue focus:border-blue-300 transition 
                duration-150 ease-in-out sm:text-sm sm:leading-5"
                // onChange={e => setSubtitle(e.target.value)}
                // value={tripNoteItems[activeItem].body}
              ></textarea>
            </div>

            {/* IMAGE VIEWER */}
            {isViewingImages ? (
              <Lightbox
                images={images}
                onClose={() => setIsViewingImages(false)}
                startIndex={currentImageIndex}
              />
            ) : null}

            {/* IMAGE GALLERY */}
            <section
              className={`m-6 ${
                tripNoteItems.length > 0 &&
                tripNoteItems[activeItem].TripNoteItemImages &&
                tripNoteItems[activeItem].TripNoteItemImages.length > 0
                  ? ""
                  : "hidden"
              }`}
            >
              <div className="container px-5 py-4 mx-auto">
                <div className="flex flex-wrap -m-4">
                  {tripNoteItems[activeItem] &&
                  tripNoteItems[activeItem].TripNoteItemImages
                    ? tripNoteItems[activeItem].TripNoteItemImages.map(
                        (image: TripNoteItemImage, index) => {
                          return (
                            <div
                              key={image.id}
                              className="lg:w-1/3 sm:w-1/2 p-4"
                            >
                              <div className="flex relative h-48">
                                <img
                                  alt={image.name}
                                  className="rounded absolute inset-0 w-full h-full 
                                    object-cover object-center"
                                  src={image.sourceUrl}
                                />
                                <div
                                  onClick={() => handleClickImage(index)}
                                  className="px-8 relative z-10 w-full border-4 border-gray-200 
                                  bg-white opacity-0 cursor-pointer"
                                >
                                  <h2 className="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">
                                    .
                                  </h2>
                                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                    .
                                  </h1>
                                  <p className="leading-relaxed">
                                    Tripnotize Tripnotize Tripnotize Tripnotize
                                    Tripnotize Tripnotize Tripnotize Tripnotize
                                    Tripnotize
                                  </p>
                                </div>
                              </div>
                              <p
                                className="mt-1 text-center text-xxs uppercase 
                              tracking-widest font-semibold text-gray-600"
                              >
                                {image.name}
                              </p>
                            </div>
                          )
                        }
                      )
                    : null}
                </div>
              </div>
            </section>

            {/* DRAG/DROP FILE UPLOADER */}
            <div
              className={`px-4 py-5 sm:p-6 
            ${tripNoteItems.length > 0 ? "" : "hidden"}`}
            >
              <div className="">
                <div
                  className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 
              border-gray-300 border-dashed rounded-md"
                >
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">
                      <label
                        className="font-medium text-blue-600 hover:text-blue-500 
                        focus:outline-none focus:underline transition duration-150 ease-in-out"
                      >
                        <span className="cursor-pointer">Upload files</span>
                        <input
                          className="hidden"
                          name="image"
                          type="file"
                          multiple={true}
                          ref={imageRef}
                          onChange={() =>
                            handleAddImages(tripNoteItems[activeItem].id)
                          }
                        />
                      </label>{" "}
                      or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    <p>
                      <button
                        className={`mt-4 ml-6 inline-flex items-center px-4 py-4 
                        text-sm leading-5 font-bold 
                      rounded-md text-white mr-4 bg-blue-600 hover:bg-blue-500 
                      focus:outline-none focus:shadow-outline-blue  focus:border-blue-700 
                      active:bg-blue-700 transition duration-150 ease-in-out spinner
                      ${isUploadingFiles ? "" : "hidden"}`}
                      ></button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default withLayout(TripNoteDetail)
