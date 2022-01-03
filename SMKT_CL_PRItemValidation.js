/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 
 /*************************************************************
 * File Header
 * Script Type: Client   Script
 * Script Name: Client Script Purchase Requstition 
 * File Name: Shankara SKMT_CL_PRItenValidation.js
 * Created On: 12/13/2021
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
			 
			 var recID = currentRecord.id;
			 
			 var recType = currentRecord.type;
			 
			 log.debug('Record Id',recID);
			 
			 log.debug('Record Type', recType);
			 
			  var sublistName = context.sublistId;
		 
		       var fieldName = context.fieldId;
			   
			   
			   if(sublistName == 'item' && fieldName == 'item'){
			 
			 
			 if(recType == 'purchaserequisition'){
				 
				
				 
				 
				 var item = currentRecord.getCurrentSublistValue({
					 
					 sublistId:'item',
					 
					 fieldId: 'item'
				 });
				 
				 log.debug('Item Data', item);
				 
				 var location = currentRecord.getValue({
					 
					 fieldId:'location'
					 
				 });
				 //alert('Location' +location);
				 
				 var tranid = '';
				 
				 var temparr=[];
				 
				
				 
				 
				 
				 if(_logValidation(item)){
					 
				/* var purchaserequisitionSearchObj = search.create({
   type: "purchaserequisition",
   filters:
   [
      ["type","anyof","PurchReq"], 
      "AND", 
      ["item.type","anyof","InvtPart"], 
      "AND", 
      ["status","anyof","PurchReq:B","PurchReq:D"],
	  
	  "AND",
	   ["item.internalid","anyof",item],
   ],
   columns:
   [
      search.createColumn({name: "tranid", label: "Document Number"}),
      search.createColumn({name: "trandate", label: "Date"}),
      search.createColumn({name: "location", label: "Location"}),
      search.createColumn({
         name: "itemid",
         join: "item",
         label: "Item Name"
      }),
      search.createColumn({name: "quantity", label: "Req. Quantity"}),
      search.createColumn({
         name: "quantity",
         join: "purchaseOrder",
         label: "Purchase Order Quantity"
      }),
      search.createColumn({name: "statusref", label: "Status"}),
      search.createColumn({
         name: "formulanumeric",
         formula: "{quantity}-{purchaseorder.quantity}",
         label: "Balance PR quantity"
      })
   ]
});
 */
/* var searchResultCount = purchaserequisitionSearchObj.runPaged().count;
alert("purchaserequisitionSearchObj result count" +searchResultCount); */

var purchaserequisitionSearchObj = search.create({
   type: "purchaserequisition",
   filters:
   [
      ["type","anyof","PurchReq"], 
      "AND", 
      ["item.type","anyof","InvtPart"], 
      "AND", 
      ["status","anyof","PurchReq:B"], 
      "AND", 
      ["item","anyof",item], 
	  
	  "AND", 
      ["location","anyof",location]
     
   ],
   columns:
   [
      search.createColumn({name: "internalid", label: "Internal Id"}),
      search.createColumn({name: "tranid", label: "Document Number"}),
      search.createColumn({name: "trandate", label: "Date"}),
      search.createColumn({name: "location", label: "Location"}),
      search.createColumn({
         name: "itemid",
         join: "item",
         label: "Item Name"
      }),
      search.createColumn({name: "quantity", label: "Req. Quantity"}),
      search.createColumn({
         name: "quantity",
         join: "purchaseOrder",
         label: "Purchase Order Quantity"
      }),
      search.createColumn({name: "statusref", label: "Status"}),
      search.createColumn({
         name: "formulanumeric",
         formula: "{quantity}-nvl({purchaseorder.quantity},0)",
         label: "Balance PR quantity"
      }),
	  
	  search.createColumn({name: "subsidiary", label: "Subsidiary"}),
      search.createColumn({name: "location", label: "Location"})
   ]
});
var searchResultCount = purchaserequisitionSearchObj.runPaged().count;
log.debug("purchaserequisitionSearchObj result count",searchResultCount);
purchaserequisitionSearchObj.run().each(function(result){
	
	var balancePRQuanitity = result.getValue({	
		name: "formulanumeric",
         formula:"{quantity}-nvl({purchaseorder.quantity},0)",
         label: "Balance PR quantity"
	});
	//alert('Balance PR Quantity' +balancePRQuanitity);
	
	var status = result.getValue({
		name:"statusref",
		label:"Status"
	});
	//alert('Status'+status);
	
	location = result.getValue({
		 name:"location",
		 label: "Location"
		
	});
	
	alert('Location' +location);
	
	
	
	if(balancePRQuanitity > 0){
	
	var internalid = result.getValue({
		name:'internalid'
		
	});
	//alert('Internal Id' +internalid);
	
	 tranid = result.getValue({
		name:'tranid'
	});
	temparr.push(tranid);
	
	//alert('Tranid'+tranid);
	
	

	
	}
   // .run().each has a limit of 4,000 results
   return true;
});

  //if(searchResultCount > 0){
	  //alert('Tem Array'+temparr);
	   //alert('Tem Array'+temparr.length);
	  
	  if(temparr && temparr.length > 0){
	  
	  alert('Item already Created in These Purchase Requestion' +temparr);  
	  currentRecord.setCurrentSublistValue({sublistId:'item',fieldId:'item', value:'item',ignoreFieldChange:true,forceSyncSourcing: true});
	  
	  
  }
					 
				 }
				 
				 
				
				 
				 
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