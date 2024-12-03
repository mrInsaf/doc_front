// src/UploadDocument.js
import React, { useState } from 'react';
import axios from 'axios';
import $ from 'jquery'; // Если вы используете jQuery

function UploadDocument() {

  const [kksCode, setKksCode] = useState('');
  const [workType, setWorkType] = useState('');
  const [docType, setDocType] = useState('');
  const [file, setFile] = useState(null);
  const [date, setDate] = useState('');
  const [formattedDate, setFormattedDate] = useState('');

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
      formData.append('datelnput', formattedDate);
      formData.append('document', documentFile);

      console.log("formdata: ")
      formData.forEach((value, key) => {
        console.log(key + ": " + value);
      });
  
      // Отправка данных (здесь можно указать ваш URL)
      const response = await axios.post('https://example.com/api/mark-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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

  const fillFormFunction = (event) => {
    const input = event.target;
    const kksCodeInput = document.getElementById('kks-code');
    const workTypeInput = document.getElementById('work-type');
    const docTypeInput = document.getElementById('doc-type')

    if (input.files.length) {
      const file = input.files[0];
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
            const workType = workTypeJson[parsedKKS.specialty];
            setWorkType(workType);
            workTypeInput.value = workType;
          });

          $.getJSON("docType.json", function(docTypeJson) {
            const docType = docTypeJson[parsedKKS.docType];
            setDocType(docType);
            docTypeInput.value = docType;
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
    return `${day}-${month}-${year}`; // Форматируем в dd-mm-yyyy
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
    const formattedDate = formatDate(event.target.value);
    console.log(formattedDate);
    setFormattedDate(formattedDate);
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('title', title);
  //   formData.append('description', description);

  //   try {
  //     const response = await axios.post('https://mr-morkow.ru:8888/document_api/upload/', formData, {
  //       responseType: 'blob',
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.setAttribute('download', `updated_${file.name}`);
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);

  //     console.log('File uploaded successfully:', response.data);
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //   }
  // };

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
          onClick={addCodeFunction}
        >
          <span>Маркировать документ</span>
        </button>
        <input
          type="file"
          id="addFile"
          accept=".docx"
          onChange={fillFormFunction}
        />
        <div className="add-file-dropbox" id="dropbox">
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
              <input type="text" placeholder="123456" />
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
