import React, { useEffect } from "react";
import { OnChangeParameter } from "../../../pages/contact-us/ContactForm";
import { City } from "country-state-city";
import { IFormData } from "../../../pages/contact-us/constants";

const CityField = ({ country, value, disabled, onChange, onBlur }: IProps) => {
  const myCities = City.getCitiesOfCountry(country);

  useEffect(() => {
    onChange({ target: { value: "", name: "city" } } as any);
  }, [country]);

  return (
    <>
      {myCities?.length ? (
        <select
          disabled={disabled}
          value={value}
          onChange={(e) => {
            onChange(e);
            onBlur("city",e.target.value);
          }}
          onBlur={() => onBlur("city")}
          name="city"
          id="city"
          className="form-control"
        >
          <option value={""}> City</option>
          {myCities?.map((city, i) => {
            return (
              <option key={i} value={city.name} id={city.name}>
                {city.name}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          required
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
      )}
    </>
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
