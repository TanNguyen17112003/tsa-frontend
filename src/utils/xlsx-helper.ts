import _ from "lodash";
import { CardTableConfig } from "src/components/card-table";
import * as XLSX from "xlsx";
import { getObjectValue } from "./obj-helper";
import { StationDetail } from "src/types/station";
import XlsxPopulate from "xlsx-populate";
import { downloadFile } from "./url-handler";

export interface ImportXLSXConfigField {
  labels: string[];
  type: "string" | "number" | "date";
  getValue?: (input: string) => any;
}
export interface ImportXLSXConfig {
  [name: string]: ImportXLSXConfigField | ImportXLSXConfig;
}

export interface ImportXLSXOptions {
  detectHeader?: boolean;
}

export interface ExportHeader {
  currentStation?: StationDetail;
  title: string;
  titleHelperText?: string;
  colSpan: number;
  helperFields?: string[];
  helperData?: { label?: string; value?: string }[];
}

const getImportValue = (
  row: { [name: string]: string },
  configs: ImportXLSXConfig
) => {
  let result: any = {};
  Object.keys(configs).forEach((key) => {
    const config = configs[key];
    if (Array.isArray(config.labels)) {
      const fieldConfig = config as ImportXLSXConfigField;
      let data: string | undefined = undefined;
      fieldConfig.labels.some((v: string) => {
        data = data || row[v];
        return data;
      });
      if (fieldConfig.getValue) {
        result[key] = fieldConfig.getValue(data || "");
      } else if (fieldConfig.type == "string") {
        result[key] = data;
      } else if (fieldConfig.type == "number") {
        result[key] = Number(
          data ? Number(String(data).replaceAll(/[^0-9.]/g, "")) : undefined
        );
      } else if (fieldConfig.type == "date") {
        let val = String(data).split("/");
        if (!val[2]) {
          val = String(data).split("-");
        }
        if (val[2].length == 2) {
          val[2] = "20" + val[2];
        }
        if (val[2]) {
          result[key] = new Date(
            Number(val[2]),
            Number(val[1]) - 1,
            Number(val[0])
          );
        }
      }
    } else {
      result[key] = getImportValue(row, config as ImportXLSXConfig);
    }
  });
  return result;
};
const getImportLabels = (configs: ImportXLSXConfig): string[] => {
  const labels: string[] = [];
  Object.keys(configs).forEach((key) => {
    const config = configs[key];
    if (Array.isArray(config.labels)) {
      labels.push(...config.labels);
    } else {
      labels.push(...getImportLabels(config as ImportXLSXConfig));
    }
  });
  return labels;
};

// transform keys to lowercase and remove not alphabet character
const transformKey = (key: any): string =>
  key
    .toString()
    .toLowerCase()
    .replace(/[,"'?\\\/!@#$%^&*]/g, "")
    .trim();

// In case header is not on first row then should detect the header
const getImportXLSXRaw = (
  fileReader: FileReader | null,
  configs: ImportXLSXConfig,
  options?: ImportXLSXOptions & XLSX.Sheet2JSONOpts
) => {
  const data = fileReader?.result;
  const workbook = XLSX.read(data, { type: "binary" });
  const sheet_name_list = workbook.SheetNames;
  let worksheet = workbook.Sheets[sheet_name_list[0]];
  if (options?.detectHeader) {
    const aoa: any[][] = XLSX.utils.sheet_to_json(worksheet, {
      ...options,
      header: 1,
    });
    const labels = getImportLabels(configs);
    const headerIndex = aoa.findIndex((a: any) => {
      if (Array.isArray(a)) {
        return (
          a.filter((value) => {
            const key = transformKey(value);
            return labels.some((l) => l == key);
          }).length >= 2
        );
      } else return false;
    });
    if (headerIndex >= 0) {
      worksheet = XLSX.utils.aoa_to_sheet(aoa.slice(headerIndex));
    }
  }
  const raw: { [key: string]: any }[] = XLSX.utils.sheet_to_json(
    worksheet,
    options
  );
  return raw;
};

export async function importXLSX<T extends ImportXLSXConfig>(
  file: File | Blob,
  configs: T,
  options?: { detectHeader?: boolean } & XLSX.Sheet2JSONOpts
): Promise<{ data: { [name in keyof T]?: any }[]; error?: string }> {
  return new Promise<{ data: { [name in keyof T]?: any }[]; error?: string }>(
    (resolve) => {
      let json: { [name: string]: string }[] | undefined;

      try {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
          try {
            const raw = getImportXLSXRaw(e.target, configs, options);
            for (let j = 0; j < raw.length; j++) {
              raw[j] = _.transform(raw[j], (result, val, key) => {
                result[
                  key
                    .toString()
                    .toLowerCase()
                    .replace(/[,"'?\\\/!@#$%^&*]/g, "")
                    .trim()
                ] = val;
              });
            }
            json = raw;
            console.log("json", json);

            const results = json.map((item) => getImportValue(item, configs));

            resolve({ data: results });
          } catch (error) {
            resolve({ data: [], error });
          }
        };
      } catch (error) {
        resolve(error);
      }
    }
  );
}
export interface ExportWorksheetField<T> {
  label: string;
  key: keyof T;
  mapValues?: { [name in string | number | symbol]: any };
  custom?: (data: T) => any;
}

export function exportWorksheet<T extends {}>(
  data: T[],
  exportFields: ExportWorksheetField<T>[],
  opts?: XLSX.JSON2SheetOpts & {
    indexColumn?: boolean;
  }
): XLSX.WorkSheet {
  const w: number[] = [
    ...(opts?.indexColumn ? [4] : []),
    ...exportFields.map((e) => e.label.length * 1.1),
  ];
  const exportResult = data.map((d, index) => {
    const e: { [key: string]: string | number } = {};
    if (opts?.indexColumn) {
      e["STT"] = index + 1;
    }
    exportFields.forEach((field, index) => {
      let value = getObjectValue(d, field.key);
      if (field.custom) {
        value = field.custom(d);
      }
      if (field.mapValues) {
        value = field.mapValues[value] || value;
      }
      e[field.label] = value;
      w[index] = Math.max(w[index], String(value).length * 1.1);
    });
    return e;
  });
  const worksheet = XLSX.utils.aoa_to_sheet([]);
  XLSX.utils.sheet_add_json(worksheet, exportResult, opts);
  worksheet["!cols"] = w.map((w) => ({ wch: Math.ceil(w * 1.2) }));
  return worksheet;
}

export function cardTableConfigsToExportFields<
  P,
  T extends { id: P; [key: string]: any }
>(
  configs: CardTableConfig<P, T>[],
  opts?: {
    custom?: { [key in keyof Partial<T>]: (data: T) => any };
    ignore?: (keyof T | string)[];
  }
): ExportWorksheetField<T>[] {
  return configs
    .filter((config) => !opts?.ignore?.includes(config.key))
    .map(
      (config): ExportWorksheetField<T> => ({
        label: config.headerLabel,
        key: config.key,
        custom: opts?.custom?.[config.key],
      })
    );
}

export const updateCell = (
  ws: XLSX.WorkSheet,
  pos: XLSX.CellAddress,
  value: any
) => {
  XLSX.utils.sheet_add_aoa(ws, [[value]], { origin: pos });
};

export const sheet_add_title = (
  worksheet: XLSX.WorkSheet,
  { currentStation, title, colSpan, helperFields }: ExportHeader
) => {
  if (currentStation) {
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          `CÔNG TY CỔ PHẦN VẬT LIỆU XÂY DỰNG BÌNH DƯƠNG - ${currentStation?.name}`.toUpperCase(),
        ],
        [currentStation?.address],
        [title],
        ...(helperFields ? [[]] : []),
        ...(helperFields || []).map((field) => [field]),
      ],
      { origin: "A1" }
    );

    worksheet["!merges"] = [
      ...(worksheet["!merges"] || []),
      ...[
        { s: { r: 0, c: 0 }, e: { r: 0, c: colSpan } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: colSpan } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: colSpan } },
        ...(helperFields || []).map((_, index) => ({
          s: { r: 3 + index, c: 0 },
          e: { r: 3 + index, c: colSpan },
        })),
      ],
    ];
  }
};

