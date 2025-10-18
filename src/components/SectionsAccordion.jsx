import React, { useState } from "react";
import "./SectionsAccordion.css";

function Section({ title, items }) {
  const [open, setOpen] = useState(true);
  if (!items || items.length === 0) return null;
  return (
    <div className="section">
      <h3 onClick={() => setOpen(!open)}>{title}</h3>
      {open && (
        <ul>
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SectionsAccordion({ skills, education, projects, certifications }) {
  return (
    <div className="accordion">
      <Section title="Skills" items={skills} />
      <Section title="Education" items={education} />
      <Section title="Projects" items={projects} />
      <Section title="Certifications" items={certifications} />
    </div>
  );
}
