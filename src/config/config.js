export default {
  // Базовый URL API
  API_BASE_URL: 'https://localhost:8888/document_api',
  
  // Эндпоинты API
  AUTH_ENDPOINT: '/QRCodeFactory/login/login',
  QR_CODE_ENDPOINT: '/QRCodeFactory/main/showQRCode',
  DOCUMENT_UPLOAD_ENDPOINT: '/QRCodeFactory/main/saveDocument',
  
  // Пути к JSON-файлам
  WORK_TYPE_JSON: '/workType.json',
  DOC_TYPE_JSON: '/docType.json',
};