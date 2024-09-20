<div align='center'>

<h1>Sortify: Simplify Your Daily VIT Tasks</h1>
<p>This repository houses the front-end codebase for Sortify, a project developed to streamline daily tasks for VIT students. Collaborating with an amazing tech team, we utilized React.js and integrated various APIs to create an efficient and user-friendly experience. Join us in revolutionizing how you manage your day-to-day activities! 🚀📧</p>

<h4> <a href="https://github.com/vaibhavi0028/Sortify_frontend/blob/main/README.md"> Documentation </a> <span> · </span> <a href="https://www.canva.com/design/DAGRIWj0wXU/2YHfZKq2mmrqDY19_oHxwA/edit?utm_content=DAGRIWj0wXU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"> Presentation </a> 
<br><br>
</div>

## :star2: Overview

Sortify is designed to simplify and organize daily tasks for VIT students, providing a seamless experience for managing emails, service requests, and more. With its intuitive interface, Sortify makes student life easier and more efficient.
<br><br>

## :dart: Features
- **Mail Segregation**: Stay on top of your VIT emails effortlessly. Sortify categorizes your emails based on interests like sports, internship opportunities, class updates, and more, keeping your inbox organized and visually appealing.
- **Personalized Mail Generator**: Automate drafting and sending emails to proctors, wardens, and faculty for leaves or queries, streamlining communication.
- **Effortless Complaints and Requests**: Report issues like sanitation problems or room repairs directly to your hostel warden with just a few clicks.
- **Instant Service Requests**: Schedule room cleaning or request repairs for AC, electrical, or plumbing issues quickly.
- **User Panel**: A personal command center for submitting requests and tracking progress with real-time updates.
- **Admin Panel**: Streamlined management for efficient coordination between main and sub-admins to ensure timely responses.
<br>

## :space_invader: Technologies Used
<ul>
<li><a href="https://react.dev/">React.js</a></li>
<li><a href="https://nodejs.org/">Node.js</a></li>
<li><a href="https://expressjs.com/">Express.js</a></li>
<li><a href="https://www.mongodb.com/">MongoDB</a></li>
<li><a href="https://flask.palletsprojects.com/">Flask</a></li>
<li><a href="https://gmail.google.com/">Gmail API</a></li>
<li><a href="https://gemini.gscoder.com/">Gemini API</a></li>
</ul>
<br>

## :toolbox: Getting Started

### :gear: Installation

Clone the repository to your local machine.

```bash
git clone https://github.com/vaibhavi0028/Sortify
```

Navigate to the project directory and install dependencies.

```bash
cd Sortify/client
npm install
```

Run the application locally.

```bash
npm start
```

Experience the ease of managing your daily tasks with Sortify!
<br><br>



# Dynamic Flask Form with Conditional Fields and File Uploads

This project implements a dynamic form using Flask that adapts based on user input. The form allows users to submit requests for **Leave**, **Late Project Submission**, or **Outing**, and each request type presents different form fields. Additionally, for late project submissions, users can upload specific file types (PDF, DOC, DOCX, TXT), and the system includes a confirmation page before the final submission.

## Features

- Dynamic form fields based on user-selected request type:
  - **Leave Request**: From Date, To Date, Reason
  - **Late Project Submission**: Project Details, Due Date, File Upload (.pdf, .doc, .docx, .txt)
  - **Outing Request**: From Date, From Time, To Date, To Time, Reason
- **File upload** handling for late project submissions.
- **Confirmation page** where users can review and edit generated text before final submission.
- Option to view uploaded files and make modifications before the final submit.

## Flow of the Application

### 1. User Interaction (HTML Form)

The form starts by asking the user for basic information such as:
- Sender Name
- Receiver Name
- Receiver Email
- Receiver Suffix (e.g., Dr., Sir, Madam)
- Request Type (Leave, Late Project Submission, Outing)

Based on the **Request Type**, additional fields are displayed dynamically.

### 2. Flask Backend Processing

Once the form is submitted, the Flask server processes the input based on the Request Type:
- For **Leave Requests**, Flask processes the From Date, To Date, and Reason.
- For **Late Project Submissions**, the form collects project details, due date, and uploads a file, validating that the file is of type .pdf, .doc, .docx, or .txt.
- For **Outing Requests**, Flask processes the dates, times, and reason for the outing.

### 3. Confirmation Page

Once the data is processed, a confirmation page is displayed. This page allows the user to:
- Review and edit the generated text
- View uploaded files (for late project submission)
- Confirm or go back to modify the form

### 4. Final Submission

After reviewing the confirmation page, the user can either:
- Proceed with the final submission
- Go back and edit the form

On final submission, Flask stores the details, and the user is shown a success message.

## Sequence of Operations

```plaintext
User            Browser (HTML)           Flask Server (Backend)
 |                   |                          |
 |--- Input Form ---->|                          |
 |                   |-----> Display Form ------|
 |                   |                          |
 |----Submit Form---->|                          |
 |                   |---- POST Request --------|  
 |                   |       Process Form       |
 |                   |                          |
 |<---- Render Confirmation Page ---------------|
 |                   |                          |
 |--- Final Submit ->|                          |
 |                   |----- Store Data ---------|
 |<-- Success Message|                          |
```

## Setup and Installation

To run the application locally, follow these steps:

Clone the repository:
```bash
git clone https://github.com/your-repo/dynamic-flask-form.git
cd dynamic-flask-form
```

Create a virtual environment and install dependencies:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Run the Flask Application:
```bash
flask run
```

Access the App:
```bash
http://127.0.0.1:5000/
```

## Technologies Used

- **Flask**: Web framework for Python.
- **HTML**: For form rendering.
- **CSS**: For basic styling.
- **Bootstrap**: (Optional) For enhanced UI/UX.
- **File Handling**: To handle uploads for specific types like .pdf, .doc, .docx, and .txt.

## Future Enhancements

- **Error Handling**: Improve validation and error messages for missing fields and invalid file uploads.
- **AJAX Integration**: Add AJAX for smoother form submissions without page reloads.
- **Database Integration**: Store submissions in a database for future reference.

## Conclusion

This project demonstrates the use of Flask to handle dynamic form inputs and processing. The ability to show different fields based on user selection, handle file uploads, and allow the user to confirm their input makes this a flexible and interactive solution for various use cases.

## :handshake: Team - ByteBond
Vaibhavi - 22MIC0046 <br>
Maneet Gupta - 24BBS0101 <br>
Prince Kosthi - 24BBS0004 <br>
G.Pavan Kumar Reddy - 22BCE2115 
<br><br>
