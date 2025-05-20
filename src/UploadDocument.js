// src/UploadDocument.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import $ from 'jquery'; // Если вы используете jQuery

function UploadDocument() {

  const dropAreaRef = useRef(null);
  const [kksCode, setKksCode] = useState('');
  const [workType, setWorkType] = useState('');
  const [docType, setDocType] = useState('');
  const [file, setFile] = useState(null);
  const [date, setDate] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [version, setVersion] = useState('');
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const formData = new FormData();
    formData.append('login', 'zxc');
    formData.append('password', 'zxc');

    const fetchData = async () => {
      try {
        const response = await axios.post(
          'https://mr-morkow.ru:8888/document_api/QRCodeFactory/login/login',
          formData,
          {
            responseType: 'blob', // Указываем, что ответ в формате Blob
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            withCredentials: true,
          }
        );

        const responseText = await response.data.text();
        console.log('Response Text:', responseText);
        console.log("Залогинился");
        setResponseData(response.data); // Сохраняем данные ответа
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };

    fetchData(); // Вызов функции
  }, []);

  const parseKKS = (kksCode) => {
    const kksPattern = /^([A-Z]{2})\.([A-Z])\.([A-Z\d]{4})\.([A-Z\d])\.([A-Z\d]{6})\.([A-Z\d]{6})\.([A-Z\d]{3})\.([A-Z\d]{2})\.([A-Z\d]{4})\.([A-Z])$/;

    try {
        const match = kksCode.match(kksPattern);
        if (!match) {
          throw new Error('ККС-код не соответствует ожидаемому формату.');
        }
        return {
          aсе: match[1],
          stage: match[2],
          developer: match[3],
          blockNumber: match[4],
          division: match[5],
          subdivision: match[6],
          specialty: match[7],
          docType: match[8],
          registrationNumber: match[9],
          language: match[10],
        };
    }
    catch(error) {
      showAlert('errorDocTypeAlert');
    }
  };

  const addCodeFunction = async () => {
    try {
      // personCode - всегда 1
      const personCode = 1;

      // kksCode - берем из состояния (ранее установленного в fillFormFunction)
      const kksCode = document.getElementById('kks-code').value;

      // workType - получаем из workType.json
      const workTypeValue = workType;

      // docType - получаем из docType.json
      const docTypeValue = docType;

      // versionPrefix и version - пока фиксированные значения
      const versionPrefix = 1;
      const version = 1;

      // datelnput - фиксированная дата
      const datelnput = date;

      // document - берется из input файла
      const documentFile = file;

      if (!documentFile) {
        console.error("Файл документа не найден!");
        alert("Загрузите документ перед маркировкой!");
        return;
      }

      // Формируем данные
      const formData = new FormData();
      formData.append('personCode', personCode);
      formData.append('kksCode', kksCode);
      formData.append('workType', workTypeValue);
      formData.append('docType', docTypeValue);
      formData.append('versionPrefix', versionPrefix);
      formData.append('version', version);
      formData.append('dateInput', formattedDate);
      formData.append('document', documentFile);

      console.log("formdata: ")
      formData.forEach((value, key) => {
        console.log(key + ": " + value);
      });

      // Отправка данных (здесь можно указать ваш URL)
      const response = await axios.post('https://example.com/api/mark-document', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Документ успешно маркирован:', response.data);
      alert('Документ успешно маркирован!');
    } catch (error) {
      console.error('Ошибка при маркировке документа:', error);
      alert('Произошла ошибка при маркировке документа.');
    }
  };


  const updateCodeFunction = () => {
    console.log('Функция обновления документа.');
  };

  const fillFormFunction = (files) => {
    const kksCodeInput = document.getElementById('kks-code');
    const workTypeInput = document.getElementById('work-type');
    const docTypeInput = document.getElementById('doc-type')

    if (files.length) {
      const file = files[0];
      const fileName = file.name;

      if (fileName.endsWith('.docx')) {
        try{
          showAlert('fileSuccess');
          setFile(file);

          kksCodeInput.value = fileName.slice(0, -5); //kks из названия файлы
          const parsedKKS = parseKKS(fileName.slice(0, -5));
          console.log("parsed kks: " + parsedKKS.registrationNumber)
          setKksCode(parsedKKS);

          $.getJSON("workType.json", function(workTypeJson) {
            const workTypeCode = parsedKKS.docType;  // Сохраняем сам код типа работы
            setWorkType(workTypeCode);  // Устанавливаем код типа работы в состояние
            workTypeInput.value = workTypeCode;  // Заполняем поле ввода кодом типа работы
        });


          $.getJSON("docType.json", function(docTypeJson) {
            const docTypeCode = parsedKKS.specialty;  // Сохраняем сам код документа
            setDocType(docTypeCode);  // Устанавливаем код в состояние
            docTypeInput.value = docTypeCode;  // Заполняем поле ввода кодом документа
        });


        }
        catch(error) {
          showAlert('errorDocTypeAlert');
        }


      } else {
        showAlert('errorDocTypeAlert');
      }
    }
  };

  useEffect(() => {
    const dropArea = dropAreaRef.current;

    const handleDragOver = (event) => {
      event.preventDefault();
      dropArea.classList.add('highlight');
    };

    const handleDragLeave = () => {
      dropArea.classList.remove('highlight');
    };

    const handleDrop = (event) => {
      event.preventDefault();
      dropArea.classList.remove('highlight');
      const files = event.dataTransfer.files;
      fillFormFunction(files); // Call fillFormFunction with the dropped files
    };

    if (dropArea) {
      dropArea.addEventListener('dragover', handleDragOver);
      dropArea.addEventListener('dragleave', handleDragLeave);
      dropArea.addEventListener('drop', handleDrop);
    }

    return () => {
      if (dropArea) {
        dropArea.removeEventListener('dragover', handleDragOver);
        dropArea.removeEventListener('dragleave', handleDragLeave);
        dropArea.removeEventListener('drop', handleDrop);
      }
    };
  }, [fillFormFunction]); // Add fillFormFunction to the dependency array


  const showAlert = (alertId) => {
    const alertElement = document.getElementById(alertId);
    console.log("alert eeee")
    if (alertElement) {
      alertElement.style.display = 'block';
    }
  };

  const closeAlert = (alertId) => {
    const alertElement = document.getElementById(alertId);
    if (alertElement) {
      alertElement.style.display = 'none';
    }
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split('-'); // Разбиваем строку даты на компоненты
    const monthFormatted = String(month).padStart(2, '0'); // Добавляем ведущий ноль для месяца
    const dayFormatted = String(day).padStart(2, '0');     // Добавляем ведущий ноль для дня
    return `${dayFormatted}-${monthFormatted}-${year}`; // Форматируем в dd-MM-yyyy
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
    const formattedDate = formatDate(event.target.value);
    console.log(formattedDate);
    setFormattedDate(formattedDate);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

      // personCode - всегда 1
      const personCode = 1;

      // kksCode - берем из состояния (ранее установленного в fillFormFunction)
      const kksCode = document.getElementById('kks-code').value;

      // workType - получаем из workType.json
      const workTypeValue = workType;

      // docType - получаем из docType.json
      const docTypeValue = docType;

      // versionPrefix и version - пока фиксированные значения
      const versionPrefix = 'A';

      // datelnput - фиксированная дата
      const dateInput = date;

      // document - берется из input файла
      const documentFile = file;

      if (!documentFile) {
        console.error("Файл документа не найден!");
        alert("Загрузите документ перед маркировкой!");
        return;
      }

      // Формируем данные
      const formData = new FormData();
      formData.append('personCode', personCode);
      formData.append('kksCode', kksCode);
      formData.append('workType', workTypeValue);
      formData.append('docType', docTypeValue);
      formData.append('versionPrefix', versionPrefix);
      formData.append('version', version);
      formData.append('dateInput', formattedDate);
      formData.append('document', documentFile);

    try {
      // const response = await axios.post('https://mr-morkow.ru:8888/document_api/upload/', formData, {
      // const response = await axios.post('http://127.0.0.1:8000/upload/', formData, {
      const response = await axios.post('https://mr-morkow.ru:8888/document_api/QRCodeFactory/main/saveDocument', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      const responseText = await response.data.text();
      console.log('Response Text:', responseText);

      console.log("Отправил пост запрос нах")

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `updated_${file.name}`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      if (error.response) {
        // Проверяем, если тело ответа — Blob
        const responseData = error.response.data;

        if (responseData instanceof Blob && responseData.type === 'text/html') {
          const text = await responseData.text(); // Конвертируем Blob в текст
          console.error('Error Response (Text):', text);

          // Проверяем текст ответа
          if (text.includes('Документ уже есть в систсеме')) {
            console.log("Сейчас покажу алерт");
            showAlert('documentExistsAlert'); // Показываем алерт
          }
          else {
            console.log("Сейчас не покажу алерт");
            console.log('Искомый текст:', 'Документ уже есть в систсеме');
            console.log('Полученный текст:', text);
          }
        } else {
          console.error('Error Response (JSON):', responseData);

          // Если ответ в JSON и содержит сообщение об ошибке
          if (responseData.message && responseData.message.includes('Документ уже есть в системе')) {
            showAlert('document-exists-alert'); // Показываем алерт
          }
        }

        console.error('Status Code:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('No Response:', error.request);
      } else {
        console.error('Error Message:', error.message);
      }
      console.error('Full Error Object:', error);
    }
  }

  return (
    <div>
      <link rel="stylesheet" href="./style.css" />
      <div>
        <link href="./index.css" rel="stylesheet" />
        <div className="container">
        <div className="myAlert" id="errorDocTypeAlert">
          <h2>Ошибка!</h2>
          <p>Формат загружаемого файла не соответствует требованиям</p>
          <p>Загрузите файл в формате docx</p>
          <button
            className="close-button"
            onClick={() => closeAlert('errorDocTypeAlert')}
          >
            ОК
          </button>
        </div>

        <div className="myAlert" id="documentExistsAlert">
          <h2>Ошибка!</h2>
          <p>Документ уже есть в системе</p>
          <button
            className="close-button"
            onClick={() => closeAlert('documentExistsAlert')}
          >
            ОК
          </button>
        </div>


        <div className="myAlert" id="fileSuccess">
          <p>Файл успешно загружен.</p>
          <button
            className="close-button"
            onClick={() => closeAlert('fileSuccess')}
          >
            ОК
          </button>
        </div>
        <img
          src="/public/external/background.png"
          alt="background"
          className="background"
        />
        <div className="header">
          <span>Маркировка документов</span>
          <img
            src="/public/external/rosatom_logo.png"
            alt="rosatom_logo"
            className="rosatom-logo"
          />
        </div>
        <button
          className="add-code-button"
          id="add_code"
          onClick={handleSubmit}
        >
          <span>Маркировать документ</span>
        </button>
        <input
          type="file"
          id="addFile"
          accept=".docx"
          onChange={(event) => fillFormFunction(event.target.files)}
        />
        <div className="add-file-dropbox" id="dropbox" ref={dropAreaRef}>
          <div className="add-file-dropbox-dotline" />
          <img
            src="/public/external/docxicon.png"
            alt="docxicon"
            className="docxicon"
          />
          <span>Перетащите файл в формате docx</span>
        </div>
        <span className="fill-form">Заполните форму для генерации QR кода:</span>
        <div className="input-form">
          <div className="inputtext">
            <span className="sender-input-text">Код отправителя</span>
            <span className="kks-code-text">KKS-Код</span>
            <span className="work-type-text">Вид работы</span>
            <span className="doc-type-text">Вид документа</span>
            <span className="doc-version-text">Версия документа</span>
            <span className="date-inpit-text">Дата загрузки</span>
            <div className="sender-input">
              <input type="text" defaultValue={123456} readOnly />
            </div>
            <div className="kks-input">
              <input
                type="text"
                id="kks-code"
                placeholder="123456789"
                value={kksCode.value} // привязка значения
                onChange={(e) => setKksCode(e.target.value)} // обновление значения
              />
            </div>
            <div className="work-type-input">
              <input type="text" id="work-type" placeholder="123456" />
            </div>
            <div className="doc-type-input">
              <input type="text" id="doc-type" placeholder="123456" />
            </div>
            <div className="doc-version-input">
              <input
                type="text"
                id="version"
                placeholder="Введите версию"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </div>
            <div className="date-input">
              <input
                type="date"
                id="dateField"
                value={date} // Привязываем состояние к значению поля
                onChange={handleDateChange} // Обработчик изменения
              />
            </div>
          </div>
        </div>
        <img
          src="/public/external/whitesqaure.png"
          alt="whitesqaure"
          className="whitesqaure"
        />
        <img src="/public/external/qrcode.png" alt="qrcode" className="qrcode" />
        <button
          className="update-code-button"
          id="update_code"
          onClick={updateCodeFunction}
        >
          <span>Обновить QR-код</span>
        </button>
      </div>
      </div>
    </div>
  );
}

export default UploadDocument;
