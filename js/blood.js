export const bloodFeature = () => {
  // Function to create the blood feature from the site's header section.
  const canvas = document.querySelector(".bloody__canvas");
  const ctx = canvas.getContext("2d");

  const bloodyDiv = document.querySelector(".bloody");
  const bloodBtn = document.querySelector(".bloody__stop");

  let height, width;

  // Create a canvas for the blood.
  function createCanvas() {
    const header = document.querySelector(".header");
    header.style.height = `${window.innerHeight}px`;
    bloodyDiv.style.height = `${window.innerHeight}px`;
    height = window.innerHeight + 400;
    width = window.innerWidth;
    canvas.height = height;
    canvas.width = width;
  }
  createCanvas();

  // Create the location, radius, and speed for the blood drips in a blood class.
  class Blood {
    constructor(x, y, radius, speed) {
      this.x = x;
      this.x2 = x;
      this.y = y;
      this.y2 = y;
      this.radius = radius;
      this.speed = speed;
    }

    // Class method to draw the blood.
    drawBlood() {
      ctx.beginPath();
      ctx.arc(this.x2, this.y2, this.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = "rgb(177, 12, 12, 0.5)";
      ctx.fill();
    }
  }

  let myReq;
  // Animate the blood drops on the canvas
  const animate = (drips, animationName) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.002)";
    ctx.fillRect(0, 0, width, height);
    drips.forEach((drip) => {
      const direction = Math.random() * 2 - 1;
      drip.y2 += drip.speed;
      drip.x2 += direction;
      if (drip.y2 >= height) {
        drip.y2 = drip.y;
        drip.x2 = drip.x;
      }
      drip.drawBlood();
    });
    clearInterval(animationName);
    drips.myReq = requestAnimationFrame(function () {
      animate(drips);
    });
  };

  let allDrips, firstDrips, secondDrips;
  function createBlood() {
    // Function to create the blood.
    const setX = () => Math.random() * width;
    const setY = () => Math.random() * -1000;
    const setRadius = () => Math.random() * 8;
    const setSpeed = () => Math.random() * 3.5;

    // Create new blood objects using the blood class.
    allDrips = [];
    firstDrips = [
      new Blood(width / 3, 0, 4, 0.5),
      new Blood(width / 2, 0, 2, 0.5),
    ];
    secondDrips = [
      new Blood(width / 4, 0, 4, 0.5),
      new Blood(width - width / 3, 0, 5, 0.5),
    ];

    let i = 0;
    while (i < width / 8) {
      allDrips.push(new Blood(setX(), setY(), setRadius(), setSpeed()));
      i++;
    }
  }
  createBlood();

  // Set different intervals for the blood arrays so they start at staggered times.
  let firstDripsDelay, secondDripsDelay, allDripsDelay;
  function bleed() {
    firstDripsDelay = setInterval(function () {
      animate(firstDrips, firstDripsDelay);
    }, 0);
    secondDripsDelay = setInterval(function () {
      animate(secondDrips, secondDripsDelay);
    }, 4000);
    allDripsDelay = setInterval(function () {
      animate(allDrips, allDripsDelay);
    }, 9000);
  }
  bleed();

  // Start the animation
  function startBlood() {
    ctx.clearRect(0, 0, width, height);
    createCanvas();
    canvas.style.display = "block";
    createBlood();
    bleed();
    bloodBtn.innerText = "Stop the blood!";
  }

  // Stop the animation and clear the canvas.
  function stopBlood() {
    cancelAnimationFrame(firstDrips.myReq);
    cancelAnimationFrame(secondDrips.myReq);
    cancelAnimationFrame(allDrips.myReq);
    canvas.style.display = "none";
    bloodBtn.innerText = "Make it bleed";
  }

  // Event listener for the 'stop the blood' button.
  let clicked = false;
  bloodBtn.addEventListener("click", () => {
    if (clicked === true) startBlood();
    else stopBlood();
    clicked = clicked === false ? true : false;
  });

  // If the window is resized, restart the blood. The blood will not display correctly otherwise because the canvas will be the wrong size.
  window.addEventListener("resize", () => {
    if (
      height !== bloodyDiv.offsetHeight + 400 ||
      width !== bloodyDiv.offsetWidth
    ) {
      setTimeout(() => {
        stopBlood();
        clearInterval(firstDripsDelay);
        clearInterval(secondDripsDelay);
        clearInterval(allDripsDelay);
        createCanvas();
        startBlood();
      }, 0);
    }
  });
};
