import { useState } from 'react';
import axios from 'axios';
import './App.css'

const SERVER_ENDPOINT = 'http://localhost:3000/loadStudentDetails';

function App() {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [names, setNames] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [minMarks, setMinMarks] = useState('');
  const [maxMarks, setMaxMarks] = useState('');
  const [tableHtml, setTableHtml] = useState('');

  const renderResults = (results) => {
    if (results.length == 0) {
      setTableHtml('<p>No results, please check your inputs</p>');
      return;
    }
    let html = `
      <table>
        <thead>
          <th>Student ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Marks</th>
        </thead>
        <tbody>
    `;
    results.forEach(item => {
      html += `
        <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.age}</td>
          <td>${item.totalMarks}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
    setTableHtml(html);
  }

  const loadStudentDetails = async (e) => {
    try {
      e.preventDefault();
      setTableHtml('<p>Loading...</p>');
    
      const payload = {
        pageNo: parseInt(pageNo, 10),
        pageSize: parseInt(pageSize, 10),
        filters: {
          names: names.split(/\s+/g).filter(e => e),
          minMarks: parseInt(minMarks, 10),
          maxMarks: parseInt(maxMarks, 10),
          minAge: parseInt(minAge, 10),
          maxAge: parseInt(maxAge, 10)
        }
      }
      const res = await axios.post(SERVER_ENDPOINT, payload)
      console.log(res);
      renderResults(res.data);
    } catch (err) {
      setTableHtml(`<p>Error Occurred: ${err.message}</p>`);
      console.log(err);
    }
  }

  return (
    <>
      <h1>Student details</h1>
      <form>
        <label>Page No:</label><br/>
        <input
          type="number"
          id="pageNo"
          min="1"
          value={pageNo}
          onChange={e => setPageNo(e.target.value)}
        />
        <br/><br/>

        <label>Page Size:</label><br/>
        <input
          type="number"
          id="pageSize"
          min="1"
          value={pageSize}
          onChange={e => setPageSize(e.target.value)}
        />
        <br/><br/>

        <label>Student Names (space separated):</label><br/>
        <input
          type="text"
          id="name"
          name="name"
          value={names}
          onChange={e => setNames(e.target.value)}
        />
        <a href="" onClick={e => {e.preventDefault(); setNames('')}}>Clear</a>
        <br/><br/>

        <label>Age (Min & Max):</label><br/>
        <input
          type="number"
          id="minAge"
          min="1"
          max="100"
          value={minAge}
          placeholder="Add Min age here"
          onChange={e => setMinAge(e.target.value)}
        />
        <a href="" onClick={e => {e.preventDefault(); setMinAge('')}}>Clear</a>

        <input
          type="number"
          id="maxAge"
          min="1"
          max="100"
          placeholder="Add Max age here"
          onChange={e => setMaxAge(e.target.value)}
        />
        <a href="" onClick={e => {e.preventDefault(); setMaxAge('')}}>Clear</a>
        <br/><br/>

        <label>Marks (Min & Max):</label><br/>
        <input
          type="number"
          id="minMarks"
          min="0"
          max="100"
          placeholder="Add Min marks here"
          onChange={e => setMinMarks(e.target.value)}
        />
        <a href="" onClick={e => {e.preventDefault(); setMinMarks('')}}>Clear</a>
        
        <input
          type="number"
          id="maxMarks"
          min="1"
          max="100"
          placeholder="Add Max marks here"
          onChange={e => setMaxMarks(e.target.value)}
        />
        <a href="" onClick={e => {e.preventDefault(); setMinMarks('')}}>Clear</a>
        <br/><br/>

        <button onClick={loadStudentDetails}>Submit</button>
      </form>

      <hr/>
      <h2>Results:</h2>
      <div dangerouslySetInnerHTML={{__html: tableHtml}}>
      </div>
    </>
  )
}

export default App
