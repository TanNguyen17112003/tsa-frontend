import {
  Table,
  WidthType,
  BorderStyle,
  TableRow,
  Paragraph,
  TableCell,
} from "docx";

export const getDocHelperFields = (fields: string[]) => {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: Array(Math.ceil(fields.length / 3))
      .fill(0)
      .map(
        (_, r) =>
          new TableRow({
            children: Array(3)
              .fill(0)
              .map((_, c) => {
                const index = r * 3 + c;
                return new TableCell({
                  children: [new Paragraph({ text: fields[index] })],
                });
              }),
          })
      ),
  });
};
