import { ROUTES } from "@/config/api-config";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface LogData {
  userAgent?: string;
  origin?: string;
  error?: {
    stack?: string;
    message?: string;
    name?: string;
  };
  userAgentData?: string;
  vendorSub?: string;
  vendor?: string;
  platform?: string;
  deviceMemory?: string;
}

interface CreateLogVariables {
  type: string;
  data: LogData;
  message: string;
  route: string;
}
interface CreateLogResponse {
  id: string;
  userId?: string;
  email?: string;
  code?: string;
  method?: string;
  route?: string;
  message: string;
  data: string;
  timestamp: string;
  type: string;
}

export const useCreateLog = () => {
  const createLog = async (data: CreateLogVariables) => {
    const response = await axios.post(ROUTES.UTIL.LOGS, data);

    return response.data.data;
  };
  return useMutation<CreateLogResponse, Error, CreateLogVariables>({
    mutationFn: createLog,
  });
};
