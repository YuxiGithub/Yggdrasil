/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-void */
/* eslint-disable no-async-promise-executor */
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { XMLParser } from "fast-xml-parser";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { IDropdownOption } from "office-ui-fabric-react";
import { ClientRow } from "./Common";

export class SPOperations {
  public getHeader(): HeadersInit {
    return {
      Accept: "application/json;odate=nometadata",
      "Content-Type": "application/json;odate=nometadata",
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbG5jZ29tei5zaGFyZXBvaW50LmNvbUA3MTdhNjc4MC0yMmE3LTRkNWItYmZjMC1iNDQ4NjQ5ZWYwNzMiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBANzE3YTY3ODAtMjJhNy00ZDViLWJmYzAtYjQ0ODY0OWVmMDczIiwiaWF0IjoxNjY3NTAxMDg0LCJuYmYiOjE2Njc1MDEwODQsImV4cCI6MTY2NzU4Nzc4NCwiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEA3MTdhNjc4MC0yMmE3LTRkNWItYmZjMC1iNDQ4NjQ5ZWYwNzMiLCJuYW1laWQiOiI4ODJlYzU1MS0zZWZkLTQyNWItOTc2OC0zMmVmMTliZmIxMGNANzE3YTY3ODAtMjJhNy00ZDViLWJmYzAtYjQ0ODY0OWVmMDczIiwib2lkIjoiZDZhZTBkMzEtN2ZkNC00ZGU0LTlmOGUtODI1ZDAxOGJlMTQwIiwic3ViIjoiZDZhZTBkMzEtN2ZkNC00ZGU0LTlmOGUtODI1ZDAxOGJlMTQwIiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.dIwAr12wxdfhpxGpVCCECWKswOY2DsErEcAOjyJ-8eebdRb8EHjUrKqtAzlS2Ny5PZeky3-2uvxCm-6cMFS05zVk-IHJzIVBkreEiAvG5bMlXuyFzh7sMjARuaPNXdyeX9rLXAWdz-VGCGdvFFc6_PVi1uZcviDnggu6nmKK9P-HfbVcMdJpSErp5QC19DLqGhhhvseT-LG_oFE-wubJJDWtbZlpmHa3CIJaZX9Xac7JxVPU-0VU7ruezWMOrx-hgJ_qIk0crdyiAencgjsGZRVbznm02HKcXiqGvdQbnK02MdTxOExnGM9sdYEe_3JnawYPqUarYusIqniX_AzbuQ",
      token_type: "Bearer",
      "If-Match": "*",
    };
  }

  public GetAllList(context: WebPartContext): Promise<IDropdownOption[]> {
    let restApiUrl: string =
      context.pageContext.web.absoluteUrl +
      "/sites/lncgomzdeveloper/_api/Web/Lists?select=Title";
    let listTitles: IDropdownOption[] = [];
    return new Promise<IDropdownOption[]>(async (resolve, reject) => {
      void context.spHttpClient
        .get(restApiUrl, SPHttpClient.configurations.v1)
        .then(
          (response: SPHttpClientResponse) => {
            void response.json().then((results: any) => {
              results["value"].map((result: any) => {
                listTitles.push({
                  key: result.Title,
                  text: result.Title,
                });
              });
              console.log(listTitles);
            });
            resolve(listTitles);
          },
          (error: any): void => {
            reject("error ocurred " + error);
          }
        );
    });
  }

