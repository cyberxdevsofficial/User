// Hamburger Menu
const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

if (toggle && menu) {
    toggle.addEventListener("click", () => {
        menu.classList.toggle("show");
    });
}

// --- EXISTING FUNCTIONALITY ---

// Booking Form WhatsApp Redirect
const bookingForm = document.getElementById("booking-form");
const roomDetailsDiv = document.getElementById("room-details");

if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const room = document.getElementById("room").value;
    const guests = document.getElementById("guests").value;
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;

    if (!room || !guests || !checkin || !checkout) {
      alert("Please fill in all fields");
      return;
    }

    let price = room === "Superior King Room" ? 69.82 : 89.77;
    roomDetailsDiv.innerHTML = `
      <h2>${room}</h2>
      <p>Price: $${price} per night</p>
      <p>Guests: ${guests}</p>
      <p>Check-in: ${checkin}</p>
      <p>Check-out: ${checkout}</p>
    `;

    const message = encodeURIComponent(
      `Room: ${room}\nNumber of Guests: ${guests}\nCheck-in: ${checkin}\nCheck-out: ${checkout}`
    );
    window.location.href = `https://wa.me/94710695082?text=${message}`;
  });
}

// Contact Form mailto redirect
const contactForm = document.getElementById("contact-form");
// We check if 'name' input exists to ensure it's the contact form, not auth form
if (contactForm && document.getElementById("message")) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const message = document.getElementById("message")?.value;

    if (name && email && message) {
      const subject = encodeURIComponent(`New message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:wildheavenbeach@gmail.com?subject=${subject}&body=${body}`;
    }
  });
}

// --- NEW AUTHENTICATION FUNCTIONALITY ---

// Handle Sign Up
const signupForm = document.getElementById("signup-form");
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const btn = signupForm.querySelector('button');

        try {
            btn.innerText = "Creating...";
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                alert("Account created! Please sign in.");
                window.location.href = "/signin";
            } else {
                alert(data.message || "Error creating account");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
        } finally {
            btn.innerText = "Sign Up";
        }
    });
}

// Handle Sign In
const signinForm = document.getElementById("signin-form");
if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const btn = signinForm.querySelector('button');

        try {
            btn.innerText = "Signing In...";
            const res = await fetch('/api/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                // Store token in LocalStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                alert("Login Successful! Welcome, " + data.user.name);
                window.location.href = "/";
            } else {
                alert(data.message || "Invalid credentials");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        } finally {
            btn.innerText = "Sign In";
        }
    });
}

// Check Login Status & Update Nav
// We run this on every page load
document.addEventListener("DOMContentLoaded", () => {
    const navMenu = document.getElementById("menu");
    const token = localStorage.getItem('token');

    if (navMenu) {
        if (token) {
            // User is logged in
            const logoutLink = document.createElement('a');
            logoutLink.href = "#";
            logoutLink.innerText = "Logout";
            logoutLink.style.color = "#ff6b6b"; // Make it reddish to stand out
            
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                if(confirm("Are you sure you want to logout?")) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = "/";
                }
            });
            navMenu.appendChild(logoutLink);
        } else {
            // User is NOT logged in
            // Check if we are already on the login page to avoid double links
            if (!window.location.pathname.includes('signin')) {
                const loginLink = document.createElement('a');
                loginLink.href = "/signin";
                loginLink.innerText = "Login";
                navMenu.appendChild(loginLink);
            }
        }
    }
});
