using ReactCRUDAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ReactCRUDAPI.Controllers
{
    [RoutePrefix("Api/Client")]
    public class YggdrasilController : ApiController
    {
        Entities1 objEntity = new Entities1();

        [HttpGet]
        [Route("GetClientsDetails")]
        public IQueryable<Client> GetClientsDetails()
        {
            try
            {
                return objEntity.Clients;
            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpGet]
        [Route("GetClientDetailsById/{clientId}")]
        public IHttpActionResult GetClientById(string clientId)
        {
            Client objClient = new Client();
            int Id = Convert.ToInt32(clientId);
            try
            {
                objClient = objEntity.Clients.First(c => c.Id == Id);
                if (objClient == null)
                {
                    return NotFound();
                }

            }
            catch (Exception)
            {
                throw;
            }

            return Ok(objClient);
        }

        [HttpPost]
        [Route("InsertClientDetails")]
        public IHttpActionResult PostClient([FromBody] Client data)
        {
             string url2 = Request.RequestUri.ToString();

            string message = "";
            if (data != null)
            {

                try
                {
                    objEntity.Clients.Add(data);
                    int result = objEntity.SaveChanges();
                    if (result > 0)
                    {
                        message = "Client has been sucessfully added";
                    }
                    else
                    {
                        message = "faild";
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return Ok(message);
        }

        [HttpPut]
        [Route("UpdateClientDetails")]
        public IHttpActionResult PutClientMaster([FromBody] Client client)
        {
            string message = "";
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                Client objClient = new Client();
                objClient = objEntity.Clients.First(c => c.Id == client.Id);
                if (objClient != null)
                {
                    objClient.Name = client.Name;
                    objClient.MainPOC = client.MainPOC;
                    objClient.TacticalPOC = client.TacticalPOC;
                    objClient.OperativePOC = client.OperativePOC;

                }

                int result = objEntity.SaveChanges();
                if (result > 0)
                {
                    message = "Client has been sussfully updated";
                }
                else
                {
                    message = "faild";
                }

            }
            catch (Exception)
            {
                throw;
            }

            return Ok(message);
        }

        [HttpDelete]
        [Route("DeleteClientDetails/{id}")]
        public IHttpActionResult DeleteClientDetails(int id)
        {
            string message = "";
            Client client = objEntity.Clients.First(c => c.Id == id);
            if (client == null)
            {
                return NotFound();
            }

            objEntity.Clients.Remove(client);
            int result = objEntity.SaveChanges();
            if (result > 0)
            {
                message = "Client has been sussessfully deleted";
            }
            else
            {
                message = "faild";
            }

            return Ok(message);
        }
    }
}
