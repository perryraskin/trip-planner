export interface User {
  id: number
  name: string
  email: string
  featherId: string
}

export interface Trip {
  id: number
  nickname: string
  dateStart: Date
  dateEnd: Date
  headerImageUrl: string
  userId: number
  TripNotes: Array<TripNote>
  deleted: boolean
  User: User
}

export interface TripNote {
  id: number
  title: string
  subtitle: string
  tripNoteType: TripNoteType
  tag: string
  userId: number
  tripId: number
  Trip: Trip
  TripNoteCosts: Array<TripNoteCost>
  TripNoteItems: Array<TripNoteItem>
  deleted: boolean
  User: User
}

export interface TripNoteCost {
  id: number
  tripNoteId: number
  amount: number
  currency: string
}

export enum TripNoteType {
  Lodging = 1,
  Transit,
  Excursion
}

export interface TripNoteItem {
  id: number
  title: string
  subtitle: string
  body: string
  tripNoteId: number
  TripNoteItemImages: Array<TripNoteItemImage>
  deleted: boolean
}

export enum TripNoteItemType {
  Photos = 1,
  Amenities,
  Notes
}

export interface TripNoteItemImage {
  id: number
  name: string
  sourceUrl: string
  tag: string
  tripNoteItemId: number
  deleted: boolean
}
