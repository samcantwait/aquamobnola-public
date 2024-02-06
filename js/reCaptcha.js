// If the form submit button is pressed before the reCAPTCHA is checked, this function will advise the user to check the form. The function then returns without submitting the form.
// If the reCAPTCHA has been completed, the form will be submitted.

export function reCaptcha() {
  const contactForm = document.querySelector(".contact__form");
  contactForm.addEventListener("submit", checkForm);

  function checkForm(e) {
    e.preventDefault();
    const captchaMsg = document.querySelector(".captcha-msg");
    const captcha = document.querySelector("#g-recaptcha-response").value;

    if (!captcha) {
      captchaMsg.innerHTML = "Plase cheack the reCAPTCHA";
      return;
    }
    contactForm.submit();
  }
}
