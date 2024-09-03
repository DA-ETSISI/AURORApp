const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

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

// Serve uploaded files

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create a group

app.post('/group', (req, res) => {
    const groupId = req.body.name;
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

// Get all files on a Group

app.get('/files/:groupId', (req, res) => {
    const groupId = req.params.groupId;
    const dir = path.join(__dirname, 'uploads', groupId);

    fs.readdir(dir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }

        const fileList = files.map(file => {
            return {
                id: file,
                name: file,
                url: `http://localhost:8080/uploads/${groupId}/${file}`
            };
        });

        res.json(fileList);
    });
})

// Get if a group exists

app.get('/group/:groupId', (req, res) => {
    console.log("Group ID: ", req.params.groupId);
    const groupId = req.params.groupId;
    const dir = path.join(__dirname, 'uploads', groupId);

    if (!fs.existsSync(dir)) {
        return res.status(400).json({ message: 'Group does not exist' });
    }

    return res.json({ message: 'Group exists' });
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
    console.log(req.file);
    res.status(200).json({ message: 'File uploaded successfully', filePath: req.file.path });
});

// Delete a file from a group

app.delete('/file/:groupId/:fileName', (req, res) => {
    const groupId = req.params.groupId;
    const fileName = req.params.fileName;
    const dir = path.join(__dirname, 'uploads', groupId, fileName);

    if (!fs.existsSync(dir)) {
        return res.status(400).send({ error: "Error", message: 'File does not exist' });
    }

    fs.unlinkSync(dir);

    return res.status(200).json({ message: 'File deleted successfully' });
});

// Welcome message

app.get('/', (req, res) => {
    return res.json({ message: 'Welcome to the file upload API' });
});

// Serve API on port 3000

app.listen(8080, () => {
  console.log('Server started on http://localhost:8080');
});