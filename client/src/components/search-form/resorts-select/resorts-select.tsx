import Select from "../../select/select";
import destinations from "../../../data/destinations.json";
import { ResortsSelectProps } from "../../../types/ResortSelect.types";

const ResortsSelect: React.FC<ResortsSelectProps> = ({ onChange, value }) => {
  return (
    <Select
      onChange={(resortId) => onChange(Number(resortId))}
      value={value.toString()}
      options={destinations.map((dest) => ({
        label: dest.name,
        value: dest.id.toString(),
      }))}
    />
  );
};

export default ResortsSelect;
