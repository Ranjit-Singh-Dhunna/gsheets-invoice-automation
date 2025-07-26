 require('dotenv').config();
 const scriptUrl = process.env.scriptUrl;

                document.forms['contactForm'].addEventListener('submit', async (e) => {
                    e.preventDefault(); 
                    const formData = new FormData(e.target);

                    try {
                    const response = await fetch(scriptUrl, {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.text();
                    

                    } catch (error) {
                    alert('Error: ' + error);
                    }
                });
