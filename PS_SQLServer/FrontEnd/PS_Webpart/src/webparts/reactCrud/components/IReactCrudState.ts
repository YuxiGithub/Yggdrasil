import { IDropdownOption } from "office-ui-fabric-react";
import { ClientRow } from "../Services/Common";

export interface IReactCrudState {
  listTitle: IDropdownOption[];
  status: string;
  rowData: any[],
  columnDefs: any[],
  selectedRows: ClientRow,
  form: any;
  section: string;
}