export const to_xlsx_populate = async (
  worksheet: XLSX.WorkSheet
): Promise<XlsxPopulate.Workbook> => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Sheet 1`);
  const wb = await XlsxPopulate.fromDataAsync(
    XLSX.write(workbook, { type: "buffer" })
  );
  return wb;
};

export async function exportStyledWorksheet<T extends {}>(
  data: T[],
  exportFields: ExportWorksheetField<T>[],
  opts?: XLSX.JSON2SheetOpts & {
    indexColumn?: boolean;
    fileName?: string;
    numberFormat?: { [key in keyof Partial<T>]: string };
    additionalRows?: any[][];
    additionalMerges?: XLSX.Range[];
  },
  header?: ExportHeader
) {
  let origin: XLSX.CellAddress = {
    r: 4 + Math.ceil(header?.helperFields?.length || 0),
    c: 0,
  };
  const worksheet = exportWorksheet(data, exportFields, {
    ...opts,
    origin,
  });

  if (opts?.additionalRows) {
    XLSX.utils.sheet_add_aoa(worksheet, opts.additionalRows, {
      origin: { r: origin.r + data.length + 1, c: 0 },
    });
  }
  if (header) {
    sheet_add_title(worksheet, {
      ...header,
      colSpan: exportFields.length - 1 + (opts?.indexColumn ? 1 : 0),
    });
  }
  worksheet["!merges"]?.push(...(opts?.additionalMerges || []));
  const workbook = await to_xlsx_populate(worksheet);
  const sheet = workbook.sheet(0);

  origin = { c: origin.c + 1, r: origin.r + 1 };
  const tableCellRange = sheet.range(
    origin?.r || 1,
    origin?.c || 1,
    (origin?.r || 1) + data.length + (opts?.additionalRows?.length || 0),
    (origin?.c || 1) + exportFields.length - 1 + (opts?.indexColumn ? 1 : 0)
  );
  tableCellRange.style({
    border: true,
  });
  const tableHeaderRow = sheet.row(origin?.r || 1);
  tableHeaderRow.style({
    bold: true,
    horizontalAlignment: "center",
    verticalAlignment: "center",
    fontSize: 13,
  });
  tableHeaderRow.height(24);

  exportFields.forEach((field, index) =>
    sheet
      .column(index + 1 + (opts?.indexColumn ? 1 : 0))
      .style("numberFormat", opts?.numberFormat?.[field.key] || "#,##")
  );

  sheet.cell(1, 1).style({
    bold: true,
    verticalAlignment: "center",
    fontSize: 18,
  });
  sheet
    .range(2, 1, 4 + Math.ceil(header?.helperFields?.length || 0), 1)
    .style({ bold: true, fontSize: 15 });

  if (header?.helperData) {
    for (let i = 4; i < 4 + Math.ceil(header.helperData.length / 2); i++) {
      sheet.cell(i, 1).style({ bold: true, horizontalAlignment: "right" });
      sheet.cell(i, 4).style({ bold: true, horizontalAlignment: "right" });
    }
  }
  const blob = await workbook.outputAsync();
  downloadFile(blob as Blob, `${opts?.fileName || "export"}.xlsx`);
}
