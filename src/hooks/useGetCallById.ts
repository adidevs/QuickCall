import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);
  const { status } = useSession();
  const client = useStreamVideoClient();

  useEffect(() => {
    if (status != "authenticated") return;
    if (!client) return;

    const loadCall = async () => {
      const { calls } = await client.queryCalls({
        filter_conditions: {
          id,
        },
      });

      if (calls.length > 0) setCall(calls[0]);
      setIsCallLoading(false);
    };
    loadCall();
  }, [client, id, status]);

  return { call, isCallLoading, status };
};
