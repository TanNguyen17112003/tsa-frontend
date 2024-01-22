import { StationConnection } from "src/types/station";
import { fileToBase64 } from "./file-to-base64";

export const downloadUrl = (url: string, name?: string) => {
  const link = document.createElement("a");
  let fileName = name;
  if (!fileName) {
    fileName = url.substring(url.indexOf("/") || 0);
    fileName = fileName.substring(0, fileName.indexOf("?") || fileName.length);
  }
  link.href = url;
  link.download = fileName;
  link.click();
  link.remove();
};

export const downloadFile = (blob: Blob | File | Uint8Array, name: string) => {
  const anchorElement = document.createElement("a");
  anchorElement.download = name;
  anchorElement.href = URL.createObjectURL(new Blob([blob]));
  anchorElement.click();
  URL.revokeObjectURL(anchorElement.href);
};

export const urlToFile = async (
  url: string,
  fileName?: string,
  options?: { timeout: number }
): Promise<File | undefined> => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options?.timeout || 5000);
    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(id);
    const blob = await response.blob();
    let _fileName = fileName || "";
    if (!fileName) {
      const tmp = url.split("/");
      _fileName = tmp[tmp.length - 1];
    }
    return new File([blob], _fileName || "no_name", { type: blob.type });
  } catch (error) {
    return undefined;
  }
};

export const getCameraImage = async (
  cam_id: string,
  { static_ip, static_camera_id, static_camera_key }: StationConnection
): Promise<string> => {
  if (static_ip) {
    const newKey = new Date().getTime();
    const url = `${static_ip}/${cam_id}?key=${newKey}`;
    const file = await urlToFile(url, "image.jpg", { timeout: 900 });
    if (!file) {
      return "";
    }
    return String(await fileToBase64(file));
  } else {
    return "";
  }
};

export const getScaleWeight = async (
  scale_id: string,
  { static_ip }: StationConnection
): Promise<{ weight: number; raw: string }> => {
  if (static_ip) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 950);
    const response = await fetch(`${static_ip}/scale`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(id);
    const json = await response.json();
    const raw: string = json.weight;
    return { weight: Number(raw.slice(0, 6)), raw };
  } else {
    return { weight: 0, raw: "" };
  }
};

export const getArrayString = async (
  file: Blob | File
): Promise<string | ArrayBuffer | null | undefined> => {
  return new Promise((resolve) => {
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
      resolve(event.target?.result);
    };
    fileReader.readAsArrayBuffer(file);
  });
};
