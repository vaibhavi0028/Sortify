from flask import Flask, render_template, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
import google.generativeai as genai
import os
api_key= "AIzaSyAcAF6w69wmIhA0NbjboMtdD7y-uaRWLSw"
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# Check if file is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


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
        # Type-specific fields
        details = ""
        uploaded_file_path = ""
        if request_type == 'leave':
            from_date = request.form.get('leave_from_date')
            to_date = request.form.get('leave_to_date')
            reason = request.form.get('leave_reason')
            generatedresponse = model.generate_content(
                f"generate a Leave request sent by{user_name} from {from_date} to {to_date} stating reason {reason} in about 100-150 words ")
            response_text += (generatedresponse.text + f"\n\nBest regards,\n{user_name}")

        elif request_type == 'late_submission':
            project_details = request.form.get('project_details')
            due_date = request.form.get('project_due_date')
            details = f"Late Project Submission, Details: {project_details}. Due Date: {due_date}"
            reason_delay=request.form.get('reasondelay')

            # Handling file upload
            file = request.files.get('project_file')
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                uploaded_file_path = filename
                generatedresponse = model.generate_content(
                    f"write a plain message showing regret for late submission for project {project_details} which was on due date {due_date} due to {reason_delay} also mention about the attached file with filename {filename} in about 100-150 words ")
                response_text += (generatedresponse.text + "\n\nBest regards,\n{user_name}")
            else:
                generatedresponse = model.generate_content(
                    f"write a plain message showing regret for late submission for project {project_details} which was on due date {due_date} due to {reason_delay} in about 100-150 words ")
                response_text += (generatedresponse.text + "\n\nBest regards,\n{user_name}")

        elif request_type == 'outing':
            from_date = request.form.get('outing_from_date')
            from_time = request.form.get('outing_from_time')
            to_date = request.form.get('outing_to_date')
            to_time = request.form.get('outing_to_time')
            reason = request.form.get('outing_reason')
            details = f"Outing from {from_date} {from_time} to {to_date} {to_time}. Reason: {reason}"
            generatedresponse = model.generate_content(
                f"write a plain message requestng for outing stating the reason {reason} from {from_date} {from_time} to {to_date} {to_time} in about 100-150 words  ")
            response_text += (generatedresponse.text + "\n\nBest regards,\n{user_name}")

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
    # Final confirmation details
    receiver_email = request.form.get('receiver_email')
    receiver_suffix = request.form.get('receiver_suffix')
    details = request.form.get('details')

    return f"Final Submission Successful! Email to: {receiver_suffix} {receiver_email}. Details: {details}"


if __name__ == '__main__':
    app.run(debug=True)
