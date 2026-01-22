import React, { useState, useEffect, useRef } from "react";
import { data, Link } from "react-router-dom";
import * as Yup from "yup";

import ProgressIndicator from "../components/ProgressIndicator";
import Btn from "../components/buttons/Btn";
import CancelBtn from "../components/buttons/CancelBtn";
import CTA from "../components/buttons/CTA";

import PersonalStep from "../components/resumeform_steps/PersonalStep";
import ResumeViewStep from "../components/resumeform_steps/ResumeViewStep";
import SocialStep from "../components/resumeform_steps/SocialStep";
import MiscStep from "../components/resumeform_steps/MiscStep";
import JobStep from "../components/resumeform_steps/JobStep";
import SchoolStep from "../components/resumeform_steps/SchoolStep";
import ProjectStep from "../components/resumeform_steps/ProjectStep";
import Confirmation from "../components/UsersMessages/Confirmation";
import Loader from "../components/Loaders/ResumeGeneratorLoader";

import styles from "./resumeform.module.css";

import { ChevronRight, ChevronLeft } from "lucide-react";
import ResumeTemplate from "../components/resumeform_steps/ResumeTemplate";

const ResumeForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showloader, setLoaderVisible] = useState(false);
  const [aiResumeData, setAiResumeData] = useState(null);

  const [formData, setFormData] = useState({
    /* ---PERSONAL INFO--- */
    step1: {
      fullname: "",
      email: "",
      phNum: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      summary: "",
    },

    /* ---SOCIAL INFO--- */
    step2: {
      linkedIn: "",
      github: "",
      portfolio: "",
    },

    /* ---MISC INFO--- */
    step3: {
      skills: "",
      technicalSkills: "",
      certs: "",
    },

    /* ---MAIN SECTIONS--- */
    step4: {
      jobs: [{ company: "", role: "", roleTime: "", jobDescription: "" }],
    },

    step5: {
      education: [{ school: "", degree: "", gradYear: "" }],
    },

    step6: {
      projects: [{ projTitle: "", projDesc: "", projLink: "" }],
    },
  });

  const submitForm = async () => {
    const safe3 = formData.step3 || [];

    const toArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === "string")
        return val
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      return [];
    };
    const payload = {
      ...formData,
      step3: {
        skills: toArray(safe3.skills),
        technicalSkills: toArray(safe3.technicalSkills),
        certs: toArray(safe3.certs),
      },
    };

    const response = await fetch("/api/form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
  };

  // pull info from user profile to prefill form
  useEffect(() => {
    fetch("/api/form", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (!data) return;

        const step3 = data.step3 || {};
        const formattedStep3 = {
          skills: Array.isArray(step3.skills)
            ? step3.skills.join(", ")
            : step3.skills || "",
          technicalSkills: Array.isArray(step3.technicalSkills)
            ? step3.technicalSkills.join(", ")
            : step3.technicalSkills || "",
          certs: Array.isArray(step3.certs)
            ? step3.certs.join(", ")
            : step3.certs || "",
        };

        setFormData((prev) => ({
          step1: { ...prev.step1, ...(data.step1 || {}) },
          step2: { ...prev.step2, ...(data.step2 || {}) },
          step3: { ...prev.step3, ...formattedStep3 },
          step4: { ...prev.step4, ...(data.step4 || {}) },
          step5: { ...prev.step5, ...(data.step5 || {}) },
          step6: { ...prev.step6, ...(data.step6 || {}) },
          aiResume: prev.aiResume || data.aiResume || "",
        }));
      })
      .catch((err) => {
        3;
      });
  }, []);

  //validation

  const personalValidation = Yup.object({
    fullname: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required"),
    // phNum: Yup.string().required("Phone Number is required"),
    // address: Yup.string().required('Address is required.'),
    // city: Yup.string().required("City is required."),
    // state: Yup.string().required('State is required.'),
    // zip: Yup.string().required('Zip code is required.'),
  });

  const socialValidation = Yup.object({
    // linkedIn: Yup.string().required("LinkedIn URL is required."),
    // github: Yup.string().required("GitHub URL is required."),
  });

  const miscValidation = Yup.object({
    // skills: Yup.string()
    //   .required("Skills cannot be empty.")
    //   .test(
    //     "is-array",
    //     "At least one skill required",
    //     (val) => val.split(",").filter((s) => s.trim()).length > 0,
    //   ),
    // languages: Yup.string()
    //   .required("Languages cannot be empty.")
    //   .test(
    //     "is-array",
    //     "At least one language required",
    //     (val) => val.split(",").filter((s) => s.trim()).length > 0,
    //   ),
    // interests: Yup.array()
    //   .of(Yup.string())
    //   .transform((value) => {
    //     if (!value) return [];
    //     if (typeof value === "string") {
    //       return value
    //         .split(",")
    //         .map((v) => v.trim())
    //         .filter(Boolean);
    //     }
    //     return value;
    //   })
    //   .optional(),

    certs: Yup.array()
      .of(Yup.string())
      .transform((value) => {
        if (!value) return [];
        if (typeof value === "string") {
          return value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
        }
        return value;
      })
      .optional(),
  });

  const jobValidation = Yup.object({
    // jobs: Yup.array()
    //   .of(
    //     Yup.object({
    //       company: Yup.string().required("Company Name is required."),
    //       role: Yup.string().required("Position name is required."),
    //       roleTime: Yup.string().required("Time period is required."),
    //     }),
    //   )
    //   .min(1, "At least one job is required.")
    //   .max(3, "Maximum of three jobs allowed."),
  });

  const schoolValidation = Yup.object({
    // education: Yup.array()
    //   .of(
    //     Yup.object({
    //       school: Yup.string().required("School name is required"),
    //       degree: Yup.string().required("Degree is required."),
    //     }),
    //   )
    //   .min(1, "At least one school is required.")
    //   .max(3, "Maximum of three schools allowed."),
  });

  const projectValidation = Yup.object({
    // none (even tho highly recommended to have at least one proj)
  });

  const validateStep = async () => {
    let schema;

    if (currentStep === 1) schema = personalValidation;
    if (currentStep === 2) schema = socialValidation;
    if (currentStep === 3) schema = miscValidation;
    if (currentStep === 4) schema = jobValidation;
    if (currentStep === 5) schema = schoolValidation;
    if (currentStep === 6) schema = projectValidation; // need this to progress

    try {
      await schema.validate(formData[`step${currentStep}`], {
        abortEarly: false,
      });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const formattedErrors = {};
      validationErrors.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [`step${currentStep}`]: {
        ...prev[`step${currentStep}`],
        [name]: value,
      },
    }));
  };

  const handleMiscChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      step3: {
        ...prev.step3,
        [name]: value,
      },
    }));
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const nextStep = async () => {
    if (currentStep < 7) {
      const isValid = await validateStep();
      if (!isValid) return;
      setCurrentStep(currentStep + 1);
    }
  };

  const saveProgress = async () => {
    try {
      const safeStep3 = formData.step3 || {};

      const toArray = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === "string")
          return val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        return [];
      };

      const payload = {
        ...formData,
        step3: {
          skills: toArray(safeStep3.skills),
          technicalSkills: toArray(safeStep3.technicalSkills),
          certs: toArray(safeStep3.certs),
        },
      };

      const response = await fetch("/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return data;
    } catch (error) {}
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["form-box"]}>
        <h1>Let's Build Your Resume!</h1>

        <ProgressIndicator currentStep={currentStep} />
        <div className={styles["prog-btn"]}>
          {currentStep > 1 ? (
            <Btn icon={<ChevronLeft />} onClick={prevStep} />
          ) : (
            <span className={styles.placeholder}></span>
          )}
          {currentStep < 6 && (
            <Btn icon={<ChevronRight />} onClick={nextStep} />
          )}
          {currentStep === 6 && (
            <Btn
              label={"Generate"}
              disabled={showloader}
              onClick={async () => {
                setLoaderVisible(true);

                try {
                  await submitForm();
                  const aiResponse = await fetch("/api/generate_resume", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(formData),
                  });
                  const aiData = await aiResponse.json();
                  console.log("AI API response", aiData);

                  if (aiData.resume_json) {
                    setAiResumeData(aiData.resume_json);
                  }
                  setCurrentStep(7);
                } catch (error) {
                } finally {
                  setLoaderVisible(false);
                }
              }}
            />
          )}
          {currentStep === 7 && <span className={styles.placeholder}></span>}
        </div>

          <div
            className={styles["resume-form-container"]}
            style={currentStep === 7 ? { width: "100%", maxWidth: "100%" } : {}}
          >
          <div className="resumeForm">
            {currentStep === 1 && (
              <PersonalStep
                formData={formData.step1}
                onChange={handleInputChange}
                errors={errors}
              />
            )}
            {currentStep === 2 && (
              <SocialStep
                formData={formData.step2}
                onChange={handleInputChange}
                errors={errors}
              />
            )}
            {currentStep === 3 && (
              <MiscStep
                formData={formData.step3}
                onChange={handleMiscChange}
                errors={errors}
              />
            )}
            {currentStep === 4 && (
              <JobStep
                formData={formData.step4}
                onChange={handleInputChange}
                errors={errors}
              />
            )}
            {currentStep === 5 && (
              <SchoolStep
                formData={formData.step5}
                onChange={handleInputChange}
                errors={errors}
              />
            )}
            {currentStep === 6 && (
              <ProjectStep
                formData={formData.step6}
                onChange={handleInputChange}
                errors={errors}
              />
            )}

            {currentStep === 7 && (
              <ResumeViewStep
                backendData={formData}
                AIresponse={aiResumeData}
              />
            )}
          </div>

          <div className={styles["back-btn"]}>
            {currentStep === 7 ? (
              <CTA
                label={"Back To Dashboard"}
                onClick={async () => {
                  await saveProgress();
                  window.location.href = "/dev_dashboard";
                }}
              />
            ) : (
              <CTA
                label={"Save progress for later"}
                onClick={async () => {
                  await saveProgress();
                  window.location.href = "/dev_dashboard";
                }}
              />
            )}
          </div>
        </div>
      </div>

      {showloader && <Loader />}
    </div>
  );
};

export default ResumeForm;
