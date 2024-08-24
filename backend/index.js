const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());

// Configure multer storage settings

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const groupId = req.params.groupId;
        
        const dir = path.join(__dirname, 'uploads', groupId);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Create a unique filename using the current timestamp and original file name
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});


const upload = multer({ storage: storage });

// Create a group

app.post('/group', (req, res) => {
    const groupId = req.body.groupId;
    const dir = path.join(__dirname, 'uploads', groupId);

    if (fs.existsSync(dir)) {
        return res.status(400).json({ message: 'Group already exists' });
    }

    fs.mkdirSync(dir, { recursive: true });

    return res.json({ message: 'Group created successfully' });
});

// Delete a group

app.delete('/group/:groupId', (req, res) => {
    const groupId = req.params.groupId;
    const dir = path.join(__dirname, 'uploads', groupId);

    if (!fs.existsSync(dir)) {
        return res.status(400).json({ message: 'Group does not exist' });
    }

    fs.rmdirSync(dir, { recursive: true });

    return res.json({ message: 'Group deleted successfully' });
});

// Get all groups

app.get('/groups', (req, res) => {
    const dir = path.join(__dirname, 'uploads');

    fs.readdir(dir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }

        const groupList = files.map(group => {
            return {
                name: group
            };
        });

        return res.json(groupList);
    });
});

// Upload a file to a group

app.post('/upload/:groupId', upload.single('image'), (req, res) => {
    res.json({ message: 'File uploaded successfully', filePath: req.file.path });
});

// Get all files in a group

app.get('/files/:groupId', (req, res) => {
    const groupId = req.params.groupId;
    const dir = path.join(__dirname, 'uploads', groupId);

    fs.readdir(dir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }

        const fileList = files.map(file => {
            return {
                name: file,
                url: `http://localhost:3000/uploads/${groupId}/${file}`
            };
        });

        res.json(fileList);
    });
});

// Welcome message

app.get('/', (req, res) => {
    return res.json({ message: 'Welcome to the file upload API' });
});

// Serve API on port 3000

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});