fetch("footer.html")
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text();
    })
    .then(data => {
        document.getElementById("footer-container").innerHTML = data;
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });
