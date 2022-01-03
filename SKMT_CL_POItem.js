/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 
 /*************************************************************
 * File Header
 * Script Type: Client   Script
 * Script Name: Client Script Purchase Order  
 * File Name: Shankara SKMT_CL_POItem.js
 * Created On: 12/08/2021
 * Modified On:
 * Created By: Akash Singh (Yantra Inc.)
 * Modified By:
 * Description:
 *********************************************************** */
 
 define(['N/record','N/search'],
 
 function(record,search){
	 
	 function fieldChanged(context){
		 
		 try{
		 
		 var currentRecord = context.currentRecord;
		 
		 var recType = currentRecord.type;
		 
		 var recId = currentRecord.id;
		 
		 log.debug('Record Type',recType);
		 log.debug('Record Id',recId);
		 
		 var sublistName = context.sublistId;
		 
		 var fieldName = context.fieldId;
		 
		 if(sublistName == 'item' && fieldName == 'item'){
		 
		 if(recType =='purchaseorder'){
			 
			 var item = currentRecord.getCurrentSublistValue({
				 
				 sublistId:'item',
				 fieldId:'item'
			 });
			 
			 log.debug('Item Data',item);
			 
			 var loc = currentRecord.getValue({
				 
				 fieldId:'location'
			 });
			 
			 alert('Location' +loc);
			 
			var tranid ='';
			
			var temparr=[];
			 
			 
			 if(_logValidation(item)){
				 
		     var purchaseorderSearchObj = search.create({
   type: "purchaseorder",
   filters:
   [
      ["type","anyof","PurchOrd"], 
      "AND", 
      ["status","anyof","PurchOrd:B","PurchOrd:D"], 
      "AND", 
      ["item.type","anyof","InvtPart","Service"], 
      "AND", 
      ["item","anyof",item], 
      "AND", 
      ["location","anyof",loc],
   ],
   columns:
   [
      search.createColumn({name: "tranid", label: "Document Number"}),
      search.createColumn({name: "trandate", label: "Date"}),
      search.createColumn({name: "location", label: "Location"}),
      search.createColumn({
         name: "altname",
         join: "vendor",
         label: "Vendor Name"
      }),
      search.createColumn({name: "item", label: "Item Name"}),
      search.createColumn({name: "quantity", label: "PO Quantity"}),
      search.createColumn({name: "quantityshiprecv", label: "Quantity Receive"}),
      search.createColumn({
         name: "formulanumeric",
         formula: "{quantity}-{quantityshiprecv}",
         label: "Balance Order Qty"
      }),
      search.createColumn({name: "statusref", label: "Status"}),
      search.createColumn({name: "subsidiary", label: "Subsidiary"}),
      search.createColumn({name: "location", label: "Location"})
   ]
});
var searchResultCount = purchaseorderSearchObj.runPaged().count;
log.debug("purchaseorderSearchObj result count",searchResultCount);
purchaseorderSearchObj.run().each(function(result){
   // .run().each has a limit of 4,000 results
   
   var internalId = result.getValue({
	   name:'item'
   });
   
   tranid = result.getValue({
	   
	   name:'tranid'
   });
   
   temparr.push(tranid);
   
   loc = result.getValue({
	   
	   name:'location'
   });
   
   alert('Location' +loc);
   return true;
});

if(searchResultCount > 0){

 alert("Item already exist with this Purchase Order " +temparr);
 currentRecord.setCurrentSublistValue({sublistId:'item',fieldId:'item', value:'item',ignoreFieldChange: true,forceSyncSourcing: true});
 

}

			 }
		 
				/* var a_filters = new Array();

            var a_columns = new Array();
            a_columns.push(search.createColumn({
                name: 'internalid'
            }));

            var a_filters = new Array();
            
                a_filters.push(
                    search.createFilter({
                        name: 'item',
                        operator: search.Operator.ANYOF,
                        values: item
                    })
                );
        
          
            var purchaseSearchObj = search.load({
                id: 'customsearch_open_po'
            });

            if (_logValidation(a_filters)) {
                for (var idx = 0; idx < a_filters.length; idx++) {
                    purchaseSearchObj.filters.push(a_filters[idx]);
                }
            }
            var a_search_results = purchaseSearchObj.run().getRange({
                start: 0,
                end: 1000
            });
            log.debug('schedulerFunction', ' HSBC to NS Search Results  -->' + a_search_results);

            var counter = 0;
            //vendorbillSearchObj.run().each(function(result)
			
			var purchaseCount = purchaseSearchObj.runPaged().count;
			
			 log.debug("purchaseSearchObj result count",purchaseCount);

            if(_logValidation(a_search_results)) 
			{
                for (var i = 0; i < a_search_results.length; i++) {
                    // .run().each has a limit of 4,000 results
                    var i_recordID = a_search_results[i].getValue({
                        name: "internalid"
                    });
					
					var tranid = a_search_results[i].getValue({
					
					    name:"tranid"
					});
					
					
					
				
}
}

         if(purchaseCount > 0){
			 
			 alert('This Purchase Order of this Item is already created',tranid);
			  currentRecord.setValue({fieldId:'item', value:'',ignoreFieldChange: true,forceSyncSourcing: true});
			 
		 }
            
  */
				 
			
			 }
			 
			 
		 }
		 
		 
}
			 

		 catch(ex){
			 
		  log.debug('Error',ex);
		 
		 }
		 

	 }
	 
	 function _logValidation(val) {
        if (val != null && val != 'undefined' && val != 'NaN' && val != '') {
           return true;
        }
        return false;
     }
  
	 
	 return{
		 
		 fieldChanged: fieldChanged
		 
	 };
 })
