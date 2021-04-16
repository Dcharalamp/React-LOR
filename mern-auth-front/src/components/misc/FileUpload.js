import Axios from "axios";
import React, {useState} from "react";



export default function FileUpload() {
    //set the states
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState();




const selectFile = (e) => {
    setSelectedFiles(e.target.files);
};


const upload = async () => {
  let currentFile = selectedFiles[0];
  setProgress(0);
  setCurrentFile(currentFile);
  
  try{
    
  const res = await Axios.post("http://localhost:5000/ont/ontologySubmit", currentFile , {
    headers : {
      'Content-Type': 'application/json'
    }
    
  });
  console.log(res.data);
  setProgress(100);
  setMessage("Upload successful!");
}
 catch(err){
    err.response.data.msg && setError(err.response.data.msg);
    setMessage("error, upload failed.");
    setProgress(0);
    setCurrentFile(undefined);
}
setSelectedFiles(undefined);  //once upload is complete,we update state to prepare for the next upload
};
return (
    <div>
      {currentFile && (
        <div className="progress">
          <div
            className="progress-bar progress-bar-info progress-bar-striped"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      )}

      <label className="btn btn-default">
        <input type="file" accept=".json" onChange={selectFile} />
      </label>

      <button
        className="btn btn-success"
        disabled={!selectedFiles}
        onClick={upload}
      >
        Upload
      </button>

      <div className="alert alert-light" role="alert">
        {message}
      </div>

      
    </div>
  );

}