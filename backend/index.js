const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({origin: '*'}));
app.use(express.static('../frontend/dist'));

const router = express.Router();

const host = 'dev.etsisi.da.upm.es'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const groupId = req.params.groupId;
        
        const dir = path.join(__dirname, 'uploads', groupId);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const files = fs.readdirSync(dir);
        if (files.length >= 2) {
            cb({ message: "No puedes subir más de 2 fotos" }, null);
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

app.use(express.static('../frontend/dist'));

// Create a group

router.post('/group', (req, res) => {
    const groupId = req.body.name;
    const dir = path.join(__dirname, 'uploads', groupId);

    console.log(__dirname + 'uploads' + groupId);

    if (fs.existsSync(dir)) {
        return res.status(400).json({ message: 'Group already exists' });
    }

    fs.mkdirSync(dir, { recursive: true });

    const commentsDir = path.join(__dirname, 'comments', groupId);
    
    fs.mkdirSync(commentsDir, { recursive: true });

    return res.json({ message: 'Group created successfully' });
});

// Delete a group

router.delete('/group/:groupId', (req, res) => {
    const groupId = req.params.groupId;
    const dir = path.join(__dirname, 'uploads', groupId);
    const commentsDir = path.join(__dirname, 'comments', groupId);

    if (!fs.existsSync(dir)) {
        return res.status(400).json({ message: 'Group does not exist' });
    }

    fs.rmdirSync(dir, { recursive: true });

    fs.rmdirSync(commentsDir, { recursive: true });

    return res.json({ message: 'Group deleted successfully' });
});

// Get all files on a Group

router.get('/files/:groupId', (req, res) => {
    const groupId = req.params.groupId;
    const dir = path.join(__dirname, 'uploads', groupId);
    const commentsDir = path.join(__dirname, 'comments', groupId);

    fs.readdir(dir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }

        const fileList = files.map(file => {

            const comments = getComments(commentsDir, file);

            return {
                id: file,
                name: file,
                url: `https://${host}/uploads/${groupId}/${file}`,
                felicitaciones: comments.felicitaciones,
                sugerencias: comments.sugerencias
            };
        });

        res.json(fileList);
    });
})

// Get if a group exists

router.get('/group/:groupId', (req, res) => {
    console.log("Group ID: ", req.params.groupId);
    const groupId = req.params.groupId;
    const dir = path.join(__dirname, 'uploads', groupId);

    if (!fs.existsSync(dir)) {
        return res.status(400).json({ message: 'Group does not exist' });
    }

    return res.json({ message: 'Group exists' });
});

// Get all groups

router.get('/groups', (req, res) => {
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

// Save comments

function saveComments(comments, dir, fileName) {
    fileName = fileName.split('.')[0];
    fileName = fileName + '.json';

    const commentsFile = path.join(dir, fileName);
    fs.writeFileSync(commentsFile, JSON.stringify(comments));
}

getComments = (dir, fileName) => {
    fileName = fileName.split('.')[0];
    fileName = fileName + '.json';

    const commentsFile = path.join(dir, fileName);
    const data = fs.readFileSync(commentsFile);
    return JSON.parse(data);
}

// Upload a file to a group

router.post('/upload/:groupId', upload.single('image'), (req, res) => {
    const baseCommentsDir = path.join(__dirname, 'comments');

    if (!fs.existsSync(baseCommentsDir)) {
        fs.mkdirSync(commentsDir, { recursive: true });
    }

    const groupCommentsDir = path.join(baseCommentsDir, req.params.groupId);

    if (!fs.existsSync(groupCommentsDir)) {
        fs.mkdirSync(groupCommentsDir, { recursive: true });
    }

    const comments = { felicitaciones: req.body.felicitaciones, sugerencias: req.body.sugerencias };

    saveComments(comments, groupCommentsDir, req.file.filename);

    res.status(200).json({ message: 'File uploaded successfully', filePath: req.file.path });
});

// Delete a file from a group

router.delete('/file/:groupId/:fileName', (req, res) => {
    const groupId = req.params.groupId;
    const fileName = req.params.fileName;
    const dir = path.join(__dirname, 'uploads', groupId, fileName);
    const commentFileName = fileName.split('.')[0] + '.json';
    const commentsDir = path.join(__dirname, 'comments', groupId, commentFileName);

    if (!fs.existsSync(dir)) {
        return res.status(400).send({ error: "Error", message: 'File does not exist' });
    }

    fs.unlinkSync(dir);
    fs.unlinkSync(commentsDir);

    return res.status(200).json({ message: 'File deleted successfully' });
});

// Welcome message

router.get('/', (req, res) => {
    return res.json({ message: 'Welcome to the file upload API' });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', router);

app.use('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dist/index.html')));

// Serve API on port 3000

app.listen(8080, () => {
  console.log('Server started on http://localhost:8080');
});