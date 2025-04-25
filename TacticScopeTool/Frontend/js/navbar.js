function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.style.display = 'flex';
    }
}

function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Load navbar
    fetch("navbar.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;

            // Highlight the active nav link
            const navLinks = document.querySelectorAll('nav a[href]');
            const currentPage = window.location.pathname.split('/').pop();

            navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                if (
                    linkHref === currentPage ||
                    (linkHref === 'index.html' && (currentPage === '' || currentPage === 'index.html'))
                ) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Re-attach show/hide listeners because navbar.html was loaded dynamically
            document.querySelectorAll('.menu-toggle a')?.[0]?.addEventListener('click', (e) => {
                e.preventDefault();
                showSidebar();
            });

            document.querySelector('.sidebar li a')?.addEventListener('click', (e) => {
                e.preventDefault();
                hideSidebar();
            });

            // Auto-hide sidebar on large screens
            window.addEventListener('resize', () => {
                const sidebar = document.querySelector('.sidebar');
                if (window.innerWidth > 768 && sidebar?.style.display === 'flex') {
                    hideSidebar();
                }
            });
        });
});

            // Highlight active nav
          //  const navLinks = document.querySelectorAll('.hideOnMobile');
          //  const currentPage = window.location.pathname.split('/').pop();

        //    navLinks.forEach(link => {
      //          const linkHref = link.getAttribute('href');
    //            if (
                 //   linkHref === currentPage ||
               //     (linkHref === 'index.html' && (currentPage === '' || currentPage === 'index.html'))
             //   ) {
           //         link.classList.add('active');
         //       } else {
       //             link.classList.remove('active');
     //           }
   //         });

            // Hamburger toggle
           // const toggle = document.querySelector('.menu-toggle');
           // const navList = document.querySelector('.nav-list');
           // if (toggle && navList) {
         //       toggle.addEventListener('click', () => {
               //     navList.classList.toggle('active');
             //   });

        