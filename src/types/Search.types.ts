export interface SearchData {
  destination: number;
  groupSize: number;
  startDate: string; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd
}

export interface SearchProps {
  onSearch: (formData: SearchData) => void;
  isLoading: boolean;
}
