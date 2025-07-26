# 🧾 Automated Service Request & Invoice Management System

> Built for self-managed businesses that need fast, simple automation — no servers, no subscriptions.

This lightweight system helps small shop owners streamline their service requests and invoicing using tools they already know — especially **Google Sheets**.

### Why Google Sheets?

- ✅ **Familiar**: No learning curve — it's already in your Google account  
- ☁️ **Cloud-Based**: Access from any device, anytime  
- 🔗 **Integrated**: Works with Google Drive, Gmail, and Apps Script  
- 🛠️ **Flexible**: Customize templates, fields, and workflows easily

It's a practical solution that delivers automation without complexity — perfect for solo operators and small teams who want to stay organized and look professional.

---

## 🔁 Usage Flow

1. 🧑 Owner fills out and submits the service form  
2. 📥 Google Apps Script receives and processes the form  
3. 🧾 System:
   - Generates invoice number  
   - Updates database  
   - Fills invoice template  
   - Creates PDF invoice  
   - Sends it via email to customer
   - Logs the transaction  

4. 🧑‍💼 Admin can:
   - View all records
   - Access stored PDFs
   - Monitor activity logs
  
---

## ✨ Features

- Fully automated, end-to-end flow
- Clean and professional PDF invoices
- Searchable, timestamped records
- Customizable form, email, and templates
- Minimal setup and easy to maintain

---


## 📬 Get Started

> **Note**: You’ll need a Google account and access to Google Sheets to deploy the backend components.

1. Clone the repository
2. Deploy the Apps Script backend in your Google sheets project (Google Sheets Backend Setup Step 1)
3. Link the frontend form to your Apps Script URL (Google Sheets Backend Setup Step 3 & 4)
4. Customize invoice template and email settings (Invoice sheet setup)
5. Start accepting customer requests!

---
## 🗂️ Google Sheets Backend Setup

1. **Create a New Google Apps Script Project**
   - Open your Google Sheet
   - Go to **Extensions → Apps Script**
   - Replace the default code with your `appscripts.gs` file

2. **Set Up Trigger for Invoice Number Updates**
   - In the Apps Script editor, go to **Triggers (⏰ icon)**  
   - Add a new **Time-based trigger** for the function: `updateinvoicenum`  
   - Choose a suitable frequency 

3. **Deploy the Script as a Web App**
   - In Apps Script, click **Deploy → Manage deployments → New deployment**
   - Select **Web App**
   - Set access to **Anyone** (or anyone with the link)
   - Click **Deploy** and copy the URL

4. **Configure Your Frontend**
   - Paste the Web App URL into your `.env` file so the frontend knows where to send form data

---

## 🧾 Invoice Sheet Setup

1. **Create Your Custom Invoice Template**
   - Design your invoice layout in a separate sheet (see example in the Demo section)
   - Include placeholders for customer details, service info, and total amount

2. **Set Invoice Number Range**
   - Locate the cell where your invoice number appears (e.g., `C21:D21`)
   - In the Apps Script, update the `INVOICE_NO_RANGE` variable to match that cell reference

3. **Link Dynamic Fields**
   - Make other fields (e.g., Name, Address, Email) dynamically pull from the `Records` and `Info` sheets
   - Use `=INDEX()` or `COUNTA` formulas to populate fields based on the current invoice number

> 📌 **Tip:** Keep your layout clean and print-ready — avoid merged cells outside the print range.

---

## 🎥 Demo

Watch the full walkthrough of the system in action:

<p align="center">
   
  <a href="https://www.youtube.com/watch?v=ClR6fcAHaEU" target="_blank">
    <img src="https://img.youtube.com/vi/ClR6fcAHaEU/hqdefault.jpg" alt="Watch Demo" width="700"/>
  </a>
</p>

> 📽️ Click the image above to view the demo on YouTube.

---



## 🔐 Environment Configuration

Before running the app, create a `.env` file in the project root to securely store your URL details.

```env
# .env
scriptUrl=https://script.google.com/...../exec

```

---

## 🤝 Contributions

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature`
5. Open a Pull Request

