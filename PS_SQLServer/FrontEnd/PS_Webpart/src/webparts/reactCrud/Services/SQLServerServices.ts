/* eslint-disable no-async-promise-executor */
import { ClientRow } from "./Common";

export class SQLServerOperations {
  baseURL = "https://localhost:44306/Api/Client/";
  
  public getAllItems(): Promise<ClientRow[]> {
    let url = this.baseURL + "GetClientsDetails/";
    return new Promise<any[]>(async (resolve, reject) => {
        await fetch(url, {
          method: "GET"
        })
          .then(async (response) => {
            if (response.status === 200) {              
              void response.text().then(async (data) => {
                let ans = JSON.parse(data) as ClientRow[];
                resolve(ans);
              });
            } else {
              alert("Error");
            }
          })
          .catch((err) => {
            alert(err);
          });
      });
  }

  public deletedSelectedItem(selectItemId: number): Promise<string> {
    
    let url = this.baseURL + "DeleteClientDetails/" + selectItemId;
    return new Promise<string>(async (resolve, reject) => {
        await fetch(url, {
          method: "DELETE"
        })
          .then((response) => {
            
            console.log(response.status);
            resolve('Deleted');            
          })
          .catch((err) => {
            alert(err);
          });
      });
  }

  public addNewItem(clientRow: ClientRow): Promise<string> {
    
    let url = this.baseURL + "InsertClientDetails/";
    let headers = {"Content-Type": "application/json"};
    return new Promise<string>(async (resolve, reject) => {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(clientRow),
        headers: headers
      })
        .then((response) => {
          
          console.log(response.status);
          resolve('Added');            
        })
        .catch((err) => {
          alert(err);
        });
    });
  }

  public updateItem(clientRow: ClientRow): Promise<string> {
    
    let url = this.baseURL + "UpdateClientDetails/";
    let headers = {"Content-Type": "application/json"};
    return new Promise<string>(async (resolve, reject) => {
      await fetch(url, {
        method: "PUT",
        body: JSON.stringify(clientRow),
        headers: headers
      })
        .then((response) => {
          
          console.log(response.status);
          resolve('Updated');            
        })
        .catch((err) => {
          alert(err);
        });
    });
  }
}
