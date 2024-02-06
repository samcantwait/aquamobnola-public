export const tickets_modal = () => {
  // Function to create the subscribe modal (previously for tickets, hence the name).
  const body = document.querySelector("body");
  // Create the modal with HTML.
  const html = `<section id="tickets" class="tickets mb-large">
        <div class="tickets__overlay">
            <span class="tickets__close">&#10006;</span>
            <img src="/images/ripley/brian-boudreaux/brian-boudreaux-9-600.webp" alt="Synchronized swimmers" class="tickets__image">
            <div class="tickets__text">
                <h2 class="heading-secondary center-text tickets__heading">Want to stay updated?</h2>
                <p class="tickets__info">Join our mailing list!<span class="tickets__span">We'll let you know about upcoming events and ticket sales.</span> </p>
                <form class="tickets__form index__form" method="POST" action="/subscribe">
                    <input type="email" name="email" class="tickets__input" placeholder="Email address" required>
                    <button class="tickets__button submit--btn" type="submit">Submit here</button>
                </form>
            </div>
        </div>
    </section>`;

  // Insert the html into the body of the document.
  body.insertAdjacentHTML("beforeend", html);

  const modal = document.querySelector(".tickets");
  const openModal = document.querySelectorAll(".tickets-link");
  const forms = document.querySelectorAll(".index__form");

  // Attach the event listener to each subscribe link. The link is on the navbar and will be displayed on a number of different pages. This will attach the event to every instance.
  openModal.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.left = "0";
    });
  });

  // Event listener to close the modal which simply translates it off of the viewable screen.
  modal.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("tickets") ||
      e.target.classList.contains("tickets__close")
    ) {
      modal.style.left = "-100vw";
    }
  });

  // When the submit button has been pressed, change the inner text to 'Submitting...' and disable the button so the form may not be submitted again.
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      if (form.classList.contains("is-submitting")) {
        e.preventDefault();
      }
      form.classList.add("is-submitting");
      form.querySelector(".submit--btn").innerText = "Submitting...";
    });
  });
};
