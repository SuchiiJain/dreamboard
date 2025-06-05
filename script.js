// Get references
const board = document.getElementById("visionBoard");
const addTextBtn = document.getElementById("addTextBtn");
const addEmojiBtn = document.getElementById("addEmojiBtn");
const affirmationInput = document.getElementById("affirmationInput");
const emojiPicker = document.getElementById("emojiPicker");
const imageUpload = document.getElementById("imageUpload");

// Utility to generate random position
function randomPosition() {
  return {
    x: Math.floor(Math.random() * (board.offsetWidth - 200)),
    y: Math.floor(Math.random() * (board.offsetHeight - 200)),
  };
}

// Create draggable element
function makeBoardItem(content, type = "text") {
  const div = document.createElement("div");
  div.classList.add("board-item");

  const pos = randomPosition();
  div.style.left = pos.x + "px";
  div.style.top = pos.y + "px";

  if (type === "text") {
    const p = document.createElement("p");
    p.innerText = content;
    div.appendChild(p);
  } else if (type === "emoji") {
    const p = document.createElement("p");
    p.style.fontSize = "2.5rem";
    p.innerText = content;
    div.appendChild(p);
  } else if (type === "image") {
    const img = document.createElement("img");
    img.src = content;
    div.appendChild(img);
  }

  board.appendChild(div);

  // Enable dragging
  div.onmousedown = function (e) {
    let shiftX = e.clientX - div.getBoundingClientRect().left;
    let shiftY = e.clientY - div.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      div.style.left = pageX - shiftX + 'px';
      div.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    div.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      div.onmouseup = null;
    };
  };

  div.ondragstart = () => false;
}

addTextBtn.addEventListener("click", () => {
  const txt = affirmationInput.value.trim();
  const font = document.getElementById("fontSelect").value;
  const color = document.getElementById("fontColor").value;
  const size = document.getElementById("fontSize").value;

  if (txt) {
    const div = document.createElement("div");
    div.classList.add("board-item");
    const pos = randomPosition();
    div.style.left = pos.x + "px";
    div.style.top = pos.y + "px";

    const p = document.createElement("p");
    p.innerText = txt;
    p.style.fontFamily = font;
    p.style.color = color;
    p.style.fontSize = size + "px";
    div.appendChild(p);

    board.appendChild(div);

    // Enable dragging
    div.onmousedown = function (e) {
      let shiftX = e.clientX - div.getBoundingClientRect().left;
      let shiftY = e.clientY - div.getBoundingClientRect().top;

      function moveAt(pageX, pageY) {
        div.style.left = pageX - shiftX + 'px';
        div.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(e) {
        moveAt(e.pageX, e.pageY);
      }

      document.addEventListener('mousemove', onMouseMove);

      div.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        div.onmouseup = null;
      };
    };

    div.ondragstart = () => false;

    // Reset input
    affirmationInput.value = "";
  }
});

// Add emoji
addEmojiBtn.addEventListener("click", () => {
  const emoji = emojiPicker.value;
  makeBoardItem(emoji, "emoji");
});

// Upload image
imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    makeBoardItem(e.target.result, "image");
  };
  reader.readAsDataURL(file);

  // Reset the input
  imageUpload.value = "";
});
