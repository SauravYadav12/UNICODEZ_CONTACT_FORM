import React, { useEffect } from "react";
import { OnChangeParameter } from "../../../pages/contact-us/ContactForm";
import { IFormData } from "../../../pages/contact-us/constants";

const CityField = ({ country, value, disabled, onChange, onBlur }: IProps) => {
  useEffect(() => {
    onChange({ target: { value: "", name: "city" } } as any);
  }, [country]);

  return (
    <input
      disabled={disabled}
      type="text"
      className="form-control"
      onBlur={() => onBlur("city")}
      name="city"
      id="city"
      placeholder="City"
      onChange={onChange}
      value={value}
    />
  );
};

export default CityField;

interface IProps {
  country: string;
  value: string;
  disabled: boolean;
  onChange: (e: OnChangeParameter) => void;
  onBlur: (fieldName: keyof IFormData, value?: string) => void;
}
