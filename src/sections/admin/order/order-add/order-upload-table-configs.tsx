import { CardTableConfig } from 'src/components/card-table';
import { CardTableEditCellTextfield } from 'src/components/card-table/card-table-edit-cell-text-field';
import { GeneratedOrder } from './order-add-page';

export const orderUploadTableConfigs: CardTableConfig<GeneratedOrder['orderId'], GeneratedOrder>[] =
  [
    {
      key: 'orderId',
      headerLabel: 'Mã đơn hàng',
      type: 'string',
      renderEditingCell: CardTableEditCellTextfield
    },
    {
      key: 'brand',
      headerLabel: 'Thương hiệu',
      type: 'string',
      renderEditingCell: CardTableEditCellTextfield
    }
  ];
