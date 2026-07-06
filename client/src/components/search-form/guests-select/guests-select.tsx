import { GuestSelectProps } from "../../../types/GuestSelect.types";
import Select from "../../select/select";
import "./guests-select.scss";

const GuestsSelect: React.FC<GuestSelectProps> = ({ onChange, value }) => {
  return (
    <Select
      onChange={(groupSize) => onChange(Number(groupSize))}
      value={value.toString()}
      options={Array.from({ length: 10 }).map((_, index) => ({
        label: `${index + 1} ${index + 1 > 1 ? "people" : "person"}`,
        value: (index + 1).toString(),
      }))}
    />
  );
};

export default GuestsSelect;
