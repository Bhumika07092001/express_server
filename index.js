const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');


// Middleware for file uploads
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let uploadedFile = req.files.uploadedFile;
    
    let uploadPath = __dirname + '/uploads/' + uploadedFile.name;

    // Move the file to the server
    uploadedFile.mv(uploadPath, (err) => {
        if (err) {
            console.log('erorr in server side :',err);
            return res.status(500).send(err);
        }

        res.send('File uploaded!');
    });
});

app.get('/download/:filename', (req, res) => {
    const fileName = req.params.filename;
    console.log('fileName:',fileName);
    const filePath = __dirname + '/uploads/' + fileName;
    console.log('filepath:', filePath);

    // Send the file to the client
    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('Error downloading fileee:', err);
            res.status(500).send('Error downloading file');
        }
    });
});


// Serve HTML file
app.get('/', (req, res) => {
    res.render('index');
});
app.set('views', './views');

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

