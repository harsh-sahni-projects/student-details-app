const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');

const DB_ENDPOINT = 'mongodb://localhost:27017';
const DB_NAME = 'students';
const COLL_NAME = 'students';
const FRONTEND_APP_URL = 'http://localhost:5173'

const client = new MongoClient(DB_ENDPOINT);

app.use(express.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', FRONTEND_APP_URL);
	res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.post('/loadStudentDetails', async (req, res) => {    
    try {
        const { pageNo, pageSize, filters } = req.body;

        if (!pageNo) return res.status(400).send('Parameter "pageNo" is missing');
        if (!pageSize) return res.status(400).send('Parameter "pageSize" is missing');

        const coll = await _getDbCollection();
        const query = _getDbQuery(filters);
        
        const docsToSkip = (pageNo-1) * pageSize;
        const result = await coll.find(query).skip(docsToSkip).limit(pageSize).toArray();

        client.close();
        res.send(result);
    } catch (err) {
        console.log(err);
        client.close();
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => {
	console.log('Server running on 3000');
})

async function _getDbCollection() {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect();
            const db = client.db(DB_NAME);
            const coll = db.collection(COLL_NAME);
            resolve(coll);
        } catch (err) {
            reject(err);
        }
    })
}

function _getDbQuery(filters) {
    let query = {};
    if (filters.names && filters.names.length) {
        query['name'] = {
            $in: filters.names
        }
    }
    if (filters.minMarks) {
        query['totalMarks'] = {
            $gte: filters.minMarks
        }
    }
    if (filters.maxMarks) {
        if (!query.totalMarks) query.totalMarks = {};
        query['totalMarks']['$lte'] = filters.maxMarks
    }
    if (filters.minAge) {
        query['age'] = {
            $gte: filters.minAge
        }
    }
    if (filters.maxAge) {
        if (!query.age) query.age = {};
        query['age'] = {
            $lte: filters.maxAge
        }
    }
    return query;
}



// --- I MADE & RAN THE FOLLOWING FUNCTION TO ADD DUMMY DATA IN MONGODB ---

// addDummyStudentDetailsInMongoDB();
//
// async function addDummyStudentDetailsInMongoDB() {
//     try {
//         const studentsCount = 100;
//         const studentDetails = [];
        
//         for (let i=1; i<=studentsCount; i++) {
//             let student = {
//                 id: i,
//                 name: 'student' + i,
//                 totalMarks: Math.floor(Math.random()*100),
//                 age: 10 + Math.floor(Math.random()*10)
//             }
//             studentDetails.push(student);
//         }

//         const coll = await _getDbCollection();
//         let res = await coll.insertMany(studentDetails)
//         console.log(res);
//         client.close();
//     } catch(err) {
//         console.log(err);
//         client.close();
//     }
// }