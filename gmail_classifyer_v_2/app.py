#%%
'''MAKE SURE run the following code in terminal and setup a virtual environment
!pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib Flask sklearn
!pip install bs4
!pip install flask

'''

#%%
from flask import Flask, render_template, redirect, url_for, session, request
import base64
from bs4 import BeautifulSoup
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with your secret key
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

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

@app.route('/')
def index():
    global KEYWORDS
    # Check if user is authenticated, otherwise redirect to authorization
    service = get_gmail_service()
    if not service:
        return redirect(url_for('authorize'))
    # Fetch and categorize emails
    emails = fetch_emails(service)
    categorized_emails = classify_emails(emails)

    # Get date filters from request
    start_date = request.args.get('start_date', '')
    end_date = request.args.get('end_date', '')

    specific_email = request.args.get('specific_email', '').strip()

    # Add the specific email to keywords if provided
    if specific_email:
        KEYWORDS = {specific_email: 'Proctor', **KEYWORDS}

    # Filter emails by date if date range is provided
    if start_date and end_date:
        categorized_emails = filter_emails_by_date(categorized_emails, start_date, end_date)
    
    return render_template('index.html', categories=categorized_emails, start_date=start_date, end_date=end_date)

@app.route('/authorize')
def authorize():
    # Initiate the OAuth flow for authorization
    flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
    flow.redirect_uri = url_for('oauth2callback', _external=True)
    authorization_url, _ = flow.authorization_url(prompt='consent')
    return redirect(authorization_url)

@app.route('/oauth2callback')
def oauth2callback():
    # Handle the OAuth callback and save credentials
    flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
    flow.redirect_uri = url_for('oauth2callback', _external=True)
    flow.fetch_token(authorization_response=request.url)

    creds = flow.credentials
    session['credentials'] = creds_to_dict(creds)
    return redirect(url_for('index'))

def get_gmail_service():
    """Get the Gmail service using OAuth credentials."""
    creds = None
    if 'credentials' in session:
        creds = Credentials(**session['credentials'])
        if creds.expired and creds.refresh_token:
            creds.refresh(Request())

    if not creds or not creds.valid:
        return None

    return build('gmail', 'v1', credentials=creds)

def fetch_emails(service):
    """Fetch emails from the Gmail API."""
    emails = []
    try:
        results = service.users().messages().list(userId='me', maxResults=50).execute()
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

@app.route('/email/<email_id>')
def view_email(email_id):
    """Route to view the full content of an email."""
    service = get_gmail_service()
    if not service:
        return redirect(url_for('authorize'))

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

    except Exception as e:
        print(f"Error fetching email content: {e}")
        email = None

    return render_template('email.html', email=email)

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

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
