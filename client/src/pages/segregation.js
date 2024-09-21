import React, { useState, useRef } from "react";
import "../styles/Segregation.css";

const initialKeywords = ["Internship", "Quiz", "DA", "Digital Assignment", "Hackathons"];

const initialMailData = {
  "Internship": ["Mail 1: Internship details", "Mail 2: Internship opportunity"],
  "Quiz": ["Mail 1: Quiz schedule", "Mail 2: Quiz results"],
  "DA": ["Mail 1: DA guidelines", "Mail 2: DA submission dates"],
  "Digital Assignment": ["Mail 1: DA instructions", "Mail 2: DA topics"],
  "Hackathons": ["Mail 1: Hackathon invitation", "Mail 2: Hackathon results","Mail 1: Hackathon invitation", "Mail 2: Hackathon results","Mail 1: Hackathon invitation", "Mail 2: Hackathon results","Mail 1: Hackathon invitation", "Mail 2: Hackathon results","Mail 1: Hackathon invitation", "Mail 2: Hackathon results"]
};

function Segregation() {
  const [keywords, setKeywords] = useState(initialKeywords);
  const [mailData, setMailData] = useState(initialMailData);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [showInput, setShowInput] = useState(false);
  
  const handleKeywordClick = (keyword) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords([...keywords, newKeyword]);
      setMailData({ ...mailData, [newKeyword]: [] });
      setNewKeyword("");
      setShowInput(false);
    }
  };

  const mailSlidersRef = useRef({});

  const scrollLeft = (keyword) => {
    mailSlidersRef.current[keyword].scrollLeft -= 200;
  };

  const scrollRight = (keyword) => {
    mailSlidersRef.current[keyword].scrollLeft += 200;
  };

  return (
    <div className="segregation">
      <h1>Select your topics</h1>
      <div className="keyword-container">
        {keywords.map((keyword) => (
          <button
            key={keyword}
            className={`keyword-btn ${selectedKeywords.includes(keyword) ? "selected" : ""}`}
            onClick={() => handleKeywordClick(keyword)}
          >
            {keyword}
          </button>
        ))}
        <button className="keyword-btn add-keyword-btn" onClick={() => setShowInput(!showInput)}>+</button>
      </div>

      {showInput && (
        <div className="input-container">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Enter keyword here"
            className="keyword-input"
          />
          <button className="add-btn" onClick={handleAddKeyword}>Add</button>
        </div>
      )}

      {selectedKeywords.length > 0 && (
        <div className="mail-content">
          {selectedKeywords.map((keyword) => (
            <div key={keyword} className="mail-section">
              <h2>{keyword} Mails</h2>
              <button
                className={`arrow-btn arrow-left ${mailData[keyword].length <= 2 ? "hidden" : ""}`}
                onClick={() => scrollLeft(keyword)}
              >
                {"<"}
              </button>
              <div
                className="mail-slider"
                ref={(el) => (mailSlidersRef.current[keyword] = el)}
              >
                {mailData[keyword].length > 0 ? (
                  mailData[keyword].map((mail, index) => (
                    <div key={index} className="mail-item">
                      {mail}
                    </div>
                  ))
                ) : (
                  <div className="no-mails">No mails now</div>
                )}
              </div>
              <button
                className={`arrow-btn arrow-right ${mailData[keyword].length <= 2 ? "hidden" : ""}`}
                onClick={() => scrollRight(keyword)}
              >
                {">"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Segregation;
