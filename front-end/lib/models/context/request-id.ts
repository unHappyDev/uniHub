import { v4 as uuidv4 } from "uuid";

function getRequestIdFromRequest(request: Request) {
  return request.headers.get("x-vercel-id") || uuidv4();
}

const requestId = {
  getRequestIdFromRequest,
};

export default requestId;