  public RetrieveListItems(): Promise<ClientRow[]> {
    const url =
      "https://lncgomz.sharepoint.com/sites/lncgomzdeveloper/_api/Web/Lists/getbytitle('SP_SQLSERVER')/Items";
    return new Promise<ClientRow[]>(async (resolve, reject) => {
      await fetch(url, {
        method: "GET",
        headers: this.getHeader(),
      })
        .then((response) => {
          if (response.status === 200) {
            response.text().then((data) => {
              const xml = new XMLParser().parse(data);
              let rows: ClientRow[] = [];
              
              if (xml.feed.entry) {
                if (Array.isArray(xml.feed.entry)) {
                  xml.feed.entry.forEach((item: any) => {
                    rows.push({
                      Id: item.content["m:properties"]["d:Id"],
                      Name: item.content["m:properties"]["d:Name"],
                      MainPOC: item.content["m:properties"]["d:MainPOC"],
                      TacticalPOC: item.content["m:properties"]["d:TacticalPOC"],
                      OperativePOC:
                        item.content["m:properties"]["d:OperativePOC"],
                    });
                  });
                } else {
                  const item = xml.feed.entry;
                  rows.push({
                    Id: item.content["m:properties"]["d:Id"],
                    Name: item.content["m:properties"]["d:Name"],
                    MainPOC: item.content["m:properties"]["d:MainPOC"],
                    TacticalPOC: item.content["m:properties"]["d:TacticalPOC"],
                    OperativePOC: item.content["m:properties"]["d:OperativePOC"],
                  });
                }
                resolve(rows);
              }
            });
          } else {
            console.log("Error");
          }
        })
        .catch((err) => {
          alert(err);
        });
    });
  }

