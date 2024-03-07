import fs from "fs";
import os from "os";
import path from "path";
import sharp from "sharp";

const thumbnailsDir = path.join(
  os.tmpdir(),
  "cinnabar-forge",
  "snapserve",
  "gallery",
  "thumbnails",
);

if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

function generateThumbnail(imagePath) {
  const filename = path.basename(imagePath);
  const thumbnailPath = path.join(thumbnailsDir, filename);

  return sharp(imagePath)
    .resize(200)
    .toFile(thumbnailPath)
    .then(() => thumbnailPath);
}

function generateGalleryHTML(images) {
  const imagesHTML = images
    .map(
      (image, index) =>
        `<img src="/thumbnails/${image}" onclick="openFullscreen('${image}', ${index})" style="cursor: pointer;" alt="Image ${index}: ${image}" />`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>

<head>
  <title>Gallery</title>
  <style>
    .gallery img {
      max-width: 200px;
      margin: 10px;
      transition: transform 0.2s;
    }

    .gallery img:hover {
      transform: scale(1.05);
    }

    .modal {
      display: none;
      position: fixed;
      z-index: 999;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: rgba(0, 0, 0, 0.9);
    }

    .modal-content {
      margin: auto;
      display: block;
      height: auto;
      max-height: 100%;
      width: auto;
      max-width: 100%;
      user-select: none;
      -webkit-user-drag: none;
    }

    .close {
      color: #f1f1f1;
      font-size: 40px;
      font-weight: bold;
      cursor: pointer;
      user-select: none;
    }

    .close:hover {
      color: orange;
    }
  </style>
  <script>
    let currentIndex = 0
    const images = [${images.map((image) => `'${image}'`).join(",")}]

    let currentZoom = 1

    function zoomIn() {
      currentZoom *= 1.1
      updateZoom()
    }

    function zoomOut() {
      currentZoom /= 1.1
      updateZoom()
    }

    function updateZoom() {
      const img = document.getElementById('imgFullscreen')
      img.style.transform = \`scale(\${currentZoom})\`
    }

    function resetZoom() {
      currentZoom = 1
      updateZoom()
    }

    function openFullscreen(imageName, index) {
      currentIndex = index
      document.getElementById('imgFullscreen').src = '/images/' + imageName
      document.getElementById('modal').style.display = 'block'
    }

    function closeModal() {
      document.getElementById('modal').style.display = 'none'
    }

    function navigate(offset) {
      currentIndex = (currentIndex + offset + images.length) % images.length
      document.getElementById('imgFullscreen').src = '/images/' + images[currentIndex]
      resetZoom()
    }

    function handleWheel(e) {
      e.preventDefault()
      if (e.deltaY < 0) {
        zoomIn()
      } else if (e.deltaY > 0) {
        zoomOut()
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      const imgFullscreen = document.getElementById('imgFullscreen')
      imgFullscreen.addEventListener('wheel', handleWheel, { passive: false })
    })

    window.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { navigate(1) }
      if (e.key === 'ArrowLeft') { navigate(-1) }
    });
  </script>
</head>

<body>
  <div class="gallery">
    ${imagesHTML}
  </div>

  <div id="modal" class="modal">
    <img class="modal-content" id="imgFullscreen">
    <div class="close" style="position: fixed; top: 15px; right: 35px;" onclick="closeModal()">&times;</div>
    <div class="close" style="position: fixed; top: 50%; left: 30px;" onclick="navigate(-1)">&#10094;</div>
    <div class="close" style="position: fixed; top: 50%; right: 30px;" onclick="navigate(1)">&#10095;</div>
    <div class="close" style="position: fixed; top: 55px; right: 35px;" onclick="zoomIn()">&plus;</div>
    <div class="close" style="position: fixed; top: 95px; right: 35px;" onclick="zoomOut()">&minus;</div>
  </div>
</body>

</html>
`;
}

export default function (app, folder) {
  app.get("/thumbnails/:imageName", async (req, res) => {
    try {
      const imageName = req.params.imageName;
      const imagePath = path.join(folder, imageName);
      const thumbnailPath = await generateThumbnail(imagePath);
      res.sendFile(thumbnailPath);
    } catch (error) {
      res.status(500).send("Failed to generate thumbnail.");
    }
  });

  app.get("/images/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(folder, imageName);
    res.sendFile(imagePath);
  });

  app.get("/", (req, res) => {
    const images = fs
      .readdirSync(folder)
      .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    const galleryHTML = generateGalleryHTML(images);
    res.send(galleryHTML);
  });
}
