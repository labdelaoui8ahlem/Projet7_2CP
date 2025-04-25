
    // FAQ accordion logic
const accordion = document.getElementsByClassName('question-container');

for (let i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener('click', function () {
        // Close all others
        for (let j = 0; j < accordion.length; j++) {
            if (accordion[j] !== this) {
                accordion[j].classList.remove('active');
            }
        }

        // Toggle the clicked one
        this.classList.toggle('active');
    });
}


