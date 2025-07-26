const sheetname='Records'
const INVOICE_SHEET_NAME = 'Invoice';
const INVOICE_RANGE = 'A1:I26';
const EMAIL_SUBJECT = 'Invoice Notification';
const EMAIL_BODY = 'Hello,\rThis email is confirmation of your order. Please see the attached invoice.';
const INVOICE_NO_RANGE = "C21:D21";
const INVOICE_RECORD_SHEET_NAME = "Invoice List";
const invoiceColumn = 5;
const customerMailColumn = 4;
const ReplyMail = 'noreply.service@email.com'




const scriptProp = PropertiesService.getScriptProperties()

//for updateing database
function intialSetup(){
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key' , activeSpreadsheet.getId())
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName( sheetname ); 

    // === Get the next invoice number ===  

     
    const lastInvoice = getLastInvoiceNumber(sheet, invoiceColumn);
    const newInvoiceNumber = lastInvoice + 1;

    // === Prepare form data ===
    const formData = e.parameter;
    const rowData = [
      formData.your_name || '',
      formData.serviv || '',
      formData.your_number || '',
      formData.your_email || '',
      newInvoiceNumber, // Auto-incremented number
      formData.patment_method || '',
      formData.client_address_1 || '',
      formData.client_address_2 || ''
    ];

    // === Save to sheet ===
    sheet.appendRow(rowData);

    // === Return success with invoice number ===
    return ContentService.createTextOutput(
      `Success! Invoice #${newInvoiceNumber} created.`
    ).setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    return ContentService.createTextOutput(
      "Error: " + error.message
    ).setMimeType(ContentService.MimeType.TEXT);
  }
}

// Helper function to get the last invoice number 
function getLastInvoiceNumber(sheet, column) {
  const data = sheet.getRange(2, column, sheet.getLastRow() - 1, 1).getValues().flat();
  const numbers = data.filter(cell => !isNaN(cell) && cell !== "");
  return numbers.length > 0 ? Math.max(...numbers) : 0;
}



 //Send email with invoice PDF as an attachment. 

function emailInvoice() {
  try {
    const ss = SpreadsheetApp.getActive();
    const invoiceSheet = ss.getSheetByName( sheetname );
    //INVOICE_SHEET_NAME
    const recipientEmail =invoiceSheet.getRange(invoiceSheet.getLastRow(),customerMailColumn).getValue();
    SpreadsheetApp.flush();
    Utilities.sleep(500); // Using to offset any potential latency in creating .pdf
    const pdfFile = createPDF();
    //Send the email with PDF attachment
    GmailApp.sendEmail(recipientEmail, EMAIL_SUBJECT, EMAIL_BODY, {attachments: [pdfFile.getAs(MimeType.PDF)],from: ReplyMail}
                        );
    //Create a record in Google Sheets that includes a link to the file saved in Drive.
    createRecord(pdfFile);   
  } 
  catch (error) {
    Logger.log("Error during invoice processing: " + error.message);
    SpreadsheetApp.getUi().alert("Error during invoice processing: " + error.message);
  }
}


// Create a new record in Google Sheets,with File Name,URL & Created Date
 
function createRecord(pdfFile) {
  try {
    const ss = SpreadsheetApp.getActive();
    const recordSheet = ss.getSheetByName(INVOICE_RECORD_SHEET_NAME);
    const fileName = pdfFile.getName();
    const url = pdfFile.getUrl();
    const dateCreated = new Date().toLocaleString();

    //Append Record
    recordSheet.appendRow([fileName, url, dateCreated]);
  } catch (error) {
    Logger.log("Error creating invoice record: " + error.message);
    SpreadsheetApp.getUi().alert("Error creating invoice record: " + error.message);
  }
}


// Create and save the invoice as PDF in the Google Drive folder
 
function createPDF() {
  try {
    const ss = SpreadsheetApp.getActive();
    const invoiceSheet = ss.getSheetByName(INVOICE_SHEET_NAME);
    const sa = SpreadsheetApp.getActive();
    const base = sa.getSheetByName(sheetname);
    const baseNom = base.getRange(base.getLastRow(),5).getValue();
    const ssIdd = sa.getId();  
    const pdfName = baseNom;
    const folderId = getOrCreateInvoicesFolder(ssIdd);
    const folder = DriveApp.getFolderById(folderId);
    const url = "https://docs.google.com/spreadsheets/d/" + ssIdd + "/export" +
      "?exportFormat=pdf&" +
      "format=pdf&" +
      "size=A4&" +
      "fzr=true&" +
      "portrait=true&" +
      "fitw=true&" +
      "gridlines=false&" +
      "printtitle=false&" +
      "top_margin=0.5&" +
      "bottom_margin=0.25&" +
      "left_margin=0.5&" +
      "right_margin=0.5&" +
      "sheetnames=false&" +
      "pagenum=UNDEFINED&" +
      "attachment=true&" +
      "gid=" + invoiceSheet.getSheetId() + "&" +
      "range=" + INVOICE_RANGE;
    const params = { method: "GET", headers: { "authorization": "Bearer " + ScriptApp.getOAuthToken() } };
    const blob = UrlFetchApp.fetch(url, params).getBlob().setName(pdfName + '.pdf');
    const pdfFile = folder.createFile(blob);
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return pdfFile;
  } 
  catch (error) {
    Logger.log("Error during PDF creation: " + error.message);
    SpreadsheetApp.getUi().alert("Error during PDF creation: " + error.message);
  }
}


/**
 * Checks for a folder named "Invoices_PDF" within the same parent folder as the specified spreadsheet.  
 * If the folder doesn't exist, it creates it.
 */
function getOrCreateInvoicesFolder(ssIdd) {
  // Get the folder containing the spreadsheet
  var parentFolder = DriveApp.getFileById(ssIdd).getParents().next();

  // Search for the "Invoices_PDF" folder
  var folders = parentFolder.getFoldersByName("Invoices_PDF");

  if (folders.hasNext()) {
    // Folder exists
    var invoiceFolder = folders.next();
    var folderId = invoiceFolder.getId();
  } else {
    // Folder doesn't exist
    var invoiceFolder = parentFolder.createFolder("Invoices_PDF");
    var folderId = invoiceFolder.getId();
  }

  return folderId;
}


//updating invoice number(if needed) in invoice sheet and then emailing that sheet 
function updateinvoicenum(e) {
  const ss = SpreadsheetApp.getActive();
  const basee = ss.getSheetByName(sheetname);
  const sheet = SpreadsheetApp.getActive();
  const invoicee = sheet.getSheetByName(INVOICE_SHEET_NAME);
  const updatenum =basee.getRange(basee.getLastRow(),invoiceColumn).getValue();//updated invoice
  invoicee.getRange(INVOICE_NO_RANGE).setValue(updatenum);
  const sl = SpreadsheetApp.getActive();
  const ba = sl.getSheetByName(INVOICE_RECORD_SHEET_NAME);
  const upda =ba.getRange(ba.getLastRow(),1).getValue();//invoice.pdf
  if(!((updatenum+".pdf")==upda))
    emailInvoice();
}

//opening pdf of selected invoice number   +++++++++++++++
function displayrecord(inum)
{
  var s = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = s.getSheetByName(INVOICE_RECORD_SHEET_NAME);
  var lik=sheet.getRange("Invoice List!B:B").getValues().flat().filter(r=>r!='');
  var name_range=sheet.getRange("Invoice List!A:A").getValues().flat().filter(r=>r!='');
  for(let i=1;i<name_range.length;i++)
    if(name_range[i]==(inum+".pdf"))
      return lik[i]; 
}