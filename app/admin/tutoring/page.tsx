"use client";
import "../dashboard.css";
import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TutortoiseClient } from "../../_api/tutortoiseClient";
import CircularProgress from "@mui/material/CircularProgress";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function TutorRegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [status, setStatus] = useState<{ type: "success" | "error" | null; msg: string }>({ type: null, msg: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: "" });
    try {
      await TutortoiseClient.createTutor({
        ...formData
      });
      setStatus({ type: "success", msg: "Tutor created successfully!" });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
      });
    } catch (err: any) {
      setStatus({ type: "error", msg: err?.response?.data?.message || "Failed to create tutor." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>Register New Tutor</h3>
      {status.type && (
        <div className={`form-msg form-msg--${status.type}`}>{status.msg}</div>
      )}
      <div className="form-group">
        <label>First Name</label>
        <input required name="firstName" value={formData.firstName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input required name="lastName" value={formData.lastName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input required type="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input required type="phone" name="phone" value={formData.phone} onChange={handleChange} />
      </div>
            <div className="form-group">
        <label>Password</label>
        <input required type="password" name="password" value={formData.password} onChange={handleChange} />
      </div>
      <button disabled={loading} type="submit" className="form-btn">
        {loading ? <CircularProgress size={20} color="inherit" /> : "Submit"}
      </button>
    </form>
  );
}

function ParentRegistrationForm() {
  const [parentData, setParentData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [students, setStudents] = useState([{ firstName: "",lastName: ""}]);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; msg: string }>({ type: null, msg: "" });
  const [loading, setLoading] = useState(false);

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStudentChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newStudents = [...students];
    newStudents[index] = { ...newStudents[index], [e.target.name]: e.target.value };
    setStudents(newStudents);
  };

  const addStudent = () => {
    setStudents(prev => [...prev, { firstName: "",lastName: "" }]);
  };

  const removeStudent = (index: number) => {
    if (students.length > 1) {
      setStudents(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: "" });
    try {
      const createdParent = await TutortoiseClient.createParent(parentData);
      
      for (const student of students) {

         await TutortoiseClient.addStudent(
           createdParent.id, 
           student.firstName || "Unknown", 
           student.lastName || "Unknown"
         );
      }

      setStatus({ type: "success", msg: "Parent and Student(s) created successfully!" });
      setParentData({
        firstName: "", lastName: "", email: "", phone: "", password: "",
      });
      setStudents([{ firstName: "",lastName: ""}]);
    } catch (err: any) {
      setStatus({ type: "error", msg: err?.response?.data?.message || "Failed to create parent/student." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>Register Parent</h3>
      {status.type && (
        <div className={`form-msg form-msg--${status.type}`}>{status.msg}</div>
      )}
      <div className="form-group">
        <label>First Name</label>
        <input required name="firstName" value={parentData.firstName} onChange={handleParentChange} />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input required name="lastName" value={parentData.lastName} onChange={handleParentChange} />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input required type="email" name="email" value={parentData.email} onChange={handleParentChange} />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input required name="phone" value={parentData.phone} onChange={handleParentChange} />
      </div>
            <div className="form-group">
        <label>Password</label>
        <input required name="password" value={parentData.password} onChange={handleParentChange} />
      </div>

      <hr style={{ margin: "20px 0" }} />
      <h3>Students</h3>
      {students.map((student, idx) => (
        <div key={idx} className="student-card">
          <h4>Student {idx + 1}</h4>
          <div className="form-group">
            <label>First Name</label>
            <input required name="firstName" value={student.firstName} onChange={(e) => handleStudentChange(idx, e)} />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input required name="lastName" value={student.lastName} onChange={(e) => handleStudentChange(idx, e)} />
          </div>
          {students.length > 1 && (
            <button type="button" onClick={() => removeStudent(idx)} className="form-btn form-btn--danger">
              Remove Student
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addStudent} className="form-btn form-btn--secondary" style={{ marginBottom: '20px' }}>
        + Add Another Student
      </button>

      <button disabled={loading} type="submit" className="form-btn">
        {loading ? <CircularProgress size={20} color="inherit" /> : "Submit All"}
      </button>
    </form>
  );
}

export default function AdminTutoringPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <main className="dashboard">
      <section style={{ margin: "20px" }}>
        <h2>Registration & Tutoring</h2>
        <Box sx={{ width: "100%", mt: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Tutor Registration" />
              <Tab label="Parent & Student Registration" />
            </Tabs>
          </Box>

          <CustomTabPanel value={tabValue} index={0}>
            <TutorRegistrationForm />
          </CustomTabPanel>

          <CustomTabPanel value={tabValue} index={1}>
            <ParentRegistrationForm />
          </CustomTabPanel>
        </Box>
      </section>
    </main>
  );
}
