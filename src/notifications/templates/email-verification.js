function emailVerificationTemplate(userDetails) {
  const { username, verificationLink } = userDetails;
  const year = new Date().getFullYear();
  return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  padding-bottom: 20px;
              }
              .header h1 {
                  color: #333;
              }
              .content {
                  margin-bottom: 20px;
                  text-align: center;
              }
              .content h2 {
                  color: #333;
                  margin-bottom: 10px;
              }
              .button {
                  display: inline-block;
                  padding: 12px 24px;
                  color: #fff;
                  background-color: #4CAF50;
                  border-radius: 5px;
                  text-decoration: none;
                  font-weight: bold;
              }
              .footer {
                  text-align: center;
                  padding: 10px;
                  font-size: 12px;
                  color: #777;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Welcome to Connectify!</h1>
              </div>
  
              <div class="content">
                  <h2>Hello ${username},</h2>
                  <p>Thank you for signing up with Connectify! Please verify your email address to complete your registration.</p>
                  
                  <a href="${verificationLink}" class="button">Verify Your Email</a>
  
                  <p>If the button above doesn’t work, please copy and paste the following link into your browser:</p>
                  <p>${verificationLink}</p>
              </div>
  
              <div class="footer">
                  <p>Thanks for joining Connectify!</p>
                  <p>&copy; ${year} Connectify. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;
}

module.exports = emailVerificationTemplate;
