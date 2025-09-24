// utils/hooks/useProspectiveClient.ts
import { useState } from "react";
import { createProspectiveClient, ProspectiveClientData } from "@/utils/api";

export function useProspectiveClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitClient = async (data: ProspectiveClientData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createProspectiveClient(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, submitClient };
}
