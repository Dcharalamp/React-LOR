import React, {useEffect, useState, useContext} from "react";
import {useHistory} from "react-router-dom";
import UserContext from "../../context/UserContext";
import axios from 'axios';
import * as f from "react-bootstrap";


import "../../style.css";



export default function Testing() {
    //set states
    const [posts, setPosts] = useState([]); //all the existing data in DB, used mainly for inits
    const [loading, setLoading] = useState(false); //default to false, we mannually change it when fetching data
    const [currentPage, setCurrentPage] = useState(1); //current page showing, default at 1st page
    const [postsPerPage, setPostsPerPage] = useState(5); //10 samples per page 
    const [postToBeRemoved, setPostToBeRemoved] = useState(''); //for header purposes on delete
    const [keyword, setKeyword] = useState();
    const [postsNotDefault, setPostsNotDefault] = useState([]); //commonly updated to suit every feature's needs
    const [show, setShow] = useState(false);//for alert window to show/hide
    const [showUpdate, setShowUpdate] = useState(true); //state for showing submit button for editing purposes
    //these are the temp states for the update feature
    const [tempTitle, setTempTitle] = useState('');
    const [tempDescription, setTempDescription] = useState('');
    const [tempIdentifier, setTempIdentifier] = useState('');
    const [tempKeyword, setTempKeyword] = useState('');
    const [error, setError] = useState(); //error handling

    //stylings
    const BarStyling = {width:"180px",background:"#F2F1F9", border:"none", padding:"0.3rem"};//styling for searchBar
    const OptionStyling = {width: "20px"};
    const loadingStyle={color: "white"};
    const columnStyling = {height: "50px"};

    
    
    useEffect(() => {
        const fetchPosts = async () => {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/ont/ontologyList'); //get all ontologies
        setPosts(res.data); //update state
        setPostsNotDefault(res.data); //update this state too, if searchbar is empty: posts=postsNonDefault
        setLoading(false);
        };

        fetchPosts();
    }, []); //no dependencies, otherwise we'll be in an endless loop
    console.log(posts); //not actually necessary, for testing/debugging purposes

    //get indexes and current posts shown
    const indexOfLastPost = currentPage * postsPerPage; //index of last ontology entry shown
    const indexOfFirstPost = indexOfLastPost - postsPerPage; //index of first ontology entry shown
    let currentPosts = postsNotDefault.slice(indexOfFirstPost, indexOfLastPost); //current posts shown, sliced between 1st and last index
    


    const pageNumber = []; 
    for(let i=1; i<= Math.ceil(postsNotDefault.length/postsPerPage); i++){ //we round up the division
        pageNumber.push(i); //this determines how many pages of items will be 
    }

    //change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    

    const DeleteOnt = async () => {

        const res = await axios.delete("http://localhost:5000/ont/ontologyRemove/", {
            params: { _id: postToBeRemoved }, headers:{ "to-be-removed" : postToBeRemoved}});

        const postsLeft = posts.filter(item => item._id !== postToBeRemoved);
        console.log(postsLeft);
        setPosts(postsLeft);
        //the next happens so delete can concurrently work with sort+search and render the correct things
        const postsLeftToShown = postsNotDefault.filter(item => item._id !== postToBeRemoved); 
        setPostsNotDefault(postsLeftToShown); //update state
        setCurrentPage(1); //redirect to first page again
        setShow(false); //close alert window
        setPostToBeRemoved(''); //delete the stored _id

    };

    const [idisSearching, setIdisSearching] = useState(false); //flag for double search
    const [keywordisSearching, setKeywordisSearching] = useState(false);//flag for double search
    const [doubleSearch,setDoubleSearch] = useState([]); //results for double searching criteria
    const [keywordRes,setKeywordRes] = useState([]); //states for 2->1  searching critiria handling
    const [idRes,setIdRes] = useState([]);
    

    const updateInput = async (input) => {
        
        if(input){
            setKeywordisSearching(true);
            if(!idisSearching) { //nothing on ID searchBar
            const filtered = posts.filter(post => { //filter posts based on input of searchbar
             return post.keyword.toLowerCase().includes(input.toLowerCase()) //works for all typos, upper/lower case, all converted
            })
            setKeywordRes(filtered);
            setDoubleSearch(filtered); //for the double searching case
            setPostsNotDefault(filtered); //update state  
            setCurrentPage(1); //we go back to 1st page to prevent bad UI misconseptions
            } else {
                const filtered = doubleSearch.filter(post => { //filter posts based on input of searchbar
                    return post.keyword.toLowerCase().includes(input.toLowerCase()) //works for all typos, upper/lower case, all converted
                })
                setPostsNotDefault(filtered);
                
                
            }
            }
            else{
                setKeywordisSearching(false);
                if(!idisSearching){
                setPostsNotDefault(posts); //if empty, that means postsNotDefault=posts
                }else{
                    setPostsNotDefault(idRes);
                }
            }
         }

     const updateInput2 = async (input) => {
        if(input){
        setIdisSearching(true);
        if(!keywordisSearching) { //nothing on keword searchBar
        const filtered = posts.filter(post => { //filter posts based on input of searchbar
         return post.id.toLowerCase().includes(input.toLowerCase()) //works for all typos, upper/lower case, all converted
        })
        setIdRes(filtered);
        setDoubleSearch(filtered); //for the double searching case
        setPostsNotDefault(filtered); //update state
        
        setCurrentPage(1); //we go back to 1st page to prevent bad UI misconseptions
        } else {
            const filtered = doubleSearch.filter(post => { //filter posts based on input of searchbar
                return post.id.toLowerCase().includes(input.toLowerCase()) //works for all typos, upper/lower case, all converted
            })
            
            setPostsNotDefault(filtered);
            
            
        }
        }
        else{
            setIdisSearching(false);
            if(!keywordisSearching){
            setPostsNotDefault(posts); //if empty, that means postsNotDefault=posts
            }else{
                setPostsNotDefault(keywordRes);
            }
        }
     }
  
   
       
    
    //if you're not logged in, home page automatically redirects you to login page
    const {userData} = useContext(UserContext);
    const history = useHistory();
    
    useEffect(() => { //if there's not a user logged in, redirect to login page 
        if(!userData.user) history.push("/login");
    },);//now we dont even have depend param(the []), because when u log out, it doesnt redirect u to log in page. Now it does
    
    const OpenAlert = async (_id) => { //opens alert window and updates state for deletion
        setShow(true);
        setPostToBeRemoved(_id);
        window.scrollTo(0, 0) 
    }

    const UpdatePreperations = () => { //when gear button is clicked, table becomes editable and submit button shows up
        setShowUpdate(false);
    }

    const UpdateOntology = async (e, id) => {
        try{
            const updatedOntology = {id, tempTitle, tempDescription, tempIdentifier, tempKeyword}; //not needed
            const res = await axios.put("http://localhost:5000/ont/ontologyUpdate/", 
                {
                    id: id,
                    title: tempTitle,
                    description: tempDescription,
                    identifier: tempIdentifier,
                    keyword: tempKeyword

                }, );
            //we hide again both input fields and submit button
            setShowUpdate(true); 
            setCurrentPage(1); //redirect to 1st page
        } 
        catch(err) { //if there's an error we catch it
        err.response.data.msg && setError(err.response.data.msg); //if both are true, error state is update with the error message that shows up
    }
        
    }

    //BEWARE, BOTH SORTINGS ARE CASE SENSITIVE
    const sortDataAsc = async (field) => {
        console.log(field);
        const types = {
            id: 'id',
            keyword: 'keyword'
          };
          const sortProperty = types[field];
          console.log(sortProperty);
        const sorted = [...postsNotDefault].sort(function(a,b){
        if(a[sortProperty] < b[sortProperty]) { return -1; }
        if(a[sortProperty] > b[sortProperty]) { return 1; }
        });
        setPostsNotDefault(sorted);
    }
   
    const sortDataDesc = async (field) => {
        console.log(field);
        const types = { 
            id: 'id',
            keyword: 'keyword'   
          };
          const sortProperty = types[field];
          console.log(sortProperty);
        const sorted = [...postsNotDefault].sort(function(a,b){
        if(a[sortProperty] < b[sortProperty]) { return 1; }
        if(a[sortProperty] > b[sortProperty]) { return -1; }
        });
        setPostsNotDefault(sorted);
    }
    
    function ShowMore({ children, maxCharacterCount = 100}) { //truncating description
        const text = children;
        const [isTruncated,setIsTruncated] = useState(true);
        //if isTruncated is true, we slice, otherwise we show the full string
        const resultString = isTruncated? text.slice(0,100) : text; //breakpoint is at 100 characters

        function toggleIsTruncated(){
            //update state with the opposite boolean, so we can have correct toggle
            setIsTruncated(!isTruncated);
        }


        if(text.length > 100){
        return (
            <p>
                {resultString}
                <br></br> {/*line break for CSS reasons */}
                <span onClick={toggleIsTruncated} className="truncated">
                    {isTruncated ? "Show more" : "Show less"}
                </span>
            </p>

        );
        } else {
            return (
                <p>{text}</p>
            );
        }
    }
    



    
    if(loading){
        return <h2 style={loadingStyle}>Loading...</h2>;
    } //if fetching data is not completed, loading title shows up until it's done
    
    
    
    return (
         
        <div className="MainPage">
            
            <f.Alert show={show} variant="danger" onClose={() => setShow(false)} dismissible> {/*Show alert when some1 tries to delete */}
        <f.Alert.Heading>Warning!</f.Alert.Heading>
        <p>
          Are you sure you want to delete this Ontology? This action is not reversable.
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <f.Button onClick={() => DeleteOnt()} variant="outline-success">
            Delete Ontology
          </f.Button>
        </div>
      </f.Alert> 
    
            <h1 className="text-primary mb-3">Ontology List</h1>
            <f.Table table table-bordered table-hover table-sm responsive > 
            
            <thead>
                <tr>
                    <th scope="col" >id     
                        <button className="sorting_buttons"><i class="fa fa-sort-desc" onClick={(e) =>sortDataAsc('id')}></i></button>
                        <button className="sorting_buttons"><i class="fa fa-sort-asc" onClick={(e) => sortDataDesc('id')}></i></button></th>
                    <th scope="col" >title</th>
                    <th scope="col" >description</th>
                    <th scope="col" >identifier</th>
                    <th scope="col" style={columnStyling}>keyword
                        <div className="box">
                        <button className="sorting_buttons"><i class="fa fa-sort-desc" onClick={(e) =>sortDataAsc('keyword')}></i></button>
                        <button className="sorting_buttons"><i class="fa fa-sort-asc" onClick={(e) => sortDataDesc('keyword')}></i></button></div></th>
                        
                    <th scope="col" style={OptionStyling}>options</th>           
                </tr>
            </thead>
            <tbody>
                <tr>
                <input style={BarStyling} key="random2" value={keyword} placeholder={"search ID"} onChange={(e) => updateInput2(e.target.value)}/>
                <th></th>
                <th></th>
                <th></th>
                <input style={BarStyling} key="random1" value={keyword} placeholder={"search keyword"} onChange={(e) => updateInput(e.target.value)}/>
                </tr> 
            {currentPosts.map(post => (
                <tr> {/*display the fetched data in corresponding table position */}
                    <td >{post.id}</td> {/*ID doesnt get editable, cuz its a unique param and doesnt change */}
                    <td><input type="text" hidden={showUpdate} onChange={(e) => setTempTitle(e.target.value)} />{post.title}</td>
                    <td><input type="text" hidden={showUpdate} onChange={(e) => setTempDescription(e.target.value)} /><ShowMore>{post.description}</ShowMore></td>
                    <td><input type="text" hidden={showUpdate} onChange={(e) => setTempIdentifier(e.target.value)} /><a href={post.identifier} target="_blank"  rel="noopener noreferrer">{post.identifier}</a></td>
                    <td><input type="text" hidden={showUpdate} onChange={(e) => setTempKeyword(e.target.value)} />{post.keyword}</td>
                    <td style={OptionStyling}>
                        <div className="options">
                        <button class="btn" onClick={(e) => OpenAlert(post._id)}><i class="fa fa-trash"></i></button>{/*needs center alignment. Opens alert popup window */}
                        <button class="btn" ><i class="fa fa-gear" onClick={(e) => UpdatePreperations()} ></i></button> {/*show input fields and submit button */}
                        <button class="btn" hidden={showUpdate} onClick={(e) => UpdateOntology(e, post.id)}>Submit</button> {/*This button will only show when we editing something*/}
                        </div>
                    </td> 
                </tr>
                ))}
            </tbody>
            
          
        </f.Table>
        <nav className="endPage">
            <ul className="pagination">
                <li className="page-item ">
                    <a onClick={() => paginate(1)} className="page-link" tabIndex="1" href="#">{"<<"}</a></li> {/*redirect to first page*/}
                {pageNumber.map(PageNumber =>(
                    <li key={PageNumber} className="page-item " >
                        <a onClick={() => paginate(PageNumber)} class="page-link " tabIndex="1" href="#" >
                            {PageNumber}
                        </a>
                    </li>
                ))}
                <li className="page-item">
                    <a onClick={() => paginate(pageNumber.length)} className="page-link" tabIndex="1" href="#">{">>"}</a></li> {/*redirect to last page*/}

            </ul> 
        </nav>
             <button type="button" class="btn btn-secondary" onClick={() => { history.push('/ontregister') }}>Add new ontology</button>
             <div className="test">
             <f.Dropdown> {/*User dynamically changes how many posts shown per page */}
  <f.Dropdown.Toggle variant="success" id="dropdown-basic" >
    {postsPerPage}
  </f.Dropdown.Toggle>

  <f.Dropdown.Menu >
    <f.Dropdown.Item onClick={() => { setPostsPerPage(5); setCurrentPage(1);}}>5</f.Dropdown.Item>
    <f.Dropdown.Item onClick={() => { setPostsPerPage(10); setCurrentPage(1);}} >10</f.Dropdown.Item>
    <f.Dropdown.Item onClick={() => { setPostsPerPage(20); setCurrentPage(1);}}>20</f.Dropdown.Item>
  </f.Dropdown.Menu>
</f.Dropdown>
</div>
        </div>
    )
    
}