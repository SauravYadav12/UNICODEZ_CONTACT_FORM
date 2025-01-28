import React, { useState } from "react";
import ContactForm from "./ContactForm";
import Image from "../../components/contact-us/Image";

const ContactUs = () => {
  const [submissionStatus, setSubmissionStatus] = useState<boolean>();
  return (
    <div className="content">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="row align-items-center">
              <div className="col-lg-7 mb-5 mb-lg-0">
                <h2 className="mb-5">
                  Connect with us. <br /> It's easy.
                </h2>
                {!submissionStatus && (
                  <ContactForm
                    submissionStatus={submissionStatus}
                    onSubmitStatus={setSubmissionStatus}
                  />
                )}
                {submissionStatus && (
                  <div id="form-message-success" style={{padding:'20px 0px'}}>
                    <p>Your message was sent, thank you!</p>
                    <button
                      onClick={() => setSubmissionStatus(undefined)}
                      type="button"
                      className="btn btn-success rounded-0 py-2 px-4"
                    >
                      Resend
                    </button>
                  </div>
                )}
              </div>
              <div className="col-lg-4 ml-auto">
                <h3 className="mb-4">Let's talk about Us.</h3>
                <Image />
                <p>
                  Unicodez is a team of diverse software-development & global-IT
                  professionals. We provide software consulting services and
                  solutions for businesses and organizations all over the world!
                </p>
                <p>
                  <a href="https://www.unicodez.com/" target="_blank">
                    Read more
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
