document.addEventListener('DOMContentLoaded', function() {
    const mainMenu = document.getElementById('main-menu');
    const emailCategories = document.getElementById('email-categories');
    const requestForm = document.getElementById('request-form');
    const categoryList = document.getElementById('category-list');
    const formFields = document.getElementById('form-fields');
    const confirmationMessage = document.getElementById('confirmation-message');
    const generatedMessage = document.getElementById('generated-message');

    // Main menu buttons
    document.getElementById('view-emails').addEventListener('click', showEmailCategories);
    document.getElementById('submit-request').addEventListener('click', showRequestForm);
    
    // Back buttons
    document.getElementById('back-to-menu').addEventListener('click', showMainMenu);
    document.getElementById('back-to-menu-from-form').addEventListener('click', showMainMenu);
    document.getElementById('cancel_submit').addEventListener('click', () => {
        confirmationMessage.style.display = 'none';
        requestForm.style.display = 'block';
    });

    // Show confirmation message
    document.getElementById('show-confirmation').addEventListener('click', showConfirmation);

    // Final submission button
    document.getElementById('final_submit').addEventListener('click', submitFinalRequest);
    
    // Form submission
    document.getElementById('request-submission-form').addEventListener('submit', (e) => e.preventDefault());
    
    // Request type change
    document.getElementById('request-type').addEventListener('change', updateFormFields);

    function showMainMenu() {
        mainMenu.style.display = 'block';
        emailCategories.style.display = 'none';
        requestForm.style.display = 'none';
        confirmationMessage.style.display = 'none';
    }

    function showEmailCategories() {
        mainMenu.style.display = 'none';
        emailCategories.style.display = 'block';
        requestForm.style.display = 'none';
        confirmationMessage.style.display = 'none';

        fetch('http://localhost:5000/api/email_categories')
            .then(response => response.json())
            .then(data => {
                categoryList.innerHTML = '';
                for (const [category, emails] of Object.entries(data)) {
                    const categoryElement = document.createElement('div');
                    categoryElement.classList.add('category');
                    categoryElement.innerHTML = `<h3>${category}</h3>`;
                    
                    if (emails.length > 0) {
                        const ul = document.createElement('ul');
                        emails.forEach(email => {
                            const li = document.createElement('li');
                            const subject = email.subject || "No Subject";
                            const from = email.from || "Unknown Sender";
                            const date = email.date || "No Date";

                            li.innerHTML = `
                                <strong>Subject:</strong> ${subject}<br>
                                <strong>From:</strong> ${from}<br>
                                <strong>Date:</strong> ${date}<br>
                            `;
                            li.addEventListener('click', () => viewEmail(email.id));
                            ul.appendChild(li);
                        });
                        categoryElement.appendChild(ul);
                    } else {
                        categoryElement.innerHTML += '<p>No emails in this category.</p>';
                    }
                    categoryList.appendChild(categoryElement);
                }
            })
            .catch(error => console.error('Error fetching email categories:', error));
    }

    function viewEmail(emailId) {
        fetch(`http://localhost:5000/api/email/${emailId}`)
            .then(response => response.json())
            .then(email => displayEmailDetails(email))
            .catch(error => console.error('Error fetching email details:', error));
    }

    function displayEmailDetails(email) {
        if (email) {
            categoryList.innerHTML = `
                <h2>Email Details</h2>
                <p><strong>Subject:</strong> ${email.subject}</p>
                <p><strong>From:</strong> ${email.from}</p>
                <p><strong>Date:</strong> ${email.date}</p>
                <p><strong>Body:</strong></p>
                <div>${email.body}</div>
                <button id="backButton">Back to Inbox</button>
            `;
            document.getElementById('backButton').addEventListener('click', showEmailCategories);
        } else {
            categoryList.innerHTML = '<p>Email not found.</p>';
        }
    }

    function showRequestForm() {
        mainMenu.style.display = 'none';
        emailCategories.style.display = 'none';
        requestForm.style.display = 'block';
        confirmationMessage.style.display = 'none';
    }

    function showConfirmation() {
        console.log("Show confirmation function called");
        const formData = new FormData(document.getElementById('request-submission-form'));
        const requestData = Object.fromEntries(formData.entries());
    
        fetch('http://localhost:5000/api/submit_request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Failed to generate the message: ' + data.error);
                return;
            }
            generatedMessage.innerHTML = data.details; // Replace newlines with <br> for proper display
            confirmationMessage.style.display = 'block';
            requestForm.style.display = 'none';
        })
        .catch(error => {
            console.error('Error generating confirmation message:', error);
            alert('An error occurred while generating the confirmation message.');
        });
    }
    function generateRequestDetails(requestData) {
        return `
            Request Type: ${requestData['request-type']}
            Sender Name: ${requestData['sender-name']}
            Receiver Name: ${requestData['receiver-name']}
            Receiver Email: ${requestData['receiver-email']}
            Leave Reason: ${requestData['leave-reason'] || 'N/A'}
            Project Details: ${requestData['project-details'] || 'N/A'}
            Outing Reason: ${requestData['outing-reason'] || 'N/A'}
        `;
    }
    

    function submitFinalRequest() {
        const formData = new FormData(document.getElementById('request-submission-form'));
        const requestData = Object.fromEntries(formData.entries());

        fetch('http://localhost:5000/api/final_submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                receiver_email: requestData['receiver-email'],
                receiver_suffix: requestData['receiver-suffix'],
                details: generateRequestDetails(requestData)
            }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            showMainMenu();
        })
        .catch(error => console.error('Error submitting final request:', error));
    }

    function updateFormFields() {
        const requestType = document.getElementById('request-type').value;
        const commonFields = `
            <label for="sender-name">Sender's Name:</label>
            <input type="text" id="sender-name" name="sender-name" required>
            <label for="receiver-name">Receiver's Name:</label>
            <input type="text" id="receiver-name" name="receiver-name" required>
            <label for="receiver-email">Receiver's Email:</label>
            <input type="email" id="receiver-email" name="receiver-email" required>
            <label for="receiver-suffix">Receiver's Suffix:</label>
            <select id="receiver-suffix" name="receiver-suffix" required>
                <option value="Dr.">Dr.</option>
                <option value="Sir">Sir</option>
                <option value="Madam">Madam</option>
                <option value="Sir/Madam">Sir/Madam</option>
            </select>
        `;

        let specificFields = '';
        switch (requestType) {
            case 'leave':
                specificFields = `
                    <label for="leave-from-date">From Date:</label>
                    <input type="date" id="leave-from-date" name="leave-from-date" required>
                    <label for="leave-to-date">To Date:</label>
                    <input type="date" id="leave-to-date" name="leave-to-date" required>
                    <label for="leave-reason">Reason:</label>
                    <textarea id="leave-reason" name="leave-reason" required></textarea>
                `;
                break;
            case 'late-submission':
                specificFields = `
                    <label for="project-details">Project Details:</label>
                    <textarea id="project-details" name="project-details" required></textarea>
                    <label for="project-due-date">Project Due Date:</label>
                    <input type="date" id="project-due-date" name="project-due-date" required>
                    <label for="reason-delay">Reason for Delay:</label>
                    <textarea id="reason-delay" name="reason-delay" required></textarea>
                `;
                break;
            case 'outing':
                specificFields = `
                    <label for="outing-from-date">From Date:</label>
                    <input type="date" id="outing-from-date" name="outing-from-date" required>
                    <label for="outing-from-time">From Time:</label>
                    <input type="time" id="outing-from-time" name="outing-from-time" required>
                    <label for="outing-to-date">To Date:</label>
                    <input type="date" id="outing-to-date" name="outing-to-date" required>
                    <label for="outing-to-time">To Time:</label>
                    <input type="time" id="outing-to-time" name="outing-to-time" required>
                    <label for="outing-reason">Reason:</label>
                    <textarea id="outing-reason" name="outing-reason" required></textarea>
                `;
                break;
        }

        formFields.innerHTML = commonFields + specificFields;
    }

    // Initialize by showing the main menu
    showMainMenu();
});
