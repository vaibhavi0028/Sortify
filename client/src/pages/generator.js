import React, { useState } from "react";
import "../styles/Generator.css";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const Generator = () => {
  const [requestType, setRequestType] = useState("");
  const [formFields, setFormFields] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        { align: [] },
      ],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
            "#ffc266",
            "#ffff66",
            "#66b966",
            "#66a3e0",
            "#c285ff",
            "#888888",
            "#a10000",
            "#b26b00",
            "#b2b200",
            "#006100",
            "#0047b2",
            "#6b24b2",
            "#444444",
            "#5c0000",
            "#663d00",
            "#666600",
            "#003700",
            "#002966",
            "#3d1466",
            "custom-color",
          ],
        },
      ],
    ],
  };

  const formats = [
    "header",
    "height",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "color",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "size",
  ];

  const handleRequestTypeChange = (event) => {
    setRequestType(event.target.value);
    updateFormFields(event.target.value);
  };

  const handleProcedureContentChange = (content) => {
    setEditorContent(content);
  };

  const updateFormFields = (requestType) => {
    let commonFields = `
      <label for="sender-name">Sender's Name:</label>
      <input type="text" id="sender-name" name="sender-name" required />
      <label for="receiver-name">Receiver's Name:</label>
      <input type="text" id="receiver-name" name="receiver-name" required />
      <label for="receiver-email">Receiver's Email:</label>
      <input type="email" id="receiver-email" name="receiver-email" required />
      <label for="subject">Subject of Mail:</label>
      <input type="text" id="subject" name="subject" />
      <label for="receiver-suffix">Receiver's Suffix:</label>
      <select id="receiver-suffix" name="receiver-suffix" required>
        <option value="Dr.">Dr.</option>
        <option value="Sir">Sir</option>
        <option value="Madam">Madam</option>
        <option value="Sir/Madam">Sir/Madam</option>
      </select>
    `;

    let specificFields = "";
    switch (requestType) {
      case "leave":
        specificFields = `
          <label for="leave-from-date">From Date:</label>
          <input type="date" id="leave-from-date" name="leave-from-date" required />
          <label for="leave-to-date">To Date:</label>
          <input type="date" id="leave-to-date" name="leave-to-date" required />
          <label for="leave-reason">Reason:</label>
          <textarea id="leave-reason" name="leave-reason" required></textarea>
        `;
        break;
      case "late-submission":
        specificFields = `
          <label for="project-details">Project Details:</label>
          <textarea id="project-details" name="project-details" required></textarea>
          <label for="project-due-date">Project Due Date:</label>
          <input type="date" id="project-due-date" name="project-due-date" required />
          <label for="reason-delay">Reason for Delay:</label>
          <textarea id="reason-delay" name="reason-delay" required></textarea>
        `;
        break;
      case "outing":
        specificFields = `
          <label for="outing-from-date">From Date:</label>
          <input type="date" id="outing-from-date" name="outing-from-date" required />
          <label for="outing-from-time">From Time:</label>
          <input type="time" id="outing-from-time" name="outing-from-time" required />
          <label for="outing-to-date">To Date:</label>
          <input type="date" id="outing-to-date" name="outing-to-date" required />
          <label for="outing-to-time">To Time:</label>
          <input type="time" id="outing-to-time" name="outing-to-time" required />
          <label for="outing-reason">Reason:</label>
          <textarea id="outing-reason" name="outing-reason" required></textarea>
        `;
        break;
      default:
        specificFields = "";
    }

    setFormFields(commonFields + specificFields);
  };

  const showConfirmation = async () => {
    const formData = new FormData(
      document.getElementById("request-submission-form")
    );
    const requestData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:5000/api/submit_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      if (data.error) {
        alert("Failed to generate the message: " + data.error);
        return;
      }
      setGeneratedMessage(data.details);
      setEditorContent(data.details); // Update the editor content with generated message
      setConfirmationVisible(true);
    } catch (error) {
      console.error("Error generating confirmation message:", error);
      alert("An error occurred while generating the confirmation message.");
    }
  };

  const submitFinalRequest = async () => {
    const finalData = {
      receiver_email: document.getElementById("receiver-email").value,
      receiver_suffix: document.getElementById("receiver-suffix").value,
      subject: document.getElementById("subject").value,
      details: generatedMessage,
    };

    try {
      const response = await fetch("http://localhost:5000/api/final_submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });
      const data = await response.json();
      alert(data.message);
      // Reset form state if needed
    } catch (error) {
      console.error("Error submitting final request:", error);
    }
  };

  return (
    <div className="generator">
      <div className="greeting">
        <h1>
          Hello, <strong>Vaibhavi!</strong>
        </h1>
        <hr />
      </div>
      
      <div className="form-container">
        {!confirmationVisible && (
          <div className="form-card">
            <form id="request-submission-form">
              <label htmlFor="request-type">Request Type:</label>
              <select
                id="request-type"
                name="request-type"
                onChange={handleRequestTypeChange}
                required
              >
                <option value="">Select...</option>
                <option value="leave">Leave</option>
                <option value="late-submission">Late Submission</option>
                <option value="outing">Outing</option>
              </select>
              <div
                id="form-fields"
                dangerouslySetInnerHTML={{ __html: formFields }}
              />
              <div className="form-card-button">
              <button type="button" onClick={showConfirmation}>
                Preview Message
              </button>
              </div>
            </form>
          </div>
        )}
  
        {confirmationVisible && (
          <div className="confirmation-message-container">
            <h3>Confirmation Message</h3>
            <div style={{ height: "220px" }}>
              <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                value={editorContent}
                onChange={handleProcedureContentChange}
                readOnly={false}
                style={{ height: "100%" }}
              />
            </div>
            <div className="button-container">
              <button onClick={submitFinalRequest}>Submit Request</button>
              <button onClick={() => setConfirmationVisible(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  
};

export default Generator;
