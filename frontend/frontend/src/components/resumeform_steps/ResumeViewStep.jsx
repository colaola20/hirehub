import React, { useEffect, useState, useRef } from "react";
import style from "./resumeview.module.css";
import Btn from "../buttons/Btn";
import ResumeTemplate from "./ResumeTemplate";
import { useNavigate } from "react-router-dom";

const ResumeViewStep = ({ backendData = null , AIresponse  = null}) => {
  const [aiResumeHTML, setAiResumeHTML] = useState(
    backendData.aiResumeText || "",
  );
  const [savingToStorage, setSavingToStorage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorDescription, setErrorDescription] = useState("");

  const resumeRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const navigate = useNavigate();


  const goToJobDashboard = () => {
    navigate("/dev-dashboard");
  };

const normalizeResumeData = (data) => {

  const toArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    
    return val.split(",").map(v => v.trim()).filter(Boolean);
  }
  return [];
};


  return {
    step1: {
      fullname: data.step1?.fullname || "",
      email: data.step1?.email || "",
      phNum: data.step1?.phNum || "",
      address: data.step1?.address || "",
      city: data.step1?.city || "",
      state: data.step1?.state || "",
      zipcode: data.step1?.zipcode || "",
    },

    step2: {
      linkedIn: data.step2?.linkedIn || "",
      github: data.step2?.github || "",
      portfolio: data.step2?.portfolio || "",
    },

    step3: {
      technicalSkills: toArray(data.step3?.technicalSkills),
      skills: toArray(data.step3?.skills),
      certs: toArray(data.step3?.certs),
    },

    step4: {
      jobs: (data.step4?.jobs || []).map((j) => ({
        company: j.company || "",
        role: j.role || "",
        roleTime: j.roleTime || "",
        jobDescription: j.jobDescription || "",
      })),
    },

    step5: {
      education: (data.step5?.education || []).map((e) => ({
        school: e.school || "",
        degree: e.degree || "",
        gradYear: e.gradYear || "",
      })),
    },

    step6: {
      projects: (data.step6?.projects || []).map((p) => ({
        projTitle: p.projTitle || "",
        projDesc: p.projDesc || "",
        projLink: p.projLink || "",
      })),
    },
  };
};

 const normalizedResume = normalizeResumeData(backendData);
 


  // Save to AWS S3 storage
  const saveToStorage = async () => {
    setSavingToStorage(true);
    setShowError(false);
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      const res = await fetch("/api/save-resume-to-storage", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(backendData),
      });


      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || errorData.details || "Failed to save resume",
        );
      }

      const data = await res.json();
      setSuccessMessage(
        data.message || "Resume saved to document storage successfully!",
      );
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      setErrorTitle("Save failed");
      setErrorDescription(error.message);
      setShowError(true);
    } finally {
      setSavingToStorage(false);
    }
  };

  // const newTab = () => {
  //   const resumeElement = document.getElementById("resume-container");
  //   if (!resumeElement) return;

  //   const newWindow = window.open("", "_blank");

  //   if (!newWindow) return;

  //   const styles = Array.from(
  //     document.querySelectorAll("link[rel='stylesheet'], style"),
  //   )
  //     .map((style) => style.outerHTML)
  //     .join("\n");

  //   newWindow.document.write(`
  //       <html>
  //           <head>
  //               <title>Resume Preview</title>
  //               ${styles}
  //               <style>
  //                   html, body {
  //                       margin: 0;
  //                       padding: 0;
  //                       height: 100%;
  //                       width: 100%;
  //                   }
  //                   body {
  //                       display: flex;
  //                       justify-content: center;
  //                       align-items: flex-start;
  //                       background: #f0f0f0;
  //                       overflow: auto;
  //                   }
  //                   #resume-container {
  //                       margin: 20px;
  //                   }
  //               </style>
  //           </head>
  //           <body>
  //               ${resumeElement.outerHTML}
  //           </body>
  //       </html>
  //   `);

  //   newWindow.document.close();
  // };

  // useEffect(() => {
  //   if (backendData.aiResumeText) {
  //     setAiResumeHTML(backendData.aiResumeText);
  //   }
  // }, [backendData.aiResumeText]);

  // const [resumeHTML, setResumeHTML] = useState("");

  // useEffect(() => {
  //   if (backendData) {
  //     setResumeHTML(generateResumeHTML());
  //   }
  // }, [backendData]);



  return (
    <div className="resume-form">

      <div className={style.title}>
        <h2>Resume Preview</h2>
        <div className={style.resumeLabel}>
          {normalizedResume && <p> Your Resume</p>}
          {AIresponse && <p> Your AI Improved Resume</p>}
        </div>
      </div>

      <div className={style.resumeScaler}>
        {normalizedResume &&  <ResumeTemplate data={normalizedResume} /> }
        {AIresponse &&   <ResumeTemplate data={AIresponse}/> }
      </div>

      <div className={style.viewBtn}>
        {/* <Btn label={"Open Resume In New Tab"} onClick={newTab} /> */}
        <Btn
          type="button"
          label={savingToStorage ? "Saving..." : "Save To Document Storage"}
          onClick={saveToStorage}
          disabled={savingToStorage}
        />
        {/* <Btn label={"Download as DOCX"} onClick={downloadDocx} /> */}
        <Btn label={"Go to Main page"} onClick={goToJobDashboard} />
      </div>

      <div className={style.successMsg}>
        {successMessage && <p>{successMessage}</p>}
      </div>

      {showError && (
        <div style={{ color: "red", padding: "10px", marginTop: "10px" }}>
          <strong>{errorTitle}:</strong> {errorDescription}
        </div>
      )}
    </div>
  );
};

export default ResumeViewStep;
