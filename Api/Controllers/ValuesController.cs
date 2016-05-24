using Microsoft.AspNetCore.Mvc;
namespace Web {
    
    [Route("/values")]
    public class ValuesController 
    {
        [HttpGet]
        public string[] Get() {
            return new string[] {"value1","value2"};
        }
    }
}