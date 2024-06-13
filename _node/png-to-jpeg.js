/* nodejs read all files from directory and return a list of file names.*/
const fs = require("fs");
const path = require("path");
const pngToJpeg = require("png-to-jpeg");

// Путь к директории, где находятся файлы
// const directoryPath = "./img/flowers";
const directoryPath = process.argv[2];

// Перебираем содержимое директории
fs.readdir(directoryPath, (error, files) => {
  if (error) {
    console.error("Обка при чтении директории:", error);
    return;
  }

  // Проходим по всем файлам и нумеруем их
  files
    .sort((a, b) => Math.abs(parseInt(a)) - Math.abs(parseInt(b)))
    .forEach((file) => {
      // Получаем полный к файлу
      const filePath = path.join(directoryPath, file);

      // Проверяем, является ли файл обычным файлом, а не директорией
      fs.stat(filePath, async (err, stats) => {
        if (err) {
          console.error("Ошибка при получении информации оле:", err);
          return;
        }

        if (!stats.isFile()) {
          // Если это не файл, пропускаем его
          return;
        }

        const isPng = path.extname(file) === ".png";

        if (isPng) {
          console.log(filePath, "remaking ...");
          let buffer = await fs.promises.readFile(filePath);
          await pngToJpeg({ quality: 100 })(buffer)
            .then((output) =>
              fs.writeFileSync(filePath.replace(".png", ".jpeg"), output)
            )
            .catch(console.error);
          await fs.promises.unlink(filePath);
        }
      });
    });
});
