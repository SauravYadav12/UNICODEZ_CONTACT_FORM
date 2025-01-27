import { phone } from "phone";
export const initialValues: IFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  message: "",
};
export const CustomValidator: FormFieldValidator[] = [
  {
    fieldName: "firstName",
    label: "First name",
    validate: (val) => !!val,
  },
  {
    fieldName: "lastName",
    label: "Last name",
    validate: (val) => !!val,
  },
  {
    fieldName: "email",
    label: "Email",
    validate: (val) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    },
  },
  {
    fieldName: "phone",
    label: "Phone",
    validate: (val) => {
      return !val || phone(val).isValid;
    },
  },
  {
    fieldName: "country",
    label: "Country",
    validate: (val) => !!val,
  },
  {
    fieldName: "city",
    label: "City",
    validate: (val) => !!val,
  },
  {
    fieldName: "message",
    label: "Message",
    validate: (val) => !!val,
  },
];

export interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  message: string;
}

interface FormFieldValidator {
  fieldName: keyof IFormData;
  label: string;
  validate: (val: string) => boolean;
}
