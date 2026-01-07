const input = document.getElementById("terminalInput");
const body = document.getElementById("terminalBody");

input.addEventListener("keydown", (e) => {
if (e.key === "Enter") {
    const rawCmd = input.value.trim();
    const cmd = rawCmd.toLowerCase();
    body.innerHTML += `<br>&gt; ${rawCmd}`;

    if (cmd === "help") {
    body.innerHTML += `
        <br>Commands:
        <br>- help
        <br>- whoami
    `;
    } 
    else if(cmd == "cain"){
      openImageFromURL("Cain.png")
    }
    else if(cmd == "reaper"){
      openImageFromURL("Bilhete.png")
    }
    else if(cmd == "fumiko"){
      openImageFromURL("Diario.png")
    }
    else {
  db.collection("commands").doc(cmd).get().then(doc => {
    if (!doc.exists) {
      body.innerHTML += "<br>command not recognized.";
      return;
    }

    const data = doc.data();

    if (data.password) {
      const pass = prompt("Senha:");
      if (pass !== data.password) {
        body.innerHTML += "<br>Acesso negado.";
        return;
      }
    }

    if (data.type === "text") {
      const color = data.color || "#ffffff";
      body.innerHTML += `<br><span style="color:${color}">${data.content}</span>`;

    }

    if (data.type === "modal") {
      const modalBody = document.querySelector("#sacrificeModal .modal-body");
      const color = data.color || "#ffffff";

      modalBody.innerText = data.content;
      modalBody.style.color = color;

      openModal();
    }


    if (data.type === "image") {
      openImageFromURL(data.content);
    }
  });
}


    body.scrollTop = body.scrollHeight;
    input.value = "";
}
});

function openModal() {
document.getElementById("sacrificeModal").classList.remove("hidden");
}

function closeModal() {
  const modalBody = document.querySelector("#sacrificeModal .modal-body");
  modalBody.style.color = "#ffffff";
  document.getElementById("sacrificeModal").classList.add("hidden");
}


function openImage() {
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalImage");

  img.onload = () => {
    modal.classList.remove("hidden");
  };

  img.src = "https://picsum.photos/600/400"; // troca pela tua imagem
}
function openImageFromURL(url) {
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalImage");


  img.onload = () => modal.classList.remove("hidden");

  img.src = url;
}



function closeImage() {
  zoom = 1;
  posX = 0;
  posY = 0;
  isDragging = false;

  const img = document.getElementById("modalImage");
  img.style.transform = "translate(0px, 0px) scale(1)";
  img.classList.remove("dragging");

  document.getElementById("imageModal").classList.add("hidden");
}


let zoom = 1;
let posX = 0;
let posY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

const img = document.getElementById("modalImage");

/* ZOOM NO CURSOR */
img.addEventListener("wheel", (e) => {
  e.preventDefault();

  const rect = img.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const offsetY = e.clientY - rect.top;

  const zoomSpeed = 0.12;
  const delta = e.deltaY < 0 ? zoomSpeed : -zoomSpeed;
  const newZoom = Math.min(Math.max(zoom + delta, 1), 5);

  posX -= (offsetX / zoom) * (newZoom - zoom);
  posY -= (offsetY / zoom) * (newZoom - zoom);

  zoom = newZoom;
  applyTransform();
});

/* INICIAR DRAG */
img.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isDragging = true;
  startX = e.clientX - posX;
  startY = e.clientY - posY;
  img.classList.add("dragging");
});

/* ARRASTAR */
window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  posX = e.clientX - startX;
  posY = e.clientY - startY;
  applyTransform();
});

/* SOLTAR */
window.addEventListener("mouseup", () => {
  isDragging = false;
  img.classList.remove("dragging");
});

/* APLICAR TRANSFORMAÇÃO */
function applyTransform() {
  img.style.transform = `
    translate(${posX}px, ${posY}px)
    scale(${zoom})
  `;
}
