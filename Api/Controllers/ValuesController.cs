using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Web {
    
    [Route("/api/values")]
    public class ValuesController 
    {
        private readonly ILogger<ValuesController> _logger;
        
        public ValuesController(ILogger<ValuesController> logger) {
            this._logger = logger;
            logger.LogDebug("Debugging");
        }
        
        [HttpGet]
        public string[] Get() {
            return new string[] {"value1","value2","value3","value4"};
        }
    }
}