import LoginPage from "./LoginPage";
import { useState } from "react";
import NotesPage from "./NotesPage";
import { UserData } from "./types";
import "./global.css";

function App() {
  const [userData, setUserData] = useState<UserData>();
  return userData ? (
    <NotesPage userData={userData} />
  ) : (
    <LoginPage setUserData={setUserData} />
  );
}
export default App;
