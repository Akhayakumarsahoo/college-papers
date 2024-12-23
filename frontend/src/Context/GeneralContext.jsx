import { createContext, useState } from "react";

const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  //User
  const [user, setUser] = useState(null);
  //Lists
  const postTypes = ["Notes", "PYQs", "Others"];
  const departments = [
    "Comp.Sc",
    "Physics",
    "Chemistry",
    "Zoology",
    "Electronics",
    "Math",
    "Botany",
    "ITM",
    "Others",
  ];
  const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  //Batch year lists
  const currYear = new Date().getFullYear();
  const lastYear = currYear + 5;
  const startYear = currYear - 15;

  const years = [];
  for (let year = startYear; year <= lastYear; year++) {
    years.push(year);
  }
  return (
    <GeneralContext.Provider
      value={{
        user,
        setUser,
        postTypes,
        departments,
        semesters,
        years,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export { GeneralContext, GeneralContextProvider };
