import { useContext } from "react";
import { GeneralContext } from "../Context/GeneralContext";
const useValues = () => useContext(GeneralContext);

export default useValues;
