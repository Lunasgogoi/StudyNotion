const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <title>OTP Verification Email</title>

  <style>
    body {
      background-color: #ffffff;
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.4;
      color: #333333;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }

    .logo {
      max-width: 200px;
      margin-bottom: 20px;
    }

    .message {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .body {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .highlight {
      font-weight: bold;
    }

    .support {
      font-size: 14px;
      color: #999999;
      margin-top: 20px;
    }
  </style>
</head>

<body>
  <div class="container">
    <a href="https://studynotion-edtech-project.vercel.app">
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="100"/>
    </a>

    <div class="message">OTP Verification Email</div>

    <div class="body">
      <p>Dear User,</p>

      <p>
        Thank you for registering with StudyNotion. To complete your registration,
        please use the following OTP (One-Time Password) to verify your account:
      </p>

      <h1 style="
          background:#f4f4f4;
          display:inline-block;
          padding:10px 20px;
          border-radius:8px;
          letter-spacing:3px;
          font-size:28px;
        ">
        ${otp}
      </h1>

<br/>

<a href="#" style="
  display:inline-block;
  padding:10px 20px;
  background:#4CAF50;
  color:white;
  text-decoration:none;
  border-radius:5px;
  margin-top:15px;
">
  Verify Account
</a>

      <p>
        This OTP is valid for <strong>5 minutes</strong>.  
        If you did not request this verification, please ignore this email.
      </p>

      <p>
        Once your account is verified, you will have full access to the platform and its features.
      </p>
    </div>

    <div class="support">
      If you have any questions or need assistance, please feel free to reach out to us at
      <a href="mailto:info@studynotion.com">info@studynotion.com</a>.
      We are here to help!
    </div>
  </div>
</body>

</html>`;
};


module.exports = otpTemplate;