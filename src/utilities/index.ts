import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export const getFileFirstMb = (file: File): Promise<ArrayBuffer> => 
  new Promise((resolve, reject) => {
    const firstMBSize = 1024 * 1024;
    const blob = file.slice(0, firstMBSize);

    const reader = new FileReader();

    reader.onload = function(event) {
      const firstMBData = event.target.result as ArrayBuffer;
      resolve(firstMBData);
    };

    reader.onerror = function(event) {
      reject("Error reading file:", event.target.error);
    };

    reader.readAsText(blob);
  });

export const getFirstRowExcel = (file: File): Promise<string[]> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const firstSheet = workbook.Sheets[firstSheetName];
      const data = XLSX.utils.sheet_to_json<string[]>(firstSheet, { header: 1 });

      if (data && data.length > 0) {
        resolve(data[0]);
      }
    };

    reader.readAsArrayBuffer(file);
  });

export const getFirstRowCsv = (file: File): Promise<string[]> =>
  new Promise((resolve) => {
    Papa.parse(file, {
      complete: (results) => {
        const firstRow = results.data[0];
        resolve(firstRow);
      }
    });
  });
