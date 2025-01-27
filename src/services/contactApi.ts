import axios from "axios";
import { IFormData } from "../pages/contact-us/constants";

const BASE_URL: any = import.meta.env.VITE_API_BASE_URL;

export async function createContact(body: IFormData) {
  let headers: any = {
    "Content-Type": "application/json",
  };
  const response = await axios.post<IFormData>(`${BASE_URL}/sales-leads`, body, {
    headers,
  });
  return response;
}
