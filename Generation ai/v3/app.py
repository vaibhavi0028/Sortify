#%%
'''MAKE SURE run the following code in terminal and setup a virtual environment
!pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib Flask sklearn
!pip install google-generativeai


'''
#%%
from flask import Flask, render_template, request, send_from_directory
from werkzeug.utils import secure_filename
import google.generativeai as genai
import os
import base64
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request 
from google_auth_oauthlib.flow import InstalledAppFlow
from email.mime.text import MIMEText

# Configure your Generative AI model
api_key = "AIzaSyAcAF6w69wmIhA0NbjboMtdD7y-uaRWLSw"
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Check if file is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to get Gmail API credentials, including creating token.json if missing
def get_gmail_service():
    SCOPES = ['https://www.googleapis.com/auth/gmail.send']
    creds = None
    # Check for token.json for existing credentials
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If no valid credentials are available, request new ones
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
            # Save the credentials for future use
            with open('token.json', 'w') as token:
                token.write(creds.to_json())
    return build('gmail', 'v1', credentials=creds)

# Function to send email using Gmail API
def send_email(receiver_email, subject, message):
    try:
        service = get_gmail_service()
        # Create the email message
        email_message = MIMEText(message)
        email_message['to'] = receiver_email
        email_message['subject'] = subject

        # Encode message and send it
        encoded_message = base64.urlsafe_b64encode(email_message.as_bytes()).decode()
        send_message = {'raw': encoded_message}
        service.users().messages().send(userId='me', body=send_message).execute()
        return "Email sent successfully!"
    except Exception as e:
        return f"Failed to send email: {str(e)}"

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Basic Information
        sender_name = request.form.get('sender_name')
        receiver_name = request.form.get('receiver_name')
        receiver_email = request.form.get('receiver_email')
        receiver_suffix = request.form.get('receiver_suffix')
        request_type = request.form.get('request_type')

        # Initialize response string
        response_text = f"{receiver_suffix} {receiver_name},\n\n"
        uploaded_file_path = ""

        # Generate responses based on request type
        if request_type == 'leave':
            from_date = request.form.get('leave_from_date')
            to_date = request.form.get('leave_to_date')
            reason = request.form.get('leave_reason')
            generatedresponse = model.generate_content(
                f"generate a Leave request sent by {sender_name} from {from_date} to {to_date} stating reason {reason} in about 100-150 words"
            )
            response_text += (generatedresponse.text + f"\n\nBest regards,\n{sender_name}")

        elif request_type == 'late_submission':
            project_details = request.form.get('project_details')
            due_date = request.form.get('project_due_date')
            reason_delay = request.form.get('reasondelay')
            file = request.files.get('project_file')

            # Handle file upload
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                uploaded_file_path = filename
                generatedresponse = model.generate_content(
                    f"write a plain message showing regret for late submission for project {project_details} which was due on {due_date} due to {reason_delay}. Mention the attached file with filename {filename} in about 100-150 words."
                )
                response_text += (generatedresponse.text + f"\n\nBest regards,\n{sender_name}")
            else:
                generatedresponse = model.generate_content(
                    f"write a plain message showing regret for late submission for project {project_details} which was due on {due_date} due to {reason_delay} in about 100-150 words."
                )
                response_text += (generatedresponse.text + f"\n\nBest regards,\n{sender_name}")

        elif request_type == 'outing':
            from_date = request.form.get('outing_from_date')
            from_time = request.form.get('outing_from_time')
            to_date = request.form.get('outing_to_date')
            to_time = request.form.get('outing_to_time')
            reason = request.form.get('outing_reason')
            generatedresponse = model.generate_content(
                f"write a plain message requesting for outing stating the reason {reason} from {from_date} {from_time} to {to_date} {to_time} in about 100-150 words."
            )
            response_text += (generatedresponse.text + f"\n\nBest regards,\n{sender_name}")

        # Pass data to confirmation page
        return render_template('confirmation.html',
                               sender_name=sender_name,
                               receiver_name=receiver_name,
                               receiver_email=receiver_email,
                               receiver_suffix=receiver_suffix,
                               request_type=request_type,
                               details=response_text,
                               uploaded_file_path=uploaded_file_path)

    return render_template('index.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/final_submit', methods=['POST'])
def final_submit():
    # Get details from the form
    receiver_email = request.form.get('receiver_email')
    receiver_suffix = request.form.get('receiver_suffix')
    details = request.form.get('details')

    # Send email
    result = send_email(receiver_email, "Request Confirmation", details)
    return f"Final Submission: {result}"

if __name__ == '__main__':
    app.run(debug=True)
