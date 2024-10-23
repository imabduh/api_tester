import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = "http://localhost:3001";

export let options = {
  vus: 100,
  duration: "10s",
};

export default function () {
  let res = http.get(`${BASE_URL}/`);
  check(res, {
    "GET / should return 200": (r) => r.status === 200,
  });

  const payload = JSON.stringify({ name: "Test Data" });
  res = http.post(`${BASE_URL}/`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  check(res, {
    "POST / should return 201": (r) => r.status === 201,
  });

  res = http.get(`${BASE_URL}/1`);
  check(res, {
    "GET /1 should return 200": (r) => r.status === 200,
  });

  const updatePayload = JSON.stringify({ name: "Updated Data" });
  res = http.put(`${BASE_URL}`, updatePayload, {
    headers: { "Content-Type": "application/json" },
  });
  check(res, {
    "PUT should return 200": (r) => r.status === 200,
  });

  res = http.del(`${BASE_URL}`);
  check(res, {
    "DELETE should return 204": (r) => r.status === 204,
  });

  sleep(1);
}
