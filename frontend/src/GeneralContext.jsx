import { createContext, useState } from "react";

const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const postTypes = ["Notes", "Previous Year Papers", "Others"];
  const departments = [
    "Computer Science",
    "Physics",
    "Chemestry",
    "Zoology",
    "Electronics",
    "Math",
    "Botany",
    "ITM",
    "Others",
  ];
  const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  return (
    <GeneralContext.Provider
      value={{ user, setUser, postTypes, departments, semesters }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export { GeneralContext, GeneralContextProvider };
