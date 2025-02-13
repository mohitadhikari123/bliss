import axios from "axios";
import { Page } from "@/types";
const API_BASE_URL = "http://localhost:3000/api";

const mock = true;

interface RegisterData {
  user: {
    name: string;
    email: string;
    mobile: string;
  };
}
interface AddCustomerData {
  data: {
    REMINDER_TIME: string;
  };
}
const RegisterPOST = async ({ user }: RegisterData) => {
  console.log("JSON.stringify({ user, data })", JSON.stringify({ user }));
  const config = {
    method: "post",
    url: `${API_BASE_URL}/customers/register`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ user }),
  };
  try {
    const response = await axios(config);
    window.localStorage.setItem("accessToken", response.data.data.accessToken);
    // console.log(JSON.stringify(response.data.data.accessToken));
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      throw new Error("The request took too long. Please try again later.");
    } else {
      throw new Error("An error occurred: " + error.message);
    }
  }
};
const LiveSessionRequestPOST = async () => {
  const config = {
    method: "post",
    url: `${API_BASE_URL}/liveSessionRequest/create`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  try {
    const response = await axios(config);
    window.localStorage.setItem("LiveRequestId", response.data.data._id);
    // console.log(JSON.stringify(response.data));
    return response; // Return the response object
  } catch (error) {
    console.log(error);
    throw error; // Ensure errors are thrown so they can be caught
  }
};

const LiveSessionRequestGET = async () => {
  const config = {
    method: "get",
    url: `${API_BASE_URL}/liveSessionRequest/getStatus?lsId=${localStorage.getItem(
      "LiveRequestId"
    )}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };

  try {
    const response = await axios(config);
    // console.log(JSON.stringify(response.data.data.rs));
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const ChangeStatusPOST = async () => {
  const config = {
    method: "post",
    url: `${API_BASE_URL}/liveSessionRequest/changeStatus?lsId=${localStorage.getItem(
      "LiveRequestId"
    )}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
  try {
    const response = await axios(config);
    window.localStorage.setItem("LiveRequestStatus", response.data.data.rs);
    // console.log(JSON.stringify(response.data));
    return response.data.data.rs; // Return the response object
  } catch (error) {
    console.log(error);
    throw error; // Ensure errors are thrown so they can be caught
  }
};

const AgoraTokenGET = async (lsId: string) => {
  const config = {
    method: "post",
    url: `${API_BASE_URL}/liveSessionRequest/getAgoraToken`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    data: JSON.stringify({ lsId }), 

  };
  try {
    const response = await axios(config);

    // console.log(JSON.stringify(response.data.data.agoraToken));
    return response; // Return the response
  } catch (error) {
    console.log(error);
    throw error; // Rethrow the error so the calling code can handle it
  }
};
const CreateLivePOST = async (lsId: string) => {
  const config = {
    method: "post",
    url: `${API_BASE_URL}/liveSessionRequest/liveSession/create`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    data: JSON.stringify({ lsId }), 

  };
  try {
    const response = await axios(config);
    return response; // Return the response
  } catch (error) {
    console.log(error);
    throw error; // Rethrow the error so the calling code can handle it
  }
};
const GetLivePOST = async (lsId: string | null) => {
  const config = {
    method: "get",
    url: `${API_BASE_URL}/liveSessionRequest/liveSession/getLiveSession?lsId=${lsId}`, 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };

  try {
    const response = await axios(config);
    return response; // Return the response
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const EndSessionPOST = async (lsId: string) => {
  const config = {
    method: "post",
    url: `${API_BASE_URL}/liveSessionRequest/liveSession/endSession`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
        data: JSON.stringify({ lsId }), 

  };

  try {
    const response = await axios(config);
    window.localStorage.removeItem("agoraToken");
    window.localStorage.removeItem("LiveSessionId");
    window.localStorage.removeItem("LiveRequestStatus");
    window.localStorage.removeItem("LiveRequestId");
    console.log(JSON.stringify(response.data));

    return response; // Return the response object
  } catch (error) {
    console.log(error);
    throw error; // Ensure errors are thrown so they can be caught
  }
};

const LoginPOST = async (email: string, password: string) => {
  const data = JSON.stringify({
    email: email,
    password: password,
  });
  console.log("data", data);
  const config = {
    method: "post",
    url: `${API_BASE_URL}/customers/login`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
    timeout: 10000,
  };

  try {
    const response = await axios(config);
    console.log(JSON.stringify(response.data.data.rs));
    return response; // Return the response object
  } catch (error) {
    console.log(error);
    console.log(error);
    throw error; // Ensure errors are thrown so they can be caught
  }
};

export {
  RegisterPOST,
  LoginPOST,
  LiveSessionRequestPOST,
  LiveSessionRequestGET,
  CreateLivePOST,
  AgoraTokenGET,
  EndSessionPOST,
  ChangeStatusPOST,
  GetLivePOST
};

export const fetchPages = async (): Promise<Page[]> => {
  if (mock) {
    return [
      {
        id: "1",
        slug: "",
        title: "Learn German Anywhere, Anytime",
        description: "On-Demand German speakers available 24/7",
        type: "HOME",
        questions: [
          {
            id: "1",
            text: "Question 1",
            type: "SELECT_BUTTON",
            options: {
              yes: "Yes",
              no: "No",
            },
          },
          {
            id: "2",
            text: "Question 2",
            type: "SELECT_BUTTON",
            options: {
              yes: "Yes",
              no: "No",
            },
          },
        ],
      },
      {
        id: "2",
        slug: "try-demo-now",
        title: "First Class is Free!!",
        description:
          "Do You have 15 minute of time to take class over a Audio only Call.",
        type: "SECOND",
        questions: [
          {
            id: "1",
            text: "Question 1",
            type: "SELECT_BUTTON",
            options: {
              yes: "Yes",
              no: "No",
            },
          },
          {
            id: "2",
            text: "Question 2",
            type: "SELECT_BUTTON",
            options: {
              yes: "Yes",
              no: "No",
            },
          },
        ],
      },

      {
        id: "3",
        slug: "live-session",
        title: "Continue",
        description: "Connecting to Your German Tutor",
        type: "THIRD",
        questions: [
          {
            id: "1",
            text: "Question 1",
            type: "SELECT_BUTTON",
            options: {
              yes: "Yes",
              no: "No",
            },
          },
          {
            id: "2",
            text: "Question 2",
            type: "SELECT_BUTTON",
            options: {
              yes: "Yes",
              no: "No",
            },
          },
        ],
      },
      {
        id: "4",
        slug: "buy-plans",
        title: "Continue",
        description: "Connecting to Your German Tutor",
        type: "ZERO",
        questions: [
          {
            id: "1",
            text: "Question 1",
            type: "SELECT_BUTTON",
            options: {
              yes: "Yes",
              no: "No",
            },
          },
          {
            id: "2",
            text: "Question 2",
            type: "SELECT_BUTTON",
            options: {
              yes: "Yes",
              no: "No",
            },
          },
        ],
      },
      {
        id: "5",
        slug: "maybe-later",
        title: "Continue",
        description: "Connecting to Your German Tutor",
        type: "MBL",
        questions: [
          {
            id: "1",
            text: "Question 1",
            type: "SELECT_BUTTON",
            options: {
              yes: "Yes",
              no: "No",
            },
          },
          {
            id: "2",
            text: "Question 2",
            type: "SELECT_BUTTON",
            options: {
              yes: "Yes",
              no: "No",
            },
          },
        ],
      },
      {
        id: "6",
        slug: "login",
        title: "Continue",
        description: "Connecting to Your German Tutor",
        type: "LOGIN",
        questions: [
          {
            id: "1",
            text: "Question 1",
            type: "SELECT_BUTTON",
            options: {
              yes: "Yes",
              no: "No",
            },
          },
          {
            id: "2",
            text: "Question 2",
            type: "SELECT_BUTTON",
            options: {
              yes: "Yes",
              no: "No",
            },
          },
        ],
      },
    ];
  }
  const response = await axios.get(`${API_BASE_URL}/pages`);
  return response.data;
};

export const saveAnswers = async (
  pageId: string,
  answers: Record<string, string>
): Promise<void> => {
  console.log("SaveAnswer   : ", answers);

  if (mock) {
    return;
  }
  await axios.post(`${API_BASE_URL}/pages/${pageId}/answers`, answers);
};