  public CreateListItem(body: ClientRow): Promise<string> {
    debugger;
    const url =
      "https://lncgomz.sharepoint.com/sites/lncgomzdeveloper/_api/Web/Lists/getbytitle('SP_SQLSERVER')/Items";
    return new Promise<string>(async (resolve, reject) => {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: this.getHeader(),
      })
        .then((response) => {
          debugger;
          if (response.status === 201) {
            resolve("Created");
          } else {
           reject("Error");
          }
        })
        .catch((err) => {
          alert(err);
        });
    });
  }

  public UpdateListItem(
    selectedItem: number,
    body: ClientRow
  ): Promise<string> {
    const url =
      "https://lncgomz.sharepoint.com/sites/lncgomzdeveloper/_api/Web/Lists/getbytitle('SP_SQLSERVER')/Items/getbyid('" +
      selectedItem +
      "')";
    let headers = {
      Accept: "application/json;odate=nometadata",
      "Content-Type": "application/json;odate=nometadata",
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbG5jZ29tei5zaGFyZXBvaW50LmNvbUA3MTdhNjc4MC0yMmE3LTRkNWItYmZjMC1iNDQ4NjQ5ZWYwNzMiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBANzE3YTY3ODAtMjJhNy00ZDViLWJmYzAtYjQ0ODY0OWVmMDczIiwiaWF0IjoxNjY3NTAxMDg0LCJuYmYiOjE2Njc1MDEwODQsImV4cCI6MTY2NzU4Nzc4NCwiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEA3MTdhNjc4MC0yMmE3LTRkNWItYmZjMC1iNDQ4NjQ5ZWYwNzMiLCJuYW1laWQiOiI4ODJlYzU1MS0zZWZkLTQyNWItOTc2OC0zMmVmMTliZmIxMGNANzE3YTY3ODAtMjJhNy00ZDViLWJmYzAtYjQ0ODY0OWVmMDczIiwib2lkIjoiZDZhZTBkMzEtN2ZkNC00ZGU0LTlmOGUtODI1ZDAxOGJlMTQwIiwic3ViIjoiZDZhZTBkMzEtN2ZkNC00ZGU0LTlmOGUtODI1ZDAxOGJlMTQwIiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.dIwAr12wxdfhpxGpVCCECWKswOY2DsErEcAOjyJ-8eebdRb8EHjUrKqtAzlS2Ny5PZeky3-2uvxCm-6cMFS05zVk-IHJzIVBkreEiAvG5bMlXuyFzh7sMjARuaPNXdyeX9rLXAWdz-VGCGdvFFc6_PVi1uZcviDnggu6nmKK9P-HfbVcMdJpSErp5QC19DLqGhhhvseT-LG_oFE-wubJJDWtbZlpmHa3CIJaZX9Xac7JxVPU-0VU7ruezWMOrx-hgJ_qIk0crdyiAencgjsGZRVbznm02HKcXiqGvdQbnK02MdTxOExnGM9sdYEe_3JnawYPqUarYusIqniX_AzbuQ",
      token_type: "Bearer",
      "If-Match": "*",
      "X-HTTP-Method": "MERGE",
    };
    return new Promise<string>(async (resolve, reject) => {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers,
      })
        .then((response) => {
          resolve('Updated');
        })
        .catch((err) => {
          alert(err);
        });
    });
  }

  public DeleteListItem(selectedItem: number): Promise<string> {
    
    let params = new URLSearchParams({
      Accept: "application/json;odate=verbose",
      "Content-Type": "application/json;odata=verbose",
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbG5jZ29tei5zaGFyZXBvaW50LmNvbUA3MTdhNjc4MC0yMmE3LTRkNWItYmZjMC1iNDQ4NjQ5ZWYwNzMiLCJpc3MiOiIwMDAwMDAwMS0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDBANzE3YTY3ODAtMjJhNy00ZDViLWJmYzAtYjQ0ODY0OWVmMDczIiwiaWF0IjoxNjY3NTAxMDg0LCJuYmYiOjE2Njc1MDEwODQsImV4cCI6MTY2NzU4Nzc4NCwiaWRlbnRpdHlwcm92aWRlciI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEA3MTdhNjc4MC0yMmE3LTRkNWItYmZjMC1iNDQ4NjQ5ZWYwNzMiLCJuYW1laWQiOiI4ODJlYzU1MS0zZWZkLTQyNWItOTc2OC0zMmVmMTliZmIxMGNANzE3YTY3ODAtMjJhNy00ZDViLWJmYzAtYjQ0ODY0OWVmMDczIiwib2lkIjoiZDZhZTBkMzEtN2ZkNC00ZGU0LTlmOGUtODI1ZDAxOGJlMTQwIiwic3ViIjoiZDZhZTBkMzEtN2ZkNC00ZGU0LTlmOGUtODI1ZDAxOGJlMTQwIiwidHJ1c3RlZGZvcmRlbGVnYXRpb24iOiJmYWxzZSJ9.dIwAr12wxdfhpxGpVCCECWKswOY2DsErEcAOjyJ-8eebdRb8EHjUrKqtAzlS2Ny5PZeky3-2uvxCm-6cMFS05zVk-IHJzIVBkreEiAvG5bMlXuyFzh7sMjARuaPNXdyeX9rLXAWdz-VGCGdvFFc6_PVi1uZcviDnggu6nmKK9P-HfbVcMdJpSErp5QC19DLqGhhhvseT-LG_oFE-wubJJDWtbZlpmHa3CIJaZX9Xac7JxVPU-0VU7ruezWMOrx-hgJ_qIk0crdyiAencgjsGZRVbznm02HKcXiqGvdQbnK02MdTxOExnGM9sdYEe_3JnawYPqUarYusIqniX_AzbuQ",
      "If-Match": "*",
    });
    const url =
      "https://lncgomz.sharepoint.com/sites/lncgomzdeveloper/_api/Web/Lists/getbytitle('SP_SQLSERVER')/Items/getbyid('" +
      selectedItem +
      "')?" +
      params;
    return new Promise<string>(async (resolve, reject) => {
      await fetch(url, {
        method: "DELETE",
        headers: this.getHeader(),
      })
        .then((response) => {
          
          resolve('Deleted');
        })
        .catch((err) => {
          
          alert(err);
          reject('Deleted');
        });
    });  
  }

  public ClearList(): Promise<string> {
    const url =
      "https://lncgomz.sharepoint.com/sites/lncgomzdeveloper/_api/Web/Lists/getbytitle('SP_SQLSERVER')/Items";
    return new Promise<string>(async (resolve, reject) => {
      await fetch(url, {
        method: "GET",
        headers: this.getHeader(),
      })
        .then((response) => {
          if (response.status === 200) {
            response.text().then((data) => {
              const xml = new XMLParser().parse(data);
              let rows: ClientRow[] = [];
              xml.feed.entry.forEach((item: any) => {
                rows.push({
                  Id: item.content["m:properties"]["d:Id"],
                  Name: item.content["m:properties"]["d:Name"],
                  MainPOC: item.content["m:properties"]["d:MainPOC"],
                  TacticalPOC: item.content["m:properties"]["d:TacticalPOC"],
                  OperativePOC: item.content["m:properties"]["d:OperativePOC"],
                });
              });
              rows.forEach((r) => {
                this.DeleteListItem(r.Id).then((response) => {
                  console.log(response);
                });
              });
              resolve('Clear');
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
}
