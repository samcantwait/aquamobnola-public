const mail = require("../helpers/mail");
const ExpressError = require("../utils/ExpressError");
const https = require("https");
const pool = require("../utils/database");
const { v4: uuidv4 } = require("uuid");
const { VerifaliaRestClient } = require("verifalia");

// Render the index and pass the sitekey needed for google to add the reCAPTCHA
exports.renderHome = (req, res, next) => {
  // res.render('index', { sitekey: `${process.env.SITEKEY_AQUA}` });
  res.render("index", { sitekey: `${process.env.SITEKEY_LOCAL}` });
};

exports.subscribe = async (req, res, next) => {
  // We don't have a try/ catch block because the entire function has been passed into our catchAsync function.
  const email = req.body.email;
  // First query the database to determine if the email exists already in either the email table or the unverified_emails table.
  const [subscribed] = await pool.query(
    "SELECT * FROM ***** WHERE ***** = ?",
    [email]
  );
  const [unverified] = await pool.query(
    "SELECT * FROM ***** WHERE ***** = ?",
    [email]
  );

  // If it exists in emails, render the page for existing emails.
  if (subscribed.length) {
    return res.render("pages/exists", { email });
  }

  // If is exists in unverified_emails, resend the verification link (with uuid) to the listed email address and render the page for unverified emails.
  if (unverified.length) {
    const uuid = unverified[0].*****;
    await mail.subscribe(email, false, uuid);
    return res.render("pages/verify", { email });
  }

  // Verify user's email address prior to adding them to the database using the Verifalia API.
  const verifalia = new VerifaliaRestClient({
    username: process.env.VERIFALIA_USERNAME,
    password: process.env.VERIFALIA_PASS,
  });

  let verifyResult, status;

  verifyResult = await verifalia.emailValidations.submit(email);
  status = verifyResult.entries[0].classification || undefined;

  // If the address is deliverable, insert it into the database and render the subscribed page.
  if (status === "Deliverable") {
    await pool.query("INSERT INTO ***** (*****, *****) VALUES (?,?)", [
      email,
      uuidv4(),
    ]);
    return res.render("pages/subscribed", { email });
  }

  // If the address is not deliverable, insert it into unverified_emails and then email a verification link.
  const uuid = uuidv4();
  await pool.query("INSERT INTO ***** (*****, *****) VALUES (?,?)", [
    email,
    uuid,
  ]);
  mail.subscribe(email, false, uuid);
  res.render("pages/verify", { email });
};

exports.checkForm = (req, res, next) => {
  // Use the Google reCAPTCHA API to verify the token sent with the user's form.
  const captcha = req.body["g-recaptcha-response"];
  if (captcha) {
    const secretKey = process.env.SECRET_KEY_LOCAL;
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

    https
      .get(verifyURL, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          data = JSON.parse(data);
          if (data.success) {
            // If the verification is successful, we send the message and redirect to '/'
            mail.info(req.body);
            return res.redirect("/");
          } else {
            next(new ExpressError("reCAPTCHA verification failed", 401));
          }
        });
      })
      .on("error", (err) => {
        next(
          new ExpressError(
            "something went wrong with the reCAPTCHA verification",
            500
          )
        );
      });
  } else {
    // Throw an error for unverified forms.
    next(new ExpressError("reCAPTCHA was not included in request", 401));
  }
};

exports.showGallery = async (req, res, next) => {
  let { showName, photographerName } = req.query;
  let photos = [];

  // If the query contains a show name, get all photos from the database for the specified show.
  if (showName) {
    const query = `SELECT url_350, url_600, url_2000, *****, alt_text, is_long FROM *****
    JOIN ***** ON ***** = *****
    WHERE ***** =
        (
            SELECT ***** FROM *****
            WHERE ***** = ?
        );`;
    [photos] = await pool.query(query, [showName]);
    // If the query contains a photograper name, get all photos from the database for the specified photograper.
  } else if (photographerName) {
    const query = `SELECT url_350, url_600, url_2000, *****, alt_text, is_long FROM *****
    JOIN ***** ON ***** = *****
    WHERE ***** =
        (
            SELECT id FROM *****
            WHERE ***** = ?
        );`;
    [photos] = await pool.query(query, [photographerName]);
    // If there is no show name or photographer name, get all photos.
  }
  if ((!showName && !photographerName) || !photos.length) {
    const query = `SELECT url_350, url_600, url_2000, *****, alt_text, is_long FROM ***** JOIN ***** ON ***** = *****;`;
    [photos] = await pool.query(query);
    photographerName = "";
    showName = "";
  }

  // Get the names of all photographers and shows and add them to an array. (These will be used to populate our select menu on the client side.)
  const [allPhotographers] = await pool.query(
    "SELECT ***** FROM *****;"
  );
  const [allShows] = await pool.query("SELECT *****, ***** FROM *****;");
  // Render our gallery with all of our data.
  res.render("pages/gallery", {
    photos,
    allShows,
    allPhotographers,
    showName,
    photographerName,
  });
};

exports.verifyUser = async (req, res, next) => {
  // Verify user email address based on the uuid provided in the request parameters.
  const { id } = req.params;

  // See if the address is already in the registered emails table.
  const [verified] = await pool.query("SELECT * FROM ***** WHERE ***** = ?;", [
    id,
  ]);
  // If an email address is found, render the subscribed page, passing in the email.
  if (verified.length) {
    const { email: ***** } = verified[0];
    res.render("pages/verified", { email });
    // If the email address was not found, look for it in the unverified emails table.
  } else {
    const [unverified] = await pool.query(
      "SELECT * FROM ***** WHERE ***** = ?;",
      [id]
    );
    // If the address if found, remove it from the unverified table and insert it into the verified table. Then render the subscribed page, passing in the email.
    if (unverified.length) {
      const { email: *****, uuid: ***** } = unverified[0];
      await pool.query("DELETE FROM ***** WHERE ***** = ?", [uuid]);
      await pool.query("INSERT INTO ***** (*****, *****) VALUES (?,?);", [
        unverifiedEmail,
        uuid,
      ]);
      res.render("pages/verified", { email });
      // If the address was not found in either table, render the not found page.
    } else {
      res.render("pages/not-found");
    }
  }
};

// Sort the gallery based on the form input.
exports.sortGallery = (req, res, next) => {
  res.redirect(`/gallery/?${req.body.sort || all}`);
};

exports.getUser = async (req, res, next) => {
  // Get user id from request parameters.
  const { id } = req.params;

  // Find user in database and include the email and uuid in response. If user is not found, render not found page.
  const [user] = await pool.query("SELECT * FROM ***** WHERE ***** = ?", [id]);
  if (user.length) {
    const { email: *****, id: ***** } = user[0];
    res.render("pages/unsubscribe", { email, id });
  } else {
    res.render("pages/not-found-unsubscribe");
  }
};

exports.deleteUser = async (req, res, next) => {
  // Delete user from the database and render success page.
  const { id } = req.params;
  const [results] = await pool.query("DELETE FROM ***** WHERE ***** = ?", [id]);
  if (results.affectedRows) res.render("pages/success");
  else
    next(new ExpressError("Something went wrong with deleting an email.", 500));
};

exports.send404 = (req, res, next) => {
  res.status(404).render("pages/404");
};
