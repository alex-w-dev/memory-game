const http = require("http");
const url = require("url");

// Создаем сервер
const proxyServer = http.createServer((req, res) => {
  // Получаем URL целевого ресурса
  const parsedUrl = url.parse(req.url);
  const path = parsedUrl.path;
  const hostname = req.headers.host;
  console.log(path, "path");
  console.log(hostname, "hostname");

  // Заменяем хост в заголовках запроса
  Object.assign(req.headers, {
    host: hostname,
  });

  // Изменяем путь для корректной работы с протоколом
  req.url = path;

  // Устанавливаем соединение с целевым ресурсом
  const options = {
    hostname,
    method: req.method,
    headers: req.headers,
  };
  const proxyRequest = http.request(options, (proxyRes) => {
    // Передаем ответ от целевого ресурса клиенту
    proxyRes.on("data", (chunk) => {
      res.write(chunk);
    });
    proxyRes.on("end", () => {
      res.end();
    });
  });

  // Обработка ошибок при установлении соединения
  reqon("error", (err) => {
    console.log(`Proxy error: ${err.message}`);
    res.end();
  });

  // Отправка запроса целевому ресурсу
  req.pipe(proxyRequest);
});

const port = 8092;
// Запускаем сервер
proxyServer.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
