from flask import Flask, render_template, redirect, url_for, session, request, send_from_directory, jsonify
from werkzeug.utils import secure_filename
import base64
from bs4 import BeautifulSoup
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os
from datetime import datetime
import google.generativeai as genai
from email.mime.text import MIMEText
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.secret_key = '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'  # Replace with your secret key
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send']
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Configure your Generative AI model
api_key = "AIzaSyAcAF6w69wmIhA0NbjboMtdD7y-uaRWLSw"
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

# Define keywords for categorization
KEYWORDS = {
    'opportunity': 'Opportunity',
    'sport': 'Sports',
    "Today's events": 'Events',
    'event': 'Special Events',
    'fiesta': 'Special Events',
    'workshop': 'Workshop',
    'notice': 'Notices',
    'instruction': 'Notices',
    'instructional': 'Notices',
    'scholarship': 'Scholarships',
    'account': 'Security',
    'your': 'Your Updates'
}


def creds_to_dict(creds):
    """Convert credentials to a serializable dictionary."""
    return {
        'token': creds.token,
        'refresh_token': creds.refresh_token,
        'token_uri': creds.token_uri,
        'client_id': creds.client_id,
        'client_secret': creds.client_secret,
        'scopes': creds.scopes
    }


def filter_emails_by_date(emails, start_date, end_date):
    """Filter categorized emails by date range."""
    filtered = {}
    try:
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(end_date, '%Y-%m-%d')

        for category, items in emails.items():
            filtered[category] = [
                email for email in items if start <= datetime.strptime(email['date'][:16], '%a, %d %b %Y') <= end
            ]
    except ValueError as e:
        print(f"Date parsing error: {e}")
        return emails

    return filtered


def classify_emails(emails):
    """Categorize emails based on keywords and sender addresses."""
    categorized = {
        'Notices': [],
        'Proctor': [],
        'Events': [],
        'Special Events': [],
        'Opportunity': [],
        'Sports': [],
        'Workshop': [],
        'Scholarships': [],
        'Your Updates': [],
        'Security': [],
        'Others': []
    }

    for email in emails:
        added = False
        for keyword, category in KEYWORDS.items():
            if keyword.lower() in email['subject'].lower() or keyword.lower() in email['from'].lower():
                categorized[category].append(email)
                added = True
                break
        if not added:
            categorized['Others'].append(email)

    return categorized


def get_email_body(payload):
    '''Extract and format the email body from the payload, handling different formats.'''
    body = ''

    def decode_body(part):
        """Helper function to decode the email body."""
        if 'data' in part['body']:
            return base64.urlsafe_b64decode(part['body']['data']).decode('utf-8', errors='ignore')
        return ''

    # Check if payload has parts and handle nested structures
    if 'parts' in payload:
        for part in payload['parts']:
            # If the part itself has more parts (nested), handle recursively
            if 'parts' in part:
                for sub_part in part['parts']:
                    mime_type = sub_part.get('mimeType', '')
                    if mime_type in ['text/plain', 'text/html']:
                        body = decode_body(sub_part)
                        if body:
                            break
            else:
                mime_type = part.get('mimeType', '')
                if mime_type in ['text/plain', 'text/html']:
                    body = decode_body(part)
                    if body:
                        break
    else:
        # Handle payload without parts
        body = decode_body(payload)

    # Format the body based on its content type
    if '<html' in body.lower():
        # Clean and style HTML content
        soup = BeautifulSoup(body, 'html.parser')
        # Optional: Remove unwanted tags like scripts and styles
        for tag in soup(['script', 'style']):
            tag.decompose()
        body = soup.prettify()
    else:
        # Format plain text content with line breaks and basic styling
        body = body.replace('\n', '<br>').strip()
    return body


def fetch_emails(service):
    """Fetch emails from the Gmail API."""
    emails = []
    try:
        results = service.users().messages().list(userId='me', maxResults=20).execute()
        messages = results.get('messages', [])

        for message in messages:
            msg = service.users().messages().get(userId='me', id=message['id']).execute()
            payload = msg.get('payload', {})
            headers = payload.get('headers', [])
            subject = next((header['value'] for header in headers if header['name'] == 'Subject'), 'No Subject')
            sender = next((header['value'] for header in headers if header['name'] == 'From'), 'Unknown Sender')
            date = next((header['value'] for header in headers if header['name'] == 'Date'), 'Unknown Date')

            emails.append({
                'id': message['id'],
                'subject': subject,
                'from': sender,
                'date': date,
                'text': subject + ' ' + sender
            })

    except Exception as e:
        print(f"Error fetching emails: {e}")

    return emails


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Function to get Gmail API credentials, including creating token.json if missing
def get_gmail_service():
    global SCOPES
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


# Helper functions (keep all existing helper functions)

# Modified routes and new API endpoints
@app.route('/api/authorize')
def api_authorize():
    flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
    flow.redirect_uri = url_for('api_oauth2callback', _external=True)
    authorization_url, _ = flow.authorization_url(prompt='consent')
    return jsonify({'authorization_url': authorization_url})


