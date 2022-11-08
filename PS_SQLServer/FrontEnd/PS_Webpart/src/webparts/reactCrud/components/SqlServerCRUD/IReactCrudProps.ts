import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ClientRow } from "../../Services/Common";

export interface IReactCrudProps {
  onSectionChange: (section: string, clientRow?: ClientRow) => void;
  onAddClick: (client: ClientRow) => void;
  onDeleteClick: (clientId: number) => void;
  onUpdateClick: (client: ClientRow) => void;
  rowData: any[];
}
