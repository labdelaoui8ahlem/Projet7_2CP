document.addEventListener("DOMContentLoaded", () => {
    // Load navbar from separate file
    fetch("navbar.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
            // Activate current nav link
            const navLinks = document.querySelectorAll('.nav-link');
            const currentPage = window.location.pathname.split('/').pop();

            navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                if (linkHref === currentPage || (linkHref === 'Home.html' && (currentPage === '' || currentPage === 'Home.html'))) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // ✅ Responsive hamburger menu toggle logic (now inside .then)
            const toggle = document.querySelector('.menu-toggle');
            const navList = document.querySelector('.nav-list');
            if (toggle && navList) {
                toggle.addEventListener('click', () => {
                    navList.classList.toggle('active');
                });
            }
        });
});

// animation de l'upload button
const btn = document.getElementById("uploadBtn");
const spinner = document.getElementById("spinner");
const text = document.getElementById("btnText");
const uploadIcon = document.getElementById("uploadIcon"); // ⬅ Get the image

btn.addEventListener("click", () => {
  spinner.classList.remove("hidden");
  text.textContent = "Uploading...";
  uploadIcon.style.display = "none"; // ⬅ Hide image

  // Simulate file upload
  setTimeout(() => {
    text.textContent = "Upload a file";
    spinner.classList.add("hidden");
    uploadIcon.style.display = "inline"; // ⬅ Show image again
    alert("Fichier envoyé !");
  }, 3000);
});