@app.route('/api/oauth2callback')
def api_oauth2callback():
    flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
    flow.redirect_uri = url_for('api_oauth2callback', _external=True)
    flow.fetch_token(authorization_response=request.url)

    creds = flow.credentials
    session['credentials'] = creds_to_dict(creds)
    return jsonify({'success': True, 'message': 'Authentication successful'})


@app.route('/api/email_categories')
def api_emails():
    global KEYWORDS
    service = get_gmail_service()
    if not service:
        return jsonify({'error': 'Not authenticated'}), 401

    emails = fetch_emails(service)
    categorized_emails = classify_emails(emails)

    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '')
    specific_email = request.args.get('specific_email', '').strip()

    if specific_email:
        KEYWORDS = {specific_email: 'Proctor', **KEYWORDS}

    if start_date and end_date:
        categorized_emails = filter_emails_by_date(categorized_emails, start_date, end_date)

    return jsonify(categorized_emails)


@app.route('/api/email/<email_id>')
def api_view_email(email_id):
    service = get_gmail_service()
    if not service:
        return jsonify({'error': 'Not authenticated'}), 401

    try:
        msg = service.users().messages().get(userId='me', id=email_id, format='full').execute()
        payload = msg.get('payload', {})
        headers = payload.get('headers', [])
        subject = next((header['value'] for header in headers if header['name'] == 'Subject'), 'No Subject')
        sender = next((header['value'] for header in headers if header['name'] == 'From'), 'Unknown Sender')
        date = next((header['value'] for header in headers if header['name'] == 'Date'), 'Unknown Date')
        body = get_email_body(payload)

        email = {
            'subject': subject,
            'from': sender,
            'date': date,
            'body': body
        }
        return jsonify(email)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/logout', methods=['POST'])
def api_logout():
    try:
        session.clear()
        if os.path.exists('token.json'):
            os.remove('token.json')
        
        flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
        flow.redirect_uri = url_for('api_oauth2callback', _external=True)
        authorization_url, _ = flow.authorization_url(prompt='consent')

        return jsonify({
            'success': True, 
            'message': 'Logged out successfully. Please authorize access again.', 
            'authorization_url': authorization_url
        })
    except Exception as e:
        print(f"Error during logout: {e}")
        return jsonify({
            'success': False, 
            'message': 'An error occurred while logging out. Please try again.'
        }), 500


@app.route('/api/submit_request', methods=['POST'])
def api_submit_request():
    print(request.json)
    try:
        data = request.json
        sender_name = data.get('sender-name')
        receiver_name = data.get('receiver-name')
        receiver_email = data.get('receiver-email')
        receiver_suffix = data.get('receiver-suffix')
        request_type = data.get('request-type')
        subject_user = data.get('subject')
        subject_final = model.generate_content(f"generate a subject regarding {subject_user}")
        if not all([sender_name, receiver_name, receiver_email, request_type]):
            return jsonify({'error': 'Missing required fields'}), 400

        response_text = f"{receiver_suffix} {receiver_name},\n\n"
        # Handle specific request types
        if request_type == 'leave':
            from_date = data.get('leave-from-date')
            to_date = data.get('leave-to-date')
            reason = data.get('leave-reason')
            if not all([from_date, to_date, reason]):
                return jsonify({'error': 'Missing leave request details'}), 400

            # Generate content using the AI model
            try:
                generated_response = model.generate_content(
                    f"Generate a Leave request from {sender_name} from {from_date} to {to_date} stating reason {reason}."
                )
                response_text += (generated_response.text + f"\n\nBest regards,\n{sender_name}")
            except Exception as e:
                print(f"Error generating leave request: {e}")
                return jsonify({'error': 'Failed to generate leave request'}), 500

        # Similar handling for 'late-submission' and 'outing'...

        return jsonify({
            'sender-name': sender_name,
            'receiver-name': receiver_name,
            'receiver-email': receiver_email,
            'receiver-suffix': receiver_suffix,
            'request-type': request_type,
            'details': response_text,
            'subject': subject_final.text
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to generate the request message'}), 500


@app.route('/api/final_submit', methods=['POST'])
def api_final_submit():
    data = request.json
    print(data)
    receiver_email = data.get('receiver_email')
    subject = data.get('subject')
    details = data.get('details')
    result = send_email(receiver_email, subject, details)
    return jsonify({'message': result})


# Check if token.json exists (API endpoint)
@app.route('/api/check_token', methods=['GET'])
def check_token():
    token_exists = os.path.exists('token.json')
    return jsonify({'token_exists': token_exists})


# Logout (deletes token.json and clears session)
@app.route('/api/logout', methods=['POST'])
def logout():
    if os.path.exists('token.json'):
        os.remove('token.json')
    session.clear()  # Clear any session data
    return jsonify({'success': True, 'message': 'Logged out successfully'})

if __name__ == '__main__':
    app.run(debug=True)