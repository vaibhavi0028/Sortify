import React, { useState, useEffect } from "react";
import "../styles/Segregation.css"; // Assuming you have styles in this file

function EmailCategories() {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categorizedEmails, setCategorizedEmails] = useState({});
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Fetch email categories with pagination
  const loadMoreEmails = () => {
    if (!hasMore) return;

    fetch(
      `http://localhost:5000/api/email_categories?page=${currentPage}&per_page=10`, {
        headers: {
          Authorization: 'Bearer your-auth-token', // Add your auth token here if needed
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setCategorizedEmails((prevEmails) => ({
          ...prevEmails,
          ...data.emails,
        }));
        setHasMore(data.has_more);
        setCurrentPage((prevPage) => prevPage + 1);
      })
      .catch((error) =>
        console.error("Error fetching email categories:", error)
      );
  };

  // Fetch individual email details
  const viewEmail = (emailId) => {
    fetch(`http://localhost:5000/api/email/${emailId}`, {
      headers: {
        Authorization: 'Bearer your-auth-token', // Add your auth token here if needed
      }
    })
      .then((response) => response.json())
      .then((email) => setSelectedEmail(email))
      .catch((error) => console.error("Error fetching email details:", error));
  };

  // Render the list of categorized emails
  const displayEmails = (categorizedEmails) => {
    return Object.entries(categorizedEmails).map(([category, emails]) => (
      <div key={category} className="category">
        <h3>{category}</h3>
        <div className="email-list">
          {emails.map((email) => (
            <div
              key={email.id}
              className="email-item"
              onClick={() => viewEmail(email.id)}
            >
              <div className="email-header">
                <span className="email-subject">{email.subject}</span>
                <span className="email-date">{formatDate(email.date)}</span>
              </div>
              <div className="email-sender">{email.from}</div>
              <div className="email-snippet">{email.snippet}</div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  // Format date in "MMM DD, YYYY" format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Back to category list
  const showEmailCategories = () => {
    setSelectedEmail(null); // Reset the selected email to go back to category view
  };

  // Load more emails when clicking the button
  const createLoadMoreButton = () => (
    <button onClick={loadMoreEmails} className="load-more-button">
      Load More
    </button>
  );

  // Fetch initial email categories on mount
  useEffect(() => {
    loadMoreEmails();
  }, []);

  return (
    <div id="email-categories" className="email-categories">
      <div className="greeting">
        <h1>Hello, <strong>Vaibhavi!</strong></h1>
        <hr />
      </div>
      {!selectedEmail ? (
        <>
          <h2>Email Categories</h2>
          <div id="category-list">
            {displayEmails(categorizedEmails)}
          </div>
          <div id="loadbtncont">
          {hasMore && createLoadMoreButton()}
          </div>
          
        </>
      ) : (
        <div className="email-details">
          <h2>Email Details</h2>
          <p><strong>Subject:</strong> {selectedEmail.subject}</p>
          <p><strong>From:</strong> {selectedEmail.from}</p>
          <p><strong>Date:</strong> {formatDate(selectedEmail.date)}</p>
          <p><strong>Body:</strong></p>
          <div>{selectedEmail.body}</div>
          <button onClick={showEmailCategories} id="backButton">Back to Inbox</button>
        </div>
      )}
    </div>
  );
}

export default EmailCategories;
