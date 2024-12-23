import { atom } from "recoil";
interface Resturant {
    rid: string
}

const resturantAtom = atom<Resturant | null>({
    key: "resturantAtom",
    default: JSON.parse(localStorage.getItem("Rid") || "null")


})

export default resturantAtom
