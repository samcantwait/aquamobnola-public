const body = document.querySelector("body");
const photoGrid = document.querySelector(".photo-grid");
const loadMore = document.querySelector(".photo-grid__load");
const photoModal = document.querySelector(".photo-grid__modal");
const previous = document.querySelector(".photo-grid__prev");
const next = document.querySelector(".photo-grid__next");
const heading = document.querySelector(".main-gallery__heading");
const links = document.querySelectorAll(".navigation__item");
const photoRow = document.querySelector(".photo-grid__modal-container");

/* This script pulls the following variables from the embedded script on the photo gallery page.
    var results;
    var showName;
    var photographerName;
    var allShows;
    var allPhotographers;
*/

let startingWidth = window.innerWidth;

// Set the active link to gallery
links.forEach((link) => {
  if (link.getAttribute("data-id") == "gallery") {
    link.classList.add("navigation__item--active");
  }
});

// Set the heading to the show name if there is one, else to the photographer name, else to all photos.
if (showName) {
  allShows.forEach((show) => {
    if (show.name === showName) {
      heading.innerText = show.full_name;
    }
  });
} else if (photographerName) {
  allPhotographers.forEach((photographer) => {
    if (photographer.name.toLowerCase() === photographerName) {
      heading.innerText = photographer.name;
    }
  });
} else {
  heading.innerText = "All Photos";
}

// Determine how many columns to display based on the screen size.
let columns = 4;
const findColumns = () => {
  if (window.innerWidth < 950) {
    photoGrid.style.setProperty("--columns", "2");
    columns = 2;
  }
  if (window.innerWidth < 512) {
    photoGrid.style.setProperty("--columns", "1");
    columns = 1;
  }
};
findColumns();

// If the screen size changes beyond the breakpoints, reload the page to display the proper column arangement.
window.addEventListener("resize", () => {
  if (
    (window.innerWidth < 950 && 950 < startingWidth) ||
    (window.innerWidth > 950 && 950 > startingWidth) ||
    (window.innerWidth > 512 && 512 < startingWidth) ||
    (window.innerWidth > 512 && 512 > startingWidth)
  ) {
    location.reload();
  }
});

// Function to shuffle the order of the photos. This is in order to not favor specific photos.
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}
results = shuffle(results);

// Create the columns.
let n = 1;
while (n <= columns) {
  const newColumn = document.createElement("div");
  newColumn.classList.add("photo-grid__column", `photo-grid__column-${n}`);
  photoGrid.appendChild(newColumn);
  n++;
}

// Copy the results variable from the embedded script into a new array to avoid mutating the original array.
const resultsCopySmall = [...results];
let i = 1;
let skip = [];
let colHeight = 0;
// Function to add the photos to our photo grid.
function postSmallPhotos() {
  const findColumns = document.querySelectorAll(".photo-grid__column");
  // Splice the first 16 results off the array and load them into the photo grid.
  resultsCopySmall.splice(0, 16).forEach((item) => {
    // Create an image for each result and set its attributes and class.
    const image = document.createElement("img");
    image.setAttribute("srcset", `${item.url_600} 600w, ${item.url_350} 350w`);
    image.setAttribute("sizes", "50vw");
    image.setAttribute("src", `${item.url_600}`);
    image.setAttribute("alt", `${item.alt_text}`);
    image.classList.add("photo-grid__image");
    // Some of the images are longer than the others and throw off the length of the columns.
    // If the last item in a column was long, we skip that column the next time through.
    if (i === skip[0]) {
      skip.shift();
      i++;
      if (i > columns) i = 1;
    }
    // Append the image to the document.
    document.querySelector(`.photo-grid__column-${i}`).appendChild(image);

    // If the photo is long, add it to the skip queue. I am using an array for the queue because my data set is small enough. (max size is 4)
    if (item.is_long === "true") {
      skip.push(i);
    }
    if (i >= columns) i = 1;
    else i++;
  });
  // Remove the "load more" button when we no longer have photos to display.
  if (resultsCopySmall.length < 1) {
    loadMore.style.display = "none";
  }
}
postSmallPhotos();

// Create an array for the fullsize photos.
const resultsCopyLarge = [...results];
let j = 0;
const photoArray = [];
function postLargePhotos() {
  resultsCopyLarge.splice(0, 16).forEach((item) => {
    // Create wrappers to store images in and assign classes to them.
    const wrapper = document.createElement("div");
    wrapper.classList.add("photo-grid__wrapper");
    const container = document.createElement("div");
    container.classList.add("photo-grid__container");
    // Create an image for each result and set its attributes and class.
    const image = document.createElement("img");
    // Set a data attribute which will later be used to lazy load the images. The image size will be based on the browser window size.
    image.setAttribute(
      "data-source",
      `${window.innerWidth > 600 ? item.url_2000 : item.url_600}`
    );
    image.setAttribute("alt", `${item.alt_text}`);
    image.classList.add("photo-grid__image--large");
    // Create a holder for the photo credit.
    const credit = document.createElement("p");
    credit.classList.add("photo-grid__credit");
    credit.innerText = `Photo by ${item.name}`;
    // Append everything to the appropriate containers.
    container.appendChild(image);
    container.appendChild(credit);
    wrapper.appendChild(container);
    photoRow.appendChild(wrapper);
    // Add each wrapper to the photoArray. The array will be accessed later.
    photoArray.push(wrapper);
    j++;
  });
}
postLargePhotos();

