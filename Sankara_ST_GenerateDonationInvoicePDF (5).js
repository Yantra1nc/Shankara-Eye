/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

/***************************************************************************************  
                      
 **@Author      :  Anand Yadav
 **@Dated       :  29 Sep 2019
 **@Version     :  2.0
 **@Description :  To create a suitelet page which will generate a donation invoice pdf.
 ***************************************************************************************/

define(['N/xml','N/search'],

function(xml,search) {
   
    function onRequest(context) {
        
        var params=context.request.parameters;

        var rec_type=params.rec_type;
        var rec_id=params.rec_id;

        var xmlFounderElement = xml.escape({
            xmlText : "Founder & Managing Trustee"
        });

        log.debug("rec_type",rec_type);
        log.debug("rec_id",rec_id);

        var signatureURL = search.lookupFields({
            type: 'file',
            id: '2743',
            columns: 'url'
        });
        log.debug("signatureURL",signatureURL.url);

        var xmlSignatureElement = xml.escape({
            xmlText : signatureURL.url
        });

        log.debug("xmlSignatureElement",xmlSignatureElement);
    
        //Load Seaech
        var invoiceSearch=search.load({
            id: 'customsearch_donation_receipt_details'
        });
        //log.debug("emailSearch",JSON.stringify(emailSearch));

        var filters=invoiceSearch.filters;
        var columns=invoiceSearch.columns;

        var filterObjId=search.createFilter({
            name: 'internalid',
            operator: search.Operator.ANYOF,
            values: rec_id
        });

        filters.push(filterObjId);

        invoiceSearch.Filters=filters;

        log.debug("filters",JSON.stringify(filters));

        log.debug("columns",JSON.stringify(columns));

        var donor_form=invoice_num=currency=payment_date=is_person=salutation=first_name=last_name=company_name="";
        var address=addressee=address1=address2=address3=city=state=zipcode=country=invoice_amount=customer_pan=paymentmethod=payment_num=receipt_matter="";
        var amount_in_words="";

        invoiceSearch.run().each(function(result) {
            
            invoice_num= result.getValue(columns[0]);
            donor_form = result.getValue(columns[1]);
            currency = result.getText(columns[2]);
            payment_date = result.getValue(columns[3]);
            is_person = result.getValue(columns[4]);
            salutation = result.getValue(columns[5]);
            first_name = result.getValue(columns[6]);
            last_name = result.getValue(columns[7]);
            company_name = result.getValue(columns[8]);
            address = result.getValue(columns[9]);
            addressee = result.getValue(columns[10]);
            address1 = result.getValue(columns[11]);
            address2 = result.getValue(columns[12]);
            address3 = result.getValue(columns[13]);
            city = result.getValue(columns[14]);
            state = result.getText(columns[15]);
            zipcode = result.getValue(columns[16]);
            country = result.getText(columns[17]);
            invoice_amount=result.getValue(columns[18]);
            customer_pan = result.getValue(columns[19]);
            paymentmethod = result.getText(columns[20]);
            payment_num = result.getValue(columns[21]);
            receipt_matter = result.getValue(columns[22]);
            amount_in_words=result.getValue(columns[23]);
            customer_category=result.getValue(columns[24]);

            return true;
        });

         log.debug('invoice_num',invoice_num);
         log.debug('donor_form',donor_form);
         log.debug('currency',currency);
         log.debug('payment_date',payment_date);
         log.debug('is_person',is_person);
         log.debug('salutation',salutation);
         log.debug('first_name',first_name);
         log.debug('last_name',last_name);
         log.debug('company_name',company_name);
         log.debug('address',address);
         log.debug('addressee',addressee);
         log.debug('address1',address1);
         log.debug('address2',address2);
         log.debug('address3',address3);
         log.debug('city',city);
         log.debug('state',state);
         log.debug('zipcode',zipcode);
         log.debug('country',country);
         log.debug('invoice_amount',invoice_amount);
         log.debug('customer_pan',customer_pan);
         log.debug('paymentmethod',paymentmethod);
         log.debug('payment_num',payment_num);
         log.debug('receipt_matter',receipt_matter);
         log.debug('amount_in_words',amount_in_words);
         log.debug('customer_category',customer_category);

        var invoice_num_xml = xml.escape({
            xmlText : invoice_num
        });
        log.debug("invoice_num_xml",invoice_num_xml);

        var donor_form_xml = xml.escape({
            xmlText : donor_form
        });
        log.debug("donor_form_xml",donor_form_xml);

        var currency_xml = xml.escape({
            xmlText : currency
        });
        log.debug("currency_xml",currency_xml);

        var formatted_payment_date=formatDate(payment_date);

        var formatted_payment_date_xml = xml.escape({
            xmlText : formatted_payment_date
        });
        log.debug("formatted_payment_date",formatted_payment_date);

        var company_name_xml;
        var salutation_xml;
        if(is_person==false){

            salutation= "Sir/Madam ";
            var salutation_xml = xml.escape({
                xmlText : salutation
            });

            log.debug("salutation_xml",salutation_xml);

            var company_name_xml = xml.escape({
                xmlText : company_name
            });
            log.debug("company_name_xml",company_name_xml);

            if(isEmpty(salutation_xml)){

                salutation_xml = company_name_xml;                
            }

            log.debug("salutation_xml",salutation_xml);

        }else{

            var customer_name = first_name + " " +last_name;
            log.debug("customer_name",customer_name);

            var salutation_xml = xml.escape({
                xmlText : salutation
            });
            log.debug("salutation_xml",salutation_xml);

            var company_name_xml = xml.escape({
                xmlText : customer_name
            });
            log.debug("company_name_xml",company_name_xml);

            if(isEmpty(salutation_xml)){

                salutation_xml = company_name_xml;                
            }else{

                salutation_xml = salutation_xml +" " + company_name_xml;
            }

            log.debug("salutation_xml",salutation_xml);

        }

        var addressee_xml = xml.escape({
            xmlText : addressee
        });
        log.debug("addressee_xml",addressee_xml);

        var address1_xml = xml.escape({
            xmlText : address1
        });
        log.debug("address1_xml",address1_xml);

        var address2_xml = xml.escape({
            xmlText : address2
        });
        log.debug("address2_xml",address2_xml);

        var address3_xml = xml.escape({
            xmlText : address3
        });
        log.debug("address3_xml",address3_xml);

        var city_xml = xml.escape({
            xmlText : city
        });
        log.debug("city_xml",city_xml);

        var state_xml = xml.escape({
            xmlText : state
        });
        log.debug("state_xml",state_xml);

        var zipcode_xml = xml.escape({
            xmlText : zipcode
        });
        log.debug("zipcode_xml",zipcode_xml);

        var country_xml = xml.escape({
            xmlText : country
        });
        log.debug("country_xml",country_xml);

        var formatted_invoice_amount = formatAmount(invoice_amount);
        log.debug("formatted_invoice_amount",formatted_invoice_amount);

        var formatted_invoice_amount_xml = xml.escape({
            xmlText : formatted_invoice_amount
        });
        log.debug("formatted_invoice_amount_xml",formatted_invoice_amount_xml);

        var customer_pan_xml = xml.escape({
            xmlText : customer_pan
        });
        log.debug("customer_pan_xml",customer_pan_xml);

        var paymentmethod_xml = xml.escape({
            xmlText : paymentmethod
        });
        log.debug("paymentmethod_xml",paymentmethod_xml);

        var payment_num_xml = xml.escape({
            xmlText : payment_num
        });
        log.debug("payment_num_xml",payment_num_xml);

        var receipt_matter_xml = xml.escape({
            xmlText : receipt_matter
        });
        log.debug("receipt_matter_xml",receipt_matter_xml);

        var invoice_amount_words_xml = xml.escape({
            xmlText : amount_in_words
        });
        log.debug("invoice_amount_words_xml",invoice_amount_words_xml);

        //var invoice_amount_words_xml="Rupees Three Crore Fifty Five Lakhs Ninety Thousand Only";

        var xmlValue = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n";
        xmlValue += "<pdf>\n";
        var htmlTag = '<head>';
        htmlTag+='<macrolist>';
        
        htmlTag+='<macro id="pageheader">';
        htmlTag+='<table class="noborder fullwidth" style = "height:20px">';
        htmlTag+='</table>';
        htmlTag+='<table class="noborder fullwidth" style = "height:20px">';
        htmlTag+='</table>';
        htmlTag+='<table class="noborder fullwidth" style = "height:20px">';
        htmlTag+='</table>';
        htmlTag+='<table class="noborder fullwidth" style = "height:20px">';
        htmlTag+='</table>';
        htmlTag+='<table class="noborder fullwidth" style = "height:20px">';
        htmlTag+='</table>';
        htmlTag+='<table class="header noborder fullwidth">';
        htmlTag+='<tr>';
        htmlTag+='<td colspan="3">';
        //htmlTag+='<hr height="1px" width="100%" />';
        htmlTag+='</td>';
        htmlTag+='</tr>';
        htmlTag+='</table>'
        htmlTag+='</macro>';
        
        htmlTag+='<macro id="pagefooter">';
        htmlTag+='<table class="footer noborder fullwidth">';
        htmlTag+='<tr>';
        htmlTag+='<td colspan="4">';
        //htmlTag+='<hr height="1px" width="100%" />';
        htmlTag+='</td>';
        htmlTag+='</tr>';
        htmlTag+='<tr>';
        htmlTag+='<td class="footl item"></td>';
        htmlTag+='<td class="footl item"></td>';
        htmlTag+='<td class="footl item"></td>';
        htmlTag+='<td class="footr item"></td>';
        htmlTag+='</tr>';
        htmlTag+='</table>';
        htmlTag+='</macro>';
        htmlTag+='</macrolist>';
        htmlTag+='<style type="text/css">';
        htmlTag+='table {';
        htmlTag+='font-size: 9pt;';
        htmlTag+='font-family: arial,helvetica,sans-serif;';
        htmlTag+='font-size: 9pt;';
        htmlTag+='}';
        htmlTag+='table.noborder {';
        htmlTag+='border: none;';
        htmlTag+='}';
        htmlTag+='table.border{';
        //htmlTag+='border-style: solid;';
        htmlTag+='border-width: 0.5px;';
        htmlTag+='}';
        htmlTag+='table.fullwidth {';
        htmlTag+='width: 100%;';
        htmlTag+='}';
        htmlTag+='table.tdthborder td{';
        //htmlTag+='border-style: solid;';
        htmlTag+='border-width: 0.5px;';
        htmlTag+='}';
        htmlTag+='table.tdthborder th{';
        htmlTag+='border-width: 0.5px;';
        htmlTag+='align: center;';
        htmlTag+='font-weight: bold;';
        htmlTag+='background-color: #F0F0F0;';
        htmlTag+='height:20pt;';
        htmlTag+='}';
        htmlTag+='.header td.title {';
        htmlTag+='font-size: 14pt;';
        htmlTag+='font-weight: bold;';
        htmlTag+='text-align: right;';
        htmlTag+='vertical-align:bottom;';
        htmlTag+='}';
        htmlTag+='.header td.label {';
        htmlTag+='text-align: right;';
        htmlTag+='vertical-align:top;';
        htmlTag+='}';
        htmlTag+='<!-- adjust logo size here -->';
        htmlTag+='.header td.logo img {';
        htmlTag+='margin: 0px;';
        htmlTag+='width: 70%;';
        htmlTag+='height: 70%;';
        htmlTag+='}';
        htmlTag+='.footer td.title {';
        htmlTag+='font-size: 12pt;';
        htmlTag+='align: left;';
        htmlTag+='vertical-align:middle;';
        htmlTag+='}';
        htmlTag+='.footer td.footl {';
        htmlTag+='font-size: 8t;';
        htmlTag+='width: 25';
        htmlTag+='align: left;';
        htmlTag+='vertical-align:top;';
        htmlTag+='}';
        htmlTag+='.footer td.footr {';
        htmlTag+='font-size: 8t;';
        htmlTag+='width: 25';
        htmlTag+='align: right;';
        htmlTag+='vertical-align:top;';
        htmlTag+='}';
        htmlTag+='.donation{';
        htmlTag+='font-size:10pt;';
        htmlTag+='position: absolute;';
        htmlTag+='border: 1px solid;';
        htmlTag+='border-top: 0px;';
        htmlTag+='top: -15px;';
        htmlTag+='left: 80%;';
        htmlTag+='padding: 0px 5px;';
        htmlTag+='}';
        htmlTag+='.amount{';
        htmlTag+='font-size:10pt;';
        htmlTag+='position: absolute;';
        htmlTag+='border: 1px solid;';
        //htmlTag+='left: 0;';
        htmlTag+='top: 20px;';
        htmlTag+='padding: 0px 30px;';
      //htmlTag+='width: 60%;';
       htmlTag+='height: 30px;';
     //htmlTag+='text-align: center !important;';
        htmlTag+='}';

        /*htmlTag+='body {';
        htmlTag+='margin: 25px 50px 75px 100px;';
        htmlTag+='}';*/
        htmlTag+='</style>';
        htmlTag+='</head>';
        htmlTag+='<body width = "816px" height = "1056px" header="pageheader" header-height="85px" footer="pagefooter" footer-height="30px" padding="45px" size="A4" >';
        
        htmlTag+='<table class="noborder fullwidth" style = "height:20px">';
        htmlTag+='</table>';
        htmlTag+='<table class="noborder fullwidth" style = "height:20px">';
        htmlTag+='</table>';
        htmlTag+='<table class="noborder fullwidth" style = "height:20px">';
        htmlTag+='</table>';
        htmlTag+='<table class="noborder fullwidth" style = "height:20px">';
        htmlTag+='</table>';
            
        htmlTag+='<table class="noborder fullwidth" align = "center">';
        htmlTag+='<tr>';
        htmlTag+='<td width="50%">Ref : '+donor_form_xml+'</td>';
        htmlTag+='<td width="50%" align="right">'+formatted_payment_date_xml+'</td>';
        htmlTag+='</tr>';

        htmlTag+='<tr>';
if(customer_category == 10){
     htmlTag+='<td width="50%"><br/>'+salutation+" "+company_name_xml;   
}else {
 htmlTag+='<td width="50%"><br/>'+company_name_xml;   
}
        
        //htmlTag+='<br/>'+addressee_xml;
        if(!isEmpty(address1_xml)){

      
            htmlTag+='<br/>'+address1_xml;
        }
        
        if(!isEmpty(address2_xml)){
            
            htmlTag+='<br/>'+address2_xml;
        }
        
        if(!isEmpty(address3_xml)){
            
            htmlTag+='<br/>'+address3_xml;
        }


        if(!isEmpty(city_xml) && !isEmpty(zipcode_xml)){

            htmlTag+='<br/>' + city_xml + '- ' + zipcode_xml;
        }

        else if(!isEmpty(city_xml)){

            htmlTag+='<br/>' + city_xml;

        }else if(!isEmpty(zipcode_xml)){

            htmlTag+='<br/>' + zipcode_xml;
        }

        if(!isEmpty(state_xml) && !isEmpty(country_xml)){

            htmlTag+='<br/>' + state_xml + '- ' + country_xml;
        }

        else if(!isEmpty(state_xml)){

            htmlTag+='<br/>' + state_xml;

        }else if(!isEmpty(country_xml)){

            htmlTag+='<br/>' + country_xml;
        }

        htmlTag+='</td>';

        htmlTag+='<td width="50%"></td>';
        htmlTag+='</tr>';
        htmlTag+='<tr>';
        htmlTag+='<td width="50%"><br/>Dear '+salutation_xml+',</td>';
        htmlTag+='<td width="50%"></td>';

        htmlTag+='</tr>';
        
        htmlTag+='<tr>';
        htmlTag+='<td width="50%"><br/>Warm greetings from Sankara Eye Foundation India!</td>';
        htmlTag+='<td width="50%"></td>';
        htmlTag+='</tr>';
        htmlTag+='<tr>';
        htmlTag+='<td width="110%"><br/>We are extremely grateful for your kind contribution of '+currency_xml +' '+formatted_invoice_amount_xml+' made on '+ formatted_payment_date_xml+', and please find below our donation receipt. We appreciate your concern for the poor and your initiative to support the care of visually impaired and blind.</td>';
        htmlTag+='</tr>';
        htmlTag+='<tr>';
        htmlTag+='<td width="110%"><br/>Your thoughtful contribution will go a long way in combating curable blindness in our Country.</td>';
        htmlTag+='</tr>';
        htmlTag+='<tr>';
        htmlTag+='<td width="110%"><br/>It is with your support that we have grown. Presently Sankara Eye Foundation India as a group is able to perform over 500 free eye surgeries every day. We have provided free surgical eye care to over 2.1 million needy patients so far.</td>';
        htmlTag+='</tr>';
        htmlTag+='<tr>';
        htmlTag+='<td width="110%"><br/>We take this opportunity to invite you to visit our institution. It will be our pleasure to have you visit us. Thank you once again for your generous support. We look forward to your continued support.</td>';
        htmlTag+='</tr>';
        htmlTag+='<tr>';
        htmlTag+='<td width="50%"><br/>Yours sincerely,</td>';
        htmlTag+='<td width="50%"></td>';
        htmlTag+='</tr>';

        htmlTag+='<tr>';
        htmlTag+='<td width="50%"><img src="'+xmlSignatureElement+'" /></td>';
        htmlTag+='<td width="50%"></td>';
        htmlTag+='</tr>';

        htmlTag+='<tr>';
        htmlTag+='<td width="50%">Dr. R V Ramani</td>';
        htmlTag+='<td width="50%"></td>';
        htmlTag+='</tr>';

        htmlTag+='<tr>';
        htmlTag+='<td width="50%">'+xmlFounderElement+'</td>';
        htmlTag+='<td width="50%"></td>';
        htmlTag+='</tr>';
        htmlTag+='</table>';

        htmlTag+='<hr height="1px" width="100%" />';
        
        htmlTag+='<table style="position: relative; height: 40px; width: 100%;">';
        htmlTag+='<tr>';
        htmlTag+='<td><div class="donation"><b>Donation Receipt</b></div></td>';
        htmlTag+='<td></td>';
        htmlTag+='</tr>';
        htmlTag+='</table>';

        htmlTag+='<table class="noborder fullwidth" align = "center">';
        htmlTag+='<tr>';
        htmlTag+='<td width="30%"><b>Receipt Number : '+invoice_num_xml+'</b></td>';
        htmlTag+='<td width="40%" align="center"><b>Date : '+ formatted_payment_date_xml+'</b></td>';
        htmlTag+='<td width="30%"></td>';
        htmlTag+='</tr>';
        htmlTag+='<tr>';

if(customer_category == 10){
htmlTag+='<td width="100%" colspan="3"><br/>Received with thanks from '+salutation+" "+company_name_xml;       
}else {
    htmlTag+='<td width="100%" colspan="3"><br/>Received with thanks from '+company_name_xml;
}

        
        if(!isEmpty(customer_pan_xml)){
            htmlTag+=' PAN '+ customer_pan_xml;
        }
        htmlTag+=' the sum of '+ invoice_amount_words_xml+' vide '+paymentmethod_xml+' Ref no. '+payment_num_xml+' on account of donation ['+receipt_matter_xml+'].</td>';
        htmlTag+='</tr>';
        htmlTag+='</table>';

        htmlTag+='<table class="noborder fullwidth" align = "center">';
        htmlTag+='<tr>';
         htmlTag+='<td width="50%"><div class="amount"><b width="100%">'+currency_xml+ ' '+formatted_invoice_amount_xml+'</b></div></td>';
        htmlTag+='<td width="50%" align="right"><img src="'+xmlSignatureElement+'" /></td>';
        htmlTag+='</tr>';

        htmlTag+='<tr>';
        htmlTag+='<td width="50%"></td>';
        htmlTag+='<td width="50%" align="right">Dr. R V  Ramani</td>';
        htmlTag+='</tr>';
        
        htmlTag+='<tr>';
        htmlTag+='<td width="50%"></td>';
        htmlTag+='<td width="50%" align="right">'+xmlFounderElement+'</td>';
        htmlTag+='</tr>';
        htmlTag+='</table>';

        htmlTag+='<table class="border fullwidth" align = "center">';
        htmlTag+='<tr>';
        htmlTag+='<td width="100%">Donation exempt u/s 80G, granted in perpetully by the Commissioner of Income Tax-I vide C.No.127(73)/11-12/CIT- I/CBE/2012-13 dated 24.09.2012 PAN : AABTS5084P (Receipt is valid subject to the realization of Cheque/ECS/Credit card only. This is an electronically generated receipt.)</td>';
        htmlTag+='</tr>';
        htmlTag+='</table>';

        xmlValue += htmlTag;

        //log.debug('htmlTag',htmlTag);
        xmlValue += "</body>\n</pdf>";

        context.response.renderPdf(xmlValue);
            
    }

    function isEmpty(string)
    {
        if (string == '' || string == null)
            return true;
        return false;
    }

    function formatAmount(amount){
    
        //nlapiLogExecution('debug','inside format function');
        var amount_new=0.00;
        
        if(amount == 0 || amount == '0' || amount==0.00 || amount=='0.00'){
            amount_new=amount;
        }
        else{
            
            var amount_parts = amount.toString().split(".");
            amount_parts[0] = amount_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            var amount_new =  amount_parts.join(".");
             
        }
        //nlapiLogExecution('debug','amount_new',amount_new);
        
        return amount_new;      
    }

    function formatDate(date_str){

        //nlapiLogExecution('debug','date_str',date_str);

        /*var d = new Date(date_str);
        //nlapiLogExecution('debug','d',d);

        var date=d.getDate();
        var month= d.getMonth() + 1;
        if(month<10){
        month= "0" + month;
        }
        var year=d.getFullYear();
        var formatted_date =  date + "-" + month + "-" + year;

        nlapiLogExecution('debug','formatted_date',formatted_date);*/

        var formatted_date=date_str.replace(/\//g, "-");

        return formatted_date;
    }

    return {
        onRequest: onRequest
    };
    
});
