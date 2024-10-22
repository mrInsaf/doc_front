# Установите путь к удаленной папке на сервере
$remotePath = "/var/www/documentFabric/front"
# Данные для подключения к серверу
$serverUser = "stepan"
$serverHost = "45.151.31.119"

# Выполнить команду для сборки проекта
npm run build

# Если билд прошел успешно, отправляем его на сервер
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build completed successfully. Starting upload to the server..."

    # Создаем директорию на сервере, если она не существует
    ssh "${serverUser}@${serverHost}" "sudo mkdir -p ${remotePath}"

    # Отправка папки build на сервер с помощью scp
    scp -r "./build/*" "${serverUser}@${serverHost}:${remotePath}"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "Upload completed successfully."
    } else {
        Write-Host "Upload failed. Please check your SSH connection and paths."
    }
} else {
    Write-Host "Build failed. Please fix the issues before uploading."
}
