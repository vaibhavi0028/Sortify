from flask import Flask, render_template, request
import google.generativeai as genai
import os

api_key= "AIzaSyAcAF6w69wmIhA0NbjboMtdD7y-uaRWLSw"
genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    # Retrieve form data
    name = request.form.get('name')
    email = request.form.get('email')
    subject = request.form.get('subject')
    from_datetime = request.form.get('from_datetime')
    to_datetime = request.form.get('to_datetime')
    reason = request.form.get('reason')
    words = request.form.get('words')

    prompt = f"Generate an formal message for a leave request sent by {name} stating reason{reason} from {from_datetime} to {to_datetime} in about {words} words"



    # Process data and create a response
    response = model.generate_content(prompt)

    return response.text
if __name__ == '__main__':
    app.run(debug=True)