chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true});

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

    document.getElementById('logout-button').addEventListener('click', async function() {
        try {
            const response = await fetch('http://localhost:5000/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await response.json();
            console.log(data);  // Log the response data for inspection
    
            if (data.success) {
                alert(data.message);
                if (data.authorization_url) {
                    window.location.href = data.authorization_url;
                }
            } else {
                alert('Logout failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error during logout:', error);
            alert('An error occurred while logging out. Please try again.');
        }
    });

    function showMainMenu() {
        mainMenu.style.display = 'block';
        emailCategories.style.display = 'none';
        requestForm.style.display = 'none';
        confirmationMessage.style.display = 'none';
    }

    let currentPage = 1;
let hasMore = true;

function showEmailCategories() {
    mainMenu.style.display = 'none';
    emailCategories.style.display = 'block';
    requestForm.style.display = 'none';
    confirmationMessage.style.display = 'none';

    // Reset pagination
    currentPage = 1;
    hasMore = true;
    categoryList.innerHTML = '';

    loadMoreEmails();
}

function loadMoreEmails() {
    if (!hasMore) return;

    fetch(`http://localhost:5000/api/email_categories?page=${currentPage}&per_page=10`)
        .then(response => response.json())
        .then(data => {
            displayEmails(data.emails);
            hasMore = data.has_more;
            currentPage++;

            if (hasMore) {
                const loadMoreButton = document.getElementById('load-more-button') || createLoadMoreButton();
                loadMoreButton.style.display = 'block';
            } else if (document.getElementById('load-more-button')) {
                document.getElementById('load-more-button').style.display = 'none';
            }
        })
        .catch(error => console.error('Error fetching email categories:', error));
}

function createLoadMoreButton() {
    const button = document.createElement('button');
    button.id = 'load-more-button';
    button.textContent = 'Load More';
    button.addEventListener('click', loadMoreEmails);
    categoryList.after(button);
    return button;
}

function displayEmails(categorizedEmails) {
    for (const [category, emails] of Object.entries(categorizedEmails)) {
        let categoryElement = document.getElementById(`category-${category}`);
        if (!categoryElement) {
            categoryElement = document.createElement('div');
            categoryElement.id = `category-${category}`;
            categoryElement.classList.add('category');
            categoryElement.innerHTML = `<h3>${category}</h3>`;
            categoryList.appendChild(categoryElement);
        }

        const emailList = categoryElement.querySelector('.email-list') || document.createElement('div');
        emailList.classList.add('email-list');
        
        emails.forEach(email => {
            const emailElement = document.createElement('div');
            emailElement.classList.add('email-item');
            emailElement.innerHTML = `
                <div class="email-header">
                    <span class="email-subject">${email.subject}</span>
                    <span class="email-date">${formatDate(email.date)}</span>
                </div>
                <div class="email-sender">${email.from}</div>
                <div class="email-snippet">${email.snippet}</div>
            `;
            emailElement.addEventListener('click', () => viewEmail(email.id));
            emailList.appendChild(emailElement);
        });

        categoryElement.appendChild(emailList);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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


    function submitFinalRequest() {
        const generatedMessage = document.getElementById('generated-message').innerHTML;
        const receiverEmail = document.getElementById('receiver-email').value;
        const receiverSuffix = document.getElementById('receiver-suffix').value;
        const subject=document.getElementById('subject').value;
        fetch('http://localhost:5000/api/final_submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                receiver_email: receiverEmail,
                receiver_suffix: receiverSuffix,
                subject:subject,
                details: generatedMessage
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
            
            <label for="subject">Subject of Mail:</label>
            <input type="text" id="subject" name="subject">
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
