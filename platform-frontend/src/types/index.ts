// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginResponse extends Token {
  user: UserOut;
}

export interface TokenData {
  id?: number;
}

// User Types
export interface UserBase {
  username: string;
  email: string;
}

export interface UserCreate extends UserBase {
  password: string;
}

export interface UserOut extends UserBase {
  id: number;
  created_at: string;
}

// User Details Types
export interface UserDetails {
  name?: string;
  dob?: string;
  fav_driver?: string;
  fav_constructor?: string;
  country?: string;
}

export interface UserDetailsOut extends UserDetails {
  user_id: number;
  prediction_points?: number;
}

// F1 Data Types
export interface CurrentDriver {
  id: string;
  perm_number: number;
  code: string;
  full_name: string;
  dob: string;
  nationality: string;
  active: boolean;
  curr_points: number;
  curr_pos: number;
  curr_team: string;
}

export interface CurrentConstructor {
  id: string;
  name: string;
  nationality: string;
  curr_points: number;
  curr_pos: number;
}

// API Response Types
export interface ApiError {
  detail: string;
}

//new types

export interface F1Session {
  date: string;
  time: string;
}

export interface F1Circuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: {
    lat: string;
    long: string;
    locality: string;
    country: string;
  };
}

export interface F1Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: F1Circuit;
  date: string;
  time: string;
  FirstPractice?: F1Session;
  SecondPractice?: F1Session;
  ThirdPractice?: F1Session;
  Qualifying?: F1Session;
  Sprint?: F1Session;
  SprintQualifying?: F1Session;
}

export interface F1RacesResponse {
  MRData: {
    RaceTable: {
      season: string;
      Races: F1Race[];
    };
  };
}

export interface RaceProgress {
  race: F1Race;
  status: 'upcoming' | 'current' | 'completed';
  progress: number; // 0-100
  currentSession?: string;
  nextSession?: {
    name: string;
    date: Date;
  };
}