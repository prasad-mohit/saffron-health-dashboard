import { useEffect, useState } from "react";

export default function usePatients(fileName = "patient.json") {
  const [patients, setPatients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/data/${fileName}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load JSON");
        return res.json();
      })
      .then((data) => {
        // If JSON is { patients: [..] }
        const arr = data.patients || [];
        setPatients(arr);
        setLoading(false);
      })
      .catch((err) => {
        console.error("DATA ERROR:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [fileName]);

  return { patients, loading, error };
}
