import * as React from "react";
import { IReactCrudProps } from "./IReactCrudProps";
import { IReactCrudState } from "./IReactCrudState";
import CrudGrid from "./SqlServerCRUD/Crud";
import CrudForm from "./CrudForm/CrudForm";
import { ClientRow } from "../Services/Common";
import { SPOperations } from "../Services/SPServices";
import { SQLServerOperations } from "../Services/SQLServerServices";
import { SynchServices } from "../Services/SynchServices";
import styles from "./ReactCrud.module.scss";
export default class ReactCrud extends React.Component<
  IReactCrudProps,
  IReactCrudState,
  {}
> {
  public _spOps: SPOperations;
  public _sqlOps: SQLServerOperations;
  public _synch: SynchServices;
  public _gridRef: any;

  constructor(props: IReactCrudProps) {
    super(props);
    this.state = {
      listTitle: [],
      status: "",
      rowData: [],
      columnDefs: [],
      selectedRows: undefined,
      section: "List",
      form: undefined,
    };

    this._spOps = new SPOperations();
    this._sqlOps = new SQLServerOperations();
    this._synch = new SynchServices();
    void this._synch.clearAndSynch().then(async () => {
      await this._sqlOps.getAllItems().then(async (result) => {
        this.setState({ rowData: result });
      });
    });
  }

  handleSectionChange = async (sectionName: string, clientRow?: ClientRow) => {
    if (clientRow) {
      const client = clientRow;
      const editedClientForm = [
        { value: client.Name },
        { value: client.MainPOC },
        { value: client.TacticalPOC },
        { value: client.OperativePOC },
        { value: client.Id },
      ];
      this.setState({ form: editedClientForm });
      this.setState({ selectedRows: clientRow });
    } else {
      this.setState({ form: undefined });
      this.setState({ selectedRows: undefined });
    }
    this.setState({ section: sectionName });
  };

  handleAddClient = async (newClient: ClientRow) => {
    console.log(newClient);
    await this._sqlOps.addNewItem(newClient).then(async (ans) => {
      await this._spOps.CreateListItem(newClient).then(async (ans) => {
        console.log(ans);
        await this._sqlOps.getAllItems().then(async (result) => {
          this.setState({ rowData: result });
        });
      });
    });
  };

  handleDeleteClient = async (clientId: number) => {
    await this._sqlOps.deletedSelectedItem(clientId).then(async () => {
      await this._spOps.DeleteListItem(clientId).then(async (ans) => {
        console.log(ans);
        await this._sqlOps.getAllItems().then(async (result) => {
          this.setState({ rowData: result });
        });
      });
    });
  };

  handleUpdateClient = async (existingClient: ClientRow) => {
    await this._sqlOps.updateItem(existingClient).then(async () => {
      await this._spOps
        .UpdateListItem(existingClient.Id, existingClient)
        .then(async (ans) => {
          console.log(ans);
          await this._sqlOps.getAllItems().then(async (result) => {
            this.setState({ rowData: result });
          });
        });
    });
  };

  public render(): React.ReactElement<IReactCrudProps> {
    return (
      <div className={styles.reactCrud}>
        <div className={`row ${styles.myStyles}`}>
          <span className={styles.myHeader}>SP-SQL CRUD POC</span>
        </div>
        {this.state.section === "List" && (
          <CrudGrid
            ref={this._gridRef}
            onSectionChange={this.handleSectionChange}
            onAddClick={this.handleAddClient}
            onDeleteClick={this.handleDeleteClient}
            onUpdateClick={this.handleUpdateClient}
            rowData={this.state.rowData}
          />
        )}
        {this.state.section === "Add" && (
          <CrudForm
            form={this.state.form}
            rowLength={this.state.rowData.length + 1}
            clientRow={this.state.selectedRows}
            onSectionChange={this.handleSectionChange}
            onAddClick={this.handleAddClient}
            onUpdateClick={this.handleUpdateClient}
          />
        )}
      </div>
    );
  }
}
