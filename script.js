/*
 * Main JavaScript for the wedding website
 *
 * Handles navigation toggling on small screens, populates the current year
 * in the footer and implements simple client‑side logic for the RSVP form
 * and guest book. Guest book entries and RSVP submissions are stored
 * locally in the browser's localStorage for demonstration purposes.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu   = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });

        // Hide the mobile menu when a navigation link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Only collapse if menu is currently shown (mobile view)
                if (navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                }
            });
        });
    }

    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // RSVP form handler
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const data = {
                name: rsvpForm.querySelector('[name="name"]').value.trim(),
                email: rsvpForm.querySelector('[name="email"]').value.trim(),
                attendance: rsvpForm.querySelector('[name="attendance"]').value,
                guests: rsvpForm.querySelector('[name="guests"]').value,
                message: rsvpForm.querySelector('[name="message"]').value.trim(),
                timestamp: new Date().toISOString()
            };
            // Save RSVP to localStorage (for demo purposes)
            let rsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
            rsvps.push(data);
            localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));
            // Show thank you message
            const response = document.getElementById('rsvp-response');
            if (response) {
                response.innerHTML = `<p>Thank you, ${data.name}! Your RSVP has been received.</p>`;
            }
            rsvpForm.reset();
        });
    }

    // Guestbook form handler
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookList = document.getElementById('guestbook-entries');
    if (guestbookForm && guestbookList) {
        // Load existing entries from localStorage
        function loadGuestbook() {
            const entries = JSON.parse(localStorage.getItem('wedding_guestbook') || '[]');
            guestbookList.innerHTML = '';
            entries.forEach(entry => {
                const div = document.createElement('div');
                div.className = 'guestbook-entry';
                div.innerHTML = `<h4>${entry.name}</h4><p>${entry.message}</p><span class="entry-date">${new Date(entry.timestamp).toLocaleString()}</span>`;
                guestbookList.prepend(div);
            });
        }
        loadGuestbook();
        // Handle new submission
        guestbookForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name    = guestbookForm.querySelector('[name="name"]').value.trim();
            const message = guestbookForm.querySelector('[name="message"]').value.trim();
            if (name === '' || message === '') return;
            const newEntry = { name: name, message: message, timestamp: new Date().toISOString() };
            let entries = JSON.parse(localStorage.getItem('wedding_guestbook') || '[]');
            entries.push(newEntry);
            localStorage.setItem('wedding_guestbook', JSON.stringify(entries));
            guestbookForm.reset();
            loadGuestbook();
        });
    }
});