/* nodejs read all files from directory and return a list of file names.*/
const fs = require("fs");
const path = require("path");

// Путь к директории, где находятся файлы
const directoryPath = process.argv[2];

// Перебираем содержимое директории
fs.readdir(directoryPath, async (error, files) => {
  if (error) {
    console.error("Обка при чтении директории:", error);
    return;
  }

  const tempFiles = [];

  // отсортируем список для того чтобы установить старый порядок нумерации , если вдруг файлы в этой папке уэе были пронумерованы
  files.sort((a, b) => Math.abs(parseInt(a)) - Math.abs(parseInt(b)));

  for (const file of files) {
    const index = files.indexOf(file);
    // Получаем полный путь к файлу
    const filePath = path.join(directoryPath, file);

    try {
      // Проверяем, является ли файл обычным файлом, а не директорией
      const stats = await fs.promises.stat(filePath);
      if (!stats.isFile()) {
        // Если это не файл, пропускаем его
        continue;
      }
    } catch (error) {
      console.error("Ошибка при чтении файла:", error);
      continue;
    }
    try {
      const tempFileName = `temp-${file}`;
      await fs.promises.rename(
        filePath,
        path.join(directoryPath, tempFileName)
      );
      tempFiles.push(tempFileName);
      console.log(`Файл "${file}" успешно переименован в "${tempFileName}"`);
    } catch (error) {
      console.error(`Ошибка при переименовании файла "${file}":`, error);
      continue;
    }
  }

  // Проходим по всем файлам и нумеруем их
  for (const file of tempFiles) {
    const index = tempFiles.indexOf(file);
    const filePath = path.join(directoryPath, file);
    const newFileName = `${index}${path.extname(file)}`;

    try {
      await fs.promises.rename(filePath, path.join(directoryPath, newFileName));
      console.log(`Файл "${file}" успешно переименован в "${newFileName}"`);
    } catch (error) {
      console.error(`Ошибка при переименовании файла "${file}":`, error);
      continue;
    }
  }
});
