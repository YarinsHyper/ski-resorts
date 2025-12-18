import { Dispatch, SetStateAction } from "react";
import { Hotel } from "./hotel.types";

export interface NavBarProps {
  setHotels: Dispatch<SetStateAction<Hotel[]>>;
  setError: Dispatch<SetStateAction<string | undefined>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
}
