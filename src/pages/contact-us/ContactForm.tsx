import React, { useEffect, useState } from "react";
import { Country } from "country-state-city";

import CityField from "../../components/contact-us/formFields/CityField";
import { CustomValidator, IFormData, initialValues } from "./constants";
import { CountryCode, getExampleNumber } from "libphonenumber-js";
import parsePhoneNumber from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";
import { createContact } from "../../services/contactApi";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
interface Iprops {
  submissionStatus?: boolean;
  onSubmitStatus: (val: boolean) => void;
}
const ContactForm = ({ submissionStatus, onSubmitStatus }: Iprops) => {
  const [state, setState] = useState<IFormData>(
    JSON.parse(JSON.stringify(initialValues))
  );
  const [errors, setErrors] = useState<IFormData>(
    JSON.parse(JSON.stringify(initialValues))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneNumberMaxLength, setPhoneNumberMaxLength] = useState(15);

  const validateField = (
    fieldName: keyof IFormData,
    value?: string,
    apply = true
  ) => {
    const validator = CustomValidator.find((f) => f.fieldName === fieldName);
    let message = "";
    const val = state[fieldName];
    if (validator && !validator.validate(value || val)) {
      message = `${validator.label} is not valid`;
    }
    apply &&
      setErrors((pre) => ({
        ...pre,
        [fieldName]: message,
      }));
    return !message.length;
  };

  const onBlur = (fieldName: keyof IFormData, v?: string) => {
    validateField(fieldName, v);
  };

  const validateForm = () => {
    let isValid = true;
    for (const fieldName of Object.keys(state)) {
      if (!validateField(fieldName as keyof IFormData)) {
        isValid = false;
      }
    }
    return isValid;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const phone = parsePhoneNumber(state.phone)?.formatInternational() || "";
      const { data } = await createContact({
        ...state,
        phone,
      });
      console.log(data);
      onSubmitStatus(true);
    } catch (error) {
      console.log(error);
      onSubmitStatus(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChange = (e: OnChangeParameter) => {
    setState((pre) => {
      return { ...pre, [e.target.name]: e.target.value };
    });
    if (
      errors[e.target.name as keyof IFormData] &&
      validateField(e.target.name as any, e.target.value, false)
    ) {
      validateField(e.target.name as any, e.target.value);
    }
  };

  const initState = () => {
    const copyState: IFormData = JSON.parse(JSON.stringify(initialValues));
    copyState.country = "IN";
    setState(copyState);
    setErrors(JSON.parse(JSON.stringify(initialValues)));
    setPhoneNumberMaxLength(15);
  };

  const onChangePhoneCode = (code?: CountryCode) => {
    if (!code) return;
    const domeNumber = getExampleNumber(code, examples)?.formatInternational();
    domeNumber?.length && setPhoneNumberMaxLength(domeNumber.length);
    onChange({ target: { value: code, name: "country" } } as any);
  };
  useEffect(() => {
    initState();
  }, []);
  console.log("keeej");
  return (
    <form
      onSubmit={onSubmit}
      className="border-right pr-5 mb-5"
      id="contactForm"
      name="contactForm"
    >
      <div className="row">
        <div className="col-md-6 form-group">
          <input
            type="text"
            className="form-control"
            name="firstName"
            id="firstName"
            placeholder="First name"
            onChange={onChange}
            onBlur={() => onBlur("firstName")}
            value={state.firstName}
            disabled={isSubmitting}
          />
          {!!errors.firstName && (
            <label htmlFor="firstName" id="firstName-error" className="error">
              {errors.firstName}
            </label>
          )}
        </div>
        <div className="col-md-6 form-group">
          <input
            type="text"
            className="form-control"
            name="lastName"
            id="lastName"
            placeholder="Last name"
            onChange={onChange}
            onBlur={() => onBlur("lastName")}
            value={state.lastName}
            disabled={isSubmitting}
          />
          {!!errors.lastName && (
            <label htmlFor="lastName" id="lastName-error" className="error">
              {errors.lastName}
            </label>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 form-group">
          <input
            type="text"
            className="form-control"
            name="email"
            id="email"
            placeholder="Email"
            onChange={onChange}
            onBlur={() => onBlur("email")}
            value={state.email}
            disabled={isSubmitting}
          />
          {!!errors.email && (
            <label htmlFor="email" id="email-error" className="error">
              {errors.email}
            </label>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 form-group">
          <PhoneInput
            numberInputProps={{ style: { outline: "none", border: "none" } }}
            onCountryChange={(c) => onChangePhoneCode(c)}
            international
            defaultCountry={"IN"}
            disabled={isSubmitting}
            type="text"
            className="form-control"
            name="phone"
            id="phone"
            maxLength={phoneNumberMaxLength}
            placeholder="Phone"
            onChange={(value) =>
              onChange({ target: { value: value || "", name: "phone" } } as any)
            }
            onBlur={() => onBlur("phone")}
            value={state.phone}
          />
          {!!errors.phone && (
            <label htmlFor="phone" id="phone-error" className="error">
              {errors.phone}
            </label>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 form-group">
          <select
            disabled={isSubmitting}
            value={state.country}
            onChange={onChange}
            onBlur={() => onBlur("country")}
            name="country"
            id="country"
            className="form-control"
          >
            {Country.getAllCountries().map((country, i) => {
              return (
                <option key={i} value={country.isoCode}>
                  {country.name} ({country.isoCode})
                </option>
              );
            })}
          </select>

          {!!errors.country && (
            <label htmlFor="country" id="country-error" className="error">
              {errors.country}
            </label>
          )}
        </div>
        <div className="col-md-6 form-group">
          <CityField
            disabled={isSubmitting}
            value={state.city}
            country={state.country}
            onBlur={onBlur}
            onChange={onChange}
          />
          {!!errors.city && (
            <label htmlFor="city" id="city-error" className="error">
              {errors.city}
            </label>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 form-group">
          <textarea
            disabled={isSubmitting}
            minLength={5}
            className="form-control"
            name="message"
            id="message"
            cols={30}
            rows={7}
            placeholder="Write your message"
            onChange={onChange}
            onBlur={() => onBlur("message")}
            value={state.message}
          ></textarea>
          {!!errors.message && (
            <label htmlFor="message" id="message-error" className="error">
              {errors.message}
            </label>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 pt-3">
          <button
            onClick={() => validateForm()}
            disabled={isSubmitting}
            type="submit"
            className="btn btn-primary rounded-0 py-2 px-4"
          >
            {!isSubmitting ? (
              <>
                {submissionStatus === undefined && "Send Message"}
                {submissionStatus === false && "Try again"}
              </>
            ) : (
              <>
                <div
                  className="spinner-border text-secondry"
                  style={{ width: "1rem", height: "1rem" }}
                  role="status"
                >
                  <span className="visually-hidden"></span>
                </div>
                <span className="pl-2">Sending</span>
              </>
            )}
          </button>
          {submissionStatus === false && (
            <span className="submitting">Oops something went wrong!</span>
          )}
        </div>
      </div>
    </form>
  );
};

export default ContactForm;

export type OnChangeParameter = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;
