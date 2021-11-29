/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/search', 'N/task', 'N/file', 'N/email', 'N/render'],
	/**
	 * @param {record} record
	 * @param {search} search
	 */
	function(record, runtime, search, task, file, email, render) {

		const governanceCap = 9950;

		function execute(scriptContext) {
			function rescheduleCurrentScript(s) {
				log.debug("call function", s);
				var scheduledScriptTask = task.create({
					taskType: task.TaskType.SCHEDULED_SCRIPT,
					params: {
						'custscript_reschedule_parameter': s
					}
				});
				scheduledScriptTask.scriptId = runtime.getCurrentScript()
					.id;
				scheduledScriptTask.deploymentId = runtime.getCurrentScript()
					.deploymentId;
				return scheduledScriptTask.submit();
			}
			var a = runtime.getCurrentScript()
				.getParameter("custscript_reschedule_parameter");
			
			log.debug("a", a);
			try {
				if(!a) {
					a = 0;
				}
				var script = runtime.getCurrentScript();
				// GET YOUR SEARCH HERE
				var purchaserequisitionSearchObj = search.create({
					type: "purchaserequisition",
					filters: [
						["type", "anyof", "PurchReq"],
						"AND",
						["status", "anyof", "PurchReq:A","PurchReq:B"],
						"AND",
						["mainline", "is", "T"],
						"AND", 
						["custbody_is_closed","is","F"]
					],
					columns: [
						search.createColumn({
							name: "trandate",
							label: "Date"
						}),
						search.createColumn({
							name: "entity",
							label: "REQUESTOR"
						}),
						search.createColumn({
							name: "tranid",
							label: "Document Number"
						}),
						search.createColumn({
							name: "amount",
							label: "Amount"
						}),
						search.createColumn({
							name: "internalid",
							label: "Internal ID"
						}),
						search.createColumn({name: "custbody_check_email_send", label: "Check Email Send"})
					]
				});
				var searchResult = purchaserequisitionSearchObj.run()
					.getRange({
						start: 0,
						end: 1000
					});
				log.debug('searchResult',searchResult.length)
				for(var s = a; s<searchResult.length; s++) 
				{
					try {

						if(runtime.getCurrentScript()
							.getRemainingUsage() < 200) {
							var taskId = rescheduleCurrentScript(s);
							return;
						}
						var recordId = searchResult[s].getValue({
							name: "internalid",
							label: "Internal ID"
						})
						var emailCheckValue = searchResult[s].getValue({
							name: "custbody_check_email_send", label: "Check Email Send"
						})
						//log.debug('emailCheckValue',emailCheckValue)
						//if(emailCheckValue==false || emailCheckValue=="false")
						{
							purchaseRequisition(recordId,emailCheckValue)
						}
						

					}
					catch (err) {
						log.error(err.name, err.message)
					}

					var govPointsUsed = 10000 - script.getRemainingUsage();
					script.percentComplete = (govPointsUsed / governanceCap * 100)
						.toFixed(1);
				}



			}
			catch (err) {
				log.error(err.name, err.message + '; Stack: ' + err.stack)
			};
		}

		function purchaseRequisition(recordId,emailCheckValue) {
			try {
				var purchaseReqObj = record.load({
					type: 'purchaserequisition',
					id: recordId,
					isDyanimic: true
				})
				var recordType = purchaseReqObj.type;
			//	log.debug('recordType', recordType)
				log.debug('in function purchaseReqObj', purchaseReqObj);
				var createdDate = purchaseReqObj.getValue({
					fieldId: 'trandate'
				})
				var checkEmailSend = purchaseReqObj.getValue({fieldId:'custbody_check_email_send'})
				log.debug('checkEmailSend', checkEmailSend)
				log.debug('createdDate', createdDate);
				var employeeId = purchaseReqObj.getValue({
					fieldId: 'entity'
				})
				var fieldLookUp = search.lookupFields({
					type: search.Type.EMPLOYEE,
					id: employeeId,
					columns: 'email'
				});
				log.debug('fieldLookUp', fieldLookUp)

				var reqestorEmail = fieldLookUp.email;
				//log.debug('reqestorEmail', reqestorEmail)
				var diffDays = checkDiffDate(createdDate)
				log.debug('diffDays', diffDays)
				// for 15 days overdew send email notification
				if(diffDays >= 10 && diffDays <= 15 && (emailCheckValue == false || emailCheckValue == "False" || emailCheckValue == "FALSE")) {
					
					SendEmailNotification(recordId, recordType, reqestorEmail)
					purchaseReqObj.setValue({
						fieldId: 'custbody_check_email_send',
						value: true
					})
				}
				else if(diffDays>=16) {
					// for more then 30 dyas then closed the PR
					log.debug('enter in else condition')
					//SendEmailNotification(recordId, recordType, reqestorEmail)
					var lineCount = purchaseReqObj.getLineCount({
						sublistId: 'links'
					})
					log.debug('lineCount', lineCount)
					if(lineCount <= 0) {
						
						log.debug('closed the PR')
						var prLineCount = purchaseReqObj.getLineCount({
							sublistId: 'item'
						})
						//purchaseReqObj.setValue({fieldId:'custbody_is_closed',value:false})
						if(prLineCount>=1)
						{
						purchaseReqObj.setValue({fieldId:'custbody_is_closed',value:true})
						
						for(var i = 0; i < prLineCount; i++) {
							purchaseReqObj.setSublistValue({
								sublistId: 'item',
								fieldId: 'isclosed',
								value: true,
								line: i
							})
							var getIsclosed = purchaseReqObj.getSublistValue({
								sublistId: 'item',
								fieldId: 'isclosed',
								line: i
							})
							log.debug('getIsclosed', getIsclosed)
						}
						}
					}

				}
				var prRecId = purchaseReqObj.save({enableSourcing: true,
    ignoreMandatoryFields: true})
				log.debug('prRecId', prRecId)
			}
			catch (err) {
				log.error(err.name, err.message + 'error in :purchaseRequisition ' + err.stack)
			}
		}
		//This function will check the differenc of two date and return total no of days
		function checkDiffDate(createdDate) {
			const date1 = new Date(createdDate);
			const date2 = new Date();
			const diffTime = Math.abs(date2 - date1);
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			return diffDays


		}

		function SendEmailNotification(recordId, recordType, reqestorEmail) {
			try {
				/*var redereEmailObj = render.mergeEmail({
				templateId: 3,
				customRecord: {
					type: 'render.mergeEmail',
					id: recordId
				}
			})
		log.debug('redereEmailObj', redereEmailObj.body)


				var author = 50548;
				var recipients = 'sanjit@yantrainc.com';
				var subject = 'Infor Error Log';

				var body =
					"Hello Team,\n PFA \n An error occurred with the following information:\n"
				// var id =93562;

				email.send({
					author: 50548,
					recipients: 'sanjit@yantrainc.com',
					subject: subject,
					body: body

				});
				*/
				var emailTemplateId = runtime.getCurrentScript().getParameter("custscript_email_template_id");
				var userObject = runtime.getCurrentUser();
				log.debug('userObject',userObject)
				var userId = userObject.id;
				
					
				log.debug("Name of current user: " + userObject.name);
				var transactionId = parseInt(recordId);
				var mergeResult = render.mergeEmail({
					templateId:emailTemplateId,
					entity: null,
					recipient: null,
					supportCaseId: null,
					transactionId: transactionId,
					customRecord:null
				});
				var emailSubject = mergeResult.subject;
				var emailBody = mergeResult.body;
				log.debug('emailBody', emailBody)
				email.send({
					author: 50548,
					recipients: reqestorEmail,
					subject: emailSubject,
					body: emailBody,
					relatedRecords: {
						transactionId: transactionId
						/*entityId: reqestorEmail,
					customRecord:{
                  id:recordId,
                  recordType: recordType //an integer value
                  }*/
					}
				});
			}
			catch (ex) {
				log.audit('Error in SendEmailNotification Function', ex.message);
			}
		}
		return {
			execute: execute
		};

	});