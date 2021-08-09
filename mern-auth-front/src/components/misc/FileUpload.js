import Axios from "axios";
import React, {useState} from "react";
import ErrorNotice from "../misc/ErrorNotice";



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
  setProgress(0);
  setCurrentFile(currentFile);
  const fileReader = new FileReader();
  fileReader.readAsText(selectedFiles[0], "UTF-8");
  fileReader.onload = async(e) => {
    const trueData = JSON.parse(e.target.result);  //convert text to JSON object
    console.log(trueData[1].title);

    for (let i = 0; i <trueData.length; i++) { //parse each object from the JSON file
      const id = trueData[i].id;
      const title = trueData[i].title;
      const description = trueData[i].description;
      const identifier = trueData[i].identifier;
      const keyword = trueData[i].keyword;

      const newOntology = {id, title, description, identifier, keyword}; 
      try{
        await Axios.post("http://localhost:5000/ont/ontologySubmit", newOntology);
        setProgress(100/trueData.length*(i+1));
        setMessage("Upload Successful!");
        

      }catch(err){
        err.response.data.msg && setError(err.response.data.msg);
    setMessage("error, upload failed.");
    setProgress(0);
    setCurrentFile(undefined);

      }
    }



  }
  
setSelectedFiles(undefined);  //once upload is complete,we update state to prepare for the next upload
};
return (
    <div>
      
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
      {error && <ErrorNotice message={error} clearError={() => setError(undefined)}/>}

      
    </div>
  );

}