export type MinimalUser = {
  id: string
  username: string
  fullname: string
  profilePic: string
}

export type PublicProfileUser = MinimalUser & {
  lastSeen: Date | null
  bio: string
}

export type SafeUser = PublicProfileUser & {
  createdAt: Date
  updatedAt: Date
}

export type SafeUserWithToken = SafeUser & {
  token: string
}
