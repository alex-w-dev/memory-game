/* nodejs read all files from directory and return a list of file names.*/
const fs = require("fs");
const path = require("path");

// Путь к директории, где находятся файлы
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
    .forEach((file, index) => {
      // Получаем полный к файлу
      const filePath = path.join(directoryPath, file);

      // Проверяем, является ли файл обычным файлом, а не директорией
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Ошибка при получении информации оле:", err);
          return;
        }

        if (!stats.isFile()) {
          // Если это не файл, пропускаем его
          return;
        }

        const newFileName = `${index}${path.extname(file)}`;

        if (file !== newFileName) {
          // Переименовываемл
          fs.rename(
            filePath,
            path.join(directoryPath, newFileName),
            (renameError) => {
              if (renameError) {
                console.error(
                  `Ошибка при переименовании файла "${file}":`,
                  renameError
                );
              } else {
                console.log(
                  `Файл "${file}" успешно переименован в "${newFileName}"`
                );
              }
            }
          );
        }
      });
    });
});
