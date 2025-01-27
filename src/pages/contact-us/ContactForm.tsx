import React, { useEffect, useState } from "react";
import { Country } from "country-state-city";

import CityField from "../../components/contact-us/formFields/CityField";
import { CustomValidator, IFormData, initialValues } from "./constants";
import { CountryCode, getExampleNumber } from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";
import { createContact } from "../../services/contactApi";
interface Iprops {
  submissionStatus?: boolean;
  onSubmitStatus: (val: boolean) => void;
}
const ContactForm = ({ submissionStatus, onSubmitStatus }: Iprops) => {
  const [state, setState] = useState<IFormData>(
    JSON.parse(JSON.stringify(initialValues))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneCode, setPhoneCode] = useState("91");
  const [phoneNumberMaxLength, setPhoneNumberMaxLength] = useState(10);

  const [errors, setErrors] = useState(initialValues);

  const validateField = (fieldName: keyof IFormData, value?: string) => {
    const validator = CustomValidator.find((f) => f.fieldName === fieldName);
    let message = "";
    const val =
      fieldName === "phone" && state.phone.length
        ? `+${phoneCode}${state[fieldName]}`
        : state[fieldName];
    if (validator && !validator.validate(value || val)) {
      message = `${validator.label} is not valid`;
    }
    setErrors((pre) => ({
      ...pre,
      [fieldName]: message,
    }));
    return !message.length;
  };

  const onBlur = (fieldName: keyof IFormData) => {
    validateField(fieldName);
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
      const phone = state.phone.length ? `+${phoneCode} ${state.phone}` : "";
      const { data } = await createContact({
        ...state,
        phone,
      });
      console.log(data)
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
  };

  const initState = () => {
    const copyState: IFormData = JSON.parse(JSON.stringify(initialValues));
    copyState.country = "IN";
    setState(copyState);
  };

  const onChangePhoneCode = (phoneCode: string) => {
    const countryCode = Country.getAllCountries().find(
      (c) => c.phonecode === phoneCode
    )?.isoCode as CountryCode;
    if (!countryCode) return;
    const domeNumber = getExampleNumber(countryCode, examples)
      ?.formatInternational()
      .split(" ")
      .slice(1)
      .join()
      .split(",")
      .join("");
    domeNumber?.length && setPhoneNumberMaxLength(domeNumber.length);
  };

  useEffect(() => {
    initState();
  }, []);
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
            required
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
            required
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
            required
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
        <div className="col-3 form-group pr-0">
          <select
            disabled={isSubmitting}
            value={phoneCode}
            onChange={(e) => {
              setPhoneCode(e.target.value);
              onChangePhoneCode(e.target.value);
              state.phone.length &&
                validateField("phone", `+${e.target.value} ${state.phone}`);
            }}
            name="phoneCode"
            id="phoneCode"
            className="form-control"
          >
            {Country.sortByIsoCode(Country.getAllCountries()).map(
              (country, i) => {
                return (
                  <option key={i} value={country.phonecode}>
                    {country.isoCode} {country.phonecode}
                  </option>
                );
              }
            )}
          </select>
          <label
            htmlFor="phoneCode"
            id="phoneCode-error"
            className="error"
          ></label>
        </div>
        <div className="col-9 form-group">
          <input
            disabled={isSubmitting}
            type="text"
            className="form-control"
            name="phone"
            id="phone"
            maxLength={phoneNumberMaxLength}
            placeholder="Phone"
            onChange={onChange}
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
            required
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
            required
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
          {submissionStatus === false && 
          <span className="submitting">Oops something went wrong!</span>}
        </div>
      </div>
    </form>
  );
};

export default ContactForm;

export type OnChangeParameter = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;
