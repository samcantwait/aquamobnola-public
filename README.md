# Aquamob NOLA

Aquamob NOLA is a website created for New Orlean's Premier Community Dystopian Horror Water Ballet Troupe.

Some of the features of the site include:

1. A hero section painted with a canvas element which bleeds!\
    &nbsp;&nbsp;&nbsp;&nbsp;-See the blood.js file in the js folder for the code.
2. Lazy loading images which appear with small animations on scroll.
3. A contact form which is equipped with Google reCAPTCHA verification to prevent spam from bots.
4. A newsletter subscription link.\
    &nbsp;&nbsp;&nbsp;&nbsp;-Emails are first verified using Verifalia's API.\
    &nbsp;&nbsp;&nbsp;&nbsp;-If the email is 'Deliverable' it is saved to the database.\
    &nbsp;&nbsp;&nbsp;&nbsp;-If the API returns anything other than 'Deliverable', a verification email is sent to the email address.\
    &nbsp;&nbsp;&nbsp;&nbsp;-Once the verification link from the email message is visited, the address is added to the database.\
    &nbsp;&nbsp;&nbsp;&nbsp;-All communications also feature an unsubscribe link. When visited, the address is removed from the database.
5. A photo gallery.\
    &nbsp;&nbsp;&nbsp;&nbsp;-The gallery may be sorted based on show name or photographer name.\
    &nbsp;&nbsp;&nbsp;&nbsp;-The photo gallery accesses the database to perform all of the sorting options.\
    &nbsp;&nbsp;&nbsp;&nbsp;-When a photo is clicked, it will open in a modal where a larger version of the photo may be viewed along with the photo credit details.\
    &nbsp;&nbsp;&nbsp;&nbsp;-The modal slides to the previous and next photos via on-screen buttons or with touch events.\
    &nbsp;&nbsp;&nbsp;&nbsp;-All small and large photos are lazy loaded to prevent a large initial load on page start.

This site uses Node.js, Express, MySQL, Sass, JavaScript, CSS, HTML, and EJS.
It takes advantage of some third party APIs/packages including Google reCAPTCHA, Verifalia, and Nodemailer.

[Visit the live site here](https://aquamobnola.com)
