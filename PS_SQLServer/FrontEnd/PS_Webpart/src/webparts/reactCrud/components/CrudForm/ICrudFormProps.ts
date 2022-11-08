import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ClientRow } from "../../Services/Common";

export interface ICrudFormProps {
  form: any;
  clientRow: ClientRow;
  rowLength: number;
  onSectionChange: (sectionName: string) => void;
  onAddClick: (client: ClientRow) => void;
  onUpdateClick: (client: ClientRow) => void;
  
}
