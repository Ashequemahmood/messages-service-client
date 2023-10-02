import { postgres } from "../deps.js";

let sql;
if (Deno.env.get("DATABASE-URL")) {
  sql = postgres(Deno.env.get("DATABASE-URL"));
} else {
  sql = postgres({});
}

export { sql };