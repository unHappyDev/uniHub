import { NextResponse } from "next/server";

function setNoCache(response: NextResponse) {
  response.headers.set(
    "Cache-Control",
    "no-cache, no-store, max-age=0, must-revalidate",
  );
}

function setMaxAge(response: NextResponse, maxAge: number = 10) {
  response.headers.set(
    "Cache-Control",
    `public, s-maxage=${maxAge.toString()}, stale-while-revalidate`,
  );
}

export default Object.freeze({
  setNoCache,
  setMaxAge,
});
