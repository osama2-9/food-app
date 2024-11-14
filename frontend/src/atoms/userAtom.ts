import { atom } from "recoil";
import { User } from "../types/User"
const userAtom = atom<User | null>({
  key: "userAtom",
  default: JSON.parse(localStorage.getItem("user") || "null"),
});

export default userAtom;
