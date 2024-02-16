export const NOTE_BUTTON_ID = "note-button";

export const fontSizeOptions: number[] = [
  5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 48, 72,
];

export const highlightOptions: {
  color: string;
  fontSize?: string;
  tooltip: string;
}[] = [
  { color: "#000000", tooltip: `Chữ thường` },
  {
    color: "#000080",
    fontSize: "20pt",
    tooltip: `Tên kinh\nLời tựa`,
  },
  { color: "#0000FF", fontSize: "20pt", tooltip: `Số quyển` },
  {
    color: "#40826D",
    fontSize: "20pt",
    tooltip: `Thông tin dịch giả bản chữ Hán\nThông tin dịch giả bản chữ Việt`,
  },
  {
    color: "#007BA7",
    fontSize: "20pt",
    tooltip: `Chú thích ẩn\nChú thích các chữ khác nhau từ các dị bản`,
  },
  {
    color: "#000080",
    fontSize: "18pt",
    tooltip: `Số bài kinh\nPhẩm kinh (chương)`,
  },
  {
    color: "#FF0000",
    fontSize: "20pt",
    tooltip: `Chữ được chọn dịch chính thức sau khi đối chiếu các dị bản.`,
  },
  { color: "#008000", fontSize: "20pt", tooltip: `Các bài kệ tụng (thơ)` },
  {
    color: "#800080",
    fontSize: "20pt",
    tooltip: `Chú thích viết kèm (không ẩn)`,
  },
  { color: "#8B008B", fontSize: "20pt", tooltip: `Phụ chú` },
];