// Load more photos when clicked.
loadMore.addEventListener("click", () => {
  if (resultsCopySmall) {
    postSmallPhotos();
    postLargePhotos();
  }
});

// ----------------------------PHOTO MODAL SECTION---------------------------------

// Function to lazyLoad the large photos.
function lazyLoad(pos) {
  const photoDisplay = photoArray[pos].querySelector("img");
  if (!photoDisplay.getAttribute("src")) {
    photoDisplay.setAttribute("src", photoDisplay.dataset.source);
  }
}

// Declare and initialize needed variables.
let curSlide = 0,
  start,
  position,
  curPos = 0;

// Function to shift the photo container to the proper position to display the current photo.
function slide(pos) {
  lazyLoad(pos);
  // Each photo container has a width of 100vw. To slide the correct one into view, take the current position multiplied by 100.
  photoRow.style.left = `-${pos * 100}vw`;
  // If at the end or beginning of the photo array, do not display the forward or back arrows respectively.
  if (curSlide === results.length - 1) {
    next.style.display = "none";
  } else {
    next.style.display = "block";
  }
  if (curSlide === 0) {
    previous.style.display = "none";
  } else {
    previous.style.display = "block";
  }
}

// Event listener to open the photo modal.
photoGrid.addEventListener("click", (e) => {
  if (!e.target.classList.contains("photo-grid__image")) return;

  // Find the index of the clicked photo and assign it to the curSlide.
  const compare = (item) => item.url_600 == e.target.getAttribute("src");
  curSlide = results.findIndex(compare);

  // Lazy load current photo and move it into view.
  slide(curSlide);
  photoModal.style.display = "block";
});

// Add event listener to close the photo modal.
photoModal.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("photo-grid__modal-container") ||
    e.target.classList.contains("photo-grid__close")
  ) {
    photoModal.style.display = "none";
  }
});

// Function to change the visible photo to the next in the array.
function nextSlide() {
  if (curSlide === photoArray.length - 1 && resultsCopySmall) {
    postSmallPhotos();
    postLargePhotos();
  }
  if (curSlide < photoArray.length - 1) {
    curSlide++;
    slide(curSlide);
  }
}

// Function to change the visible photo to the previous in the array.
function prevSlide() {
  if (curSlide > 0) {
    curSlide--;
    slide(curSlide);
  }
}

// Listen for click on mext arrow and previous arrow.
next.addEventListener("click", nextSlide);
previous.addEventListener("click", prevSlide);

// Listen for touch events on the photo modal.
photoModal.addEventListener("touchstart", (e) => {
  // If the target of the touchevent is the modal container, prevent the default action. This is to prevent the background from moving when using touch gestures.
  if (e.target.classList.contains("photo-grid__modal-container")) {
    e.target.addEventListener("touchmove", (e) => {
      e.preventDefault();
    });
  }
});

// Listen for touch events on the photo container.
photoRow.addEventListener("touchstart", (e) => {
  // Record the intial touch position and the current container position so they may be used in the 'touchmove' event listener.
  start = e.touches[0].clientX;
  curPos = photoRow.getBoundingClientRect().left;
  // Load the previous and next photos so they will be visible during the touchmove event. They are lazy loaded so if not loaded here, will show as a broken image.
  if (curSlide !== 0) lazyLoad(curSlide - 1);
  // If the next photo has not yet been added to the photos array, add it.
  if (curSlide === photoArray.length - 1 && resultsCopySmall) {
    postSmallPhotos();
    postLargePhotos();
  }
  if (curSlide !== photoArray.length - 1) lazyLoad(curSlide + 1);
});

// Listen for touch events on the photo container.
photoRow.addEventListener("touchmove", (e) => {
  position = e.touches[0].clientX;
  // Determine the left position for the photo container based on the touch position.
  let left = -(start - position - curPos);
  // If the touchposition is not greater than the photo container width and not less than 0, then set the left position.
  if (Math.abs(left) < photoRow.scrollWidth - window.innerWidth && left < 0) {
    photoRow.style.left = `${left}px`;
  }
});

// Listen for touchend event on photo container.
photoRow.addEventListener("touchend", (e) => {
  // Get the current position of the photo container and save it to curPos.
  curPos = photoRow.getBoundingClientRect().left;
  // Equation to determine if the photo was moved more than halfway past the width of the window. If it was, curSlide will be set accordingly.
  curSlide =
    Math.round((window.innerWidth + Math.abs(curPos)) / window.innerWidth) - 1;
  slide(curSlide);
});

// Event listener to move the photo container based on clicks on the far left or far right of the screen.
photoRow.addEventListener("click", (e) => {
  const target = e.target.classList;
  if (
    target.contains("photo-grid__container") ||
    target.contains("photo-grid__image--large") ||
    target.contains("photo-grid__credit")
  ) {
    if (window.innerWidth - window.innerWidth / 3 < e.clientX) {
      nextSlide();
    } else if (window.innerWidth / 3 > e.clientX) {
      prevSlide();
    }
  }
});
