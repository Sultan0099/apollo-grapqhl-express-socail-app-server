import dev from "./dev";
import prod from "./prod";


declare var process: {
  env: {
    NODE_ENV: string
  }
}



const keys = process.env["NODE_ENV"].trim() === "production" ? { ...prod } : { ...dev };




export default keys;