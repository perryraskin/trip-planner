export interface Trip {
  id: number
  nickname: string
  dateStart: Date
  dateEnd: Date
  headerImageUrl: string
  userId: number
  TripNotes: Array<TripNote>
}

export interface TripNote {
  id: number
  title: string
  subtitle: string
  tripNoteType: TripNoteType
  tag: string
  userId: number
  tripId: number
  TripNoteItems: Array<TripNoteItem>
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
  details: string
  tripNoteId: number
  TripNoteImages: Array<TripNoteItemImage>
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
  tripNoteItemId: number
}
