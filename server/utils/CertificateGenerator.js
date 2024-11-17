const puppeteer = require('puppeteer');
const path = require('path');

async function generateCertificate(userName, courseTitle, completionDate) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate of Completion</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Great+Vibes&family=Lora:wght@400;500;600&display=swap');
          
          body {
            margin: 0;
            padding: 0;
            background: #f9f6f0;
          }

          .certificate {
            width: 1100px;
            height: 800px;
            padding: 20px;
            text-align: center;
            position: relative;
            background: #f9f6f0;
            margin: 0 auto;
          }

          /* Diagonal Corners */
          .corner-top-left,
          .corner-bottom-right {
            position: absolute;
            width: 300px;
            height: 300px;
            background: #1a1a1a;
            z-index: 1;
          }

          .corner-top-left {
            top: 0;
            left: 0;
            clip-path: polygon(0 0, 0% 100%, 100% 0);
          }

          .corner-bottom-right {
            bottom: 0;
            right: 0;
            clip-path: polygon(100% 100%, 0% 100%, 100% 0);
          }

          /* Gold Accents */
          .gold-accent-top,
          .gold-accent-bottom {
            position: absolute;
            width: 300px;
            height: 300px;
            background: #d4af37;
            z-index: 2;
          }

          .gold-accent-top {
            top: 0;
            left: 0;
            clip-path: polygon(0 0, 0% 80%, 80% 0);
          }

          .gold-accent-bottom {
            bottom: 0;
            right: 0;
            clip-path: polygon(100% 100%, 20% 100%, 100% 20%);
          }

          /* Border Frame */
          .border-frame {
            position: absolute;
            top: 40px;
            left: 40px;
            right: 40px;
            bottom: 40px;
            border: 2px solid #1a1a1a;
          }

          /* Content */
          .content {
            position: relative;
            z-index: 3;
            padding: 60px;
            height: calc(100% - 120px);
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .title {
            font-family: 'Playfair Display', serif;
            font-size: 48px;
            color: #1a1a1a;
            margin-bottom: 10px;
            letter-spacing: 4px;
          }

          .subtitle {
            font-family: 'Lora', serif;
            font-size: 24px;
            color: #1a1a1a;
            margin-bottom: 40px;
            letter-spacing: 2px;
          }

          .presented-to {
            font-family: 'Lora', serif;
            font-size: 20px;
            color: #1a1a1a;
            margin-bottom: 20px;
          }

          .name {
            font-family: 'Great Vibes', cursive;
            font-size: 64px;
            color: #1a1a1a;
            margin-bottom: 30px;
            line-height: 1;
          }

          .course-info {
            font-family: 'Lora', serif;
            font-size: 24px;
            color: #1a1a1a;
            margin-bottom: 20px;
            line-height: 1.6;
          }

          .course-title {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-weight: 700;
            color: #1a1a1a;
            margin: 10px 0 30px;
          }

          .date {
            font-family: 'Lora', serif;
            font-size: 20px;
            color: #1a1a1a;
            margin-bottom: 40px;
          }

          /* Seal */
          .seal {
            width: 120px;
            height: 120px;
            margin: 0 auto 40px;
            position: relative;
          }

          .seal::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background: #d4af37;
            border-radius: 50%;
            left: 0;
            top: 0;
          }

          .seal::after {
            content: '';
            position: absolute;
            width: 80%;
            height: 80%;
            border: 2px solid #f9f6f0;
            border-radius: 50%;
            left: 10%;
            top: 10%;
          }

          /* Signature Section */
          .signature {
            position: absolute;
            bottom: 110px;
            right: 130px;
            text-align: center;
          }

          .signature-name {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 5px;
          }

          .signature-title {
            font-family: 'Lora', serif;
            font-style: italic;
            font-size: 18px;
            color: #1a1a1a;
          }

          .signature-line {
            width: 200px;
            height: 2px;
            background: #1a1a1a;
            margin: 10px auto;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="corner-top-left"></div>
          <div class="corner-bottom-right"></div>
          <div class="gold-accent-top"></div>
          <div class="gold-accent-bottom"></div>
          <div class="border-frame"></div>
          
          <div class="content">
            <div class="title">CERTIFICATE</div>
            <div class="subtitle">OF COMPLETION</div>
            
            <div class="presented-to">This Is Presented To</div>
            <div class="name">${userName}</div>
            
            <div class="course-info">for successfully completing the course </div>
            <div class="course-title">${courseTitle}</div>
            
            <div class="date">${completionDate}</div>
            
            <div class="seal"></div>
            
            <div class="signature">
              <img src="https://res.cloudinary.com/dgosdgcem/image/upload/v1731006398/certificate%20utils/jlvonsehocdkl2lb8fpi.png" alt="Signature" style="width: 200px;">
              <div class="signature-line"></div>
              <div class="signature-name">BARRY ALLEN</div>
              <div class="signature-title">Educational Officer</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent);
    
    // Set viewport and PDF options to match design
    await page.setViewport({ width: 1100, height: 800 });
    
    const certificatePath = path.join(__dirname, '../../server/certificates', `${userName}_${courseTitle}_certificate.pdf`);
    await page.pdf({
      path: certificatePath,
      width: '1100px',
      height: '800px',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      },
      pageRanges: '1'
    });

    await browser.close();
    return certificatePath;
  } catch (err) {
    throw new Error('Error generating certificate: ' + err.message);
  }
}

module.exports = { generateCertificate };

// // Test the certificate generation
// generateCertificate(
//   "John Doe",
//   "PYTHON FULLSTACK COURSE",
//   "November 15, 2023"
// ).then(path => console.log('Certificate generated at:', path));