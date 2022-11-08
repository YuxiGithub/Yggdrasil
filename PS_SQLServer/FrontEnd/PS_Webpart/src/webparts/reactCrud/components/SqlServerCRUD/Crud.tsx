/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import styles from "../ReactCrud.module.scss";
import { IReactCrudProps } from "./IReactCrudProps";
import { IReactCrudState } from "./IReactCrudState";
import { ActionButton, IDropdownOption } from "office-ui-fabric-react";
import { AgGridReact } from "ag-grid-react";
import { CellClickedEvent } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { useState } from "react";
import { ClientRow } from "../../Services/Common";

export default class CrudGrid extends React.Component<
  IReactCrudProps,
  IReactCrudState,
  {}
> {
  public gridRef: any;
  gridApi: any;
  gridColumnApi: any;
  selectedRows: any[] = [];
  self: any;
  constructor(props: IReactCrudProps) {
    super(props);
    this.state = {
      status: "",
      rowData: [],
      columnDefs: [],
      selectedRows: [],
      section: "List",
    };
  }

  public componentDidMount(): void {
    const columnDefs = [
      { field: "Id", width: 20 },
      { field: "Name", width: 140 },
      { field: "MainPOC", width: 180 },
      { field: "TacticalPOC", width: 180 },
      { field: "OperativePOC", width: 180 },
    ];
    this.setState({ columnDefs: columnDefs });

    this.setState({ rowData: this.props.rowData });

    this.setState({ selectedRows: [] });
  }

  public onCellClicked(params: CellClickedEvent): void {
    console.log("Cell was clicked");
    console.log(params);
  }

  onGridReady = (params: {
    api: { setRowData: (arg0: any) => any };
    columnApi: any;
  }) => {
    debugger;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // debugger;
    // this.gridApi.setRowData(this.props.rowData);
  };

  onSelectionChanged = () => {

    const selectedRows = this.gridApi.getSelectedRows();
    this.setState({ selectedRows: selectedRows });
  };

  onDeleteClick = () => {

    const selectedId = this.state.selectedRows[0]["Id"];
    this.props.onDeleteClick(selectedId);
  };

  onAddClick = () => {

    this.handleSectionChange("Add");
  };

  onUpdateClick = () => {

    this.handleSectionChange("Add", this.state.selectedRows[0]);
  };

  handleSectionChange = (sectionName: string, clientRow?: ClientRow) => {

    this.props.onSectionChange(sectionName, clientRow);
  };

  public render(): React.ReactElement<IReactCrudProps> {
    return (
      <section className={`${styles.myStyles}`}>
        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
          <AgGridReact
            rowData={this.props.rowData}
            columnDefs={this.state.columnDefs}
            rowSelection={"single"}
            onGridReady={this.onGridReady}
            onSelectionChanged={this.onSelectionChanged}
          ></AgGridReact>
        </div>

        <div className="row">
          <ActionButton
            text="Add Row"
            className={`col ${styles.myButton}`}
            onClick={this.onAddClick}
          ></ActionButton>
          {this.state.selectedRows.length > 0 && (
            <ActionButton
              text="Delete Row"
              className={`col ${styles.myButton}`}
              onClick={this.onDeleteClick}
            ></ActionButton>
          )}
          {this.state.selectedRows.length > 0 && (
            <ActionButton
              text="Edit Row"
              className={`col ${styles.myButton}`}
              onClick={this.onUpdateClick}
            ></ActionButton>
          )}
        </div>
      </section>
    );
  }
}
