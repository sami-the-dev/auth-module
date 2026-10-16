export interface User {
  id: string
  email: string
  name: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

export interface SignUpRequest {
  email: string
  name: string
  password: string
}

export interface SignInRequest {
  email: string
  password: string
}
