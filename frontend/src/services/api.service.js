const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

async function request(method, endpoint, body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Error en la solicitud");
  }
  return data;
}

// ── Pacientes ──────────────────────────────────────────────────────────────
export const patientService = {
  getAll:    ()         => request("GET",    "/patients"),
  getById:   (id)       => request("GET",    `/patients/${id}`),
  create:    (payload)  => request("POST",   "/patients", payload),
  update:    (id, data) => request("PUT",    `/patients/${id}`, data),
  delete:    (id)       => request("DELETE", `/patients/${id}`),
};

// ── Citas ──────────────────────────────────────────────────────────────────
export const appointmentService = {
  getAll:    ()         => request("GET",    "/appointments"),
  getById:   (id)       => request("GET",    `/appointments/${id}`),
  create:    (payload)  => request("POST",   "/appointments", payload),
  update:    (id, data) => request("PUT",    `/appointments/${id}`, data),
  delete:    (id)       => request("DELETE", `/appointments/${id}`),
};

// ── Doctores ───────────────────────────────────────────────────────────────
export const doctorService = {
  getAll: () => request("GET", "/doctors"),
};
