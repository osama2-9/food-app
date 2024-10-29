import { atom } from "recoil";

const userAtom = atom<string | null>({
  key: "userAtom",
  default: JSON.parse(localStorage.getItem("user") || "null"),
});

export default userAtom;
