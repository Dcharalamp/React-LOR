import React, {useEffect, useState, useContext} from "react";
import {useHistory} from "react-router-dom";
import UserContext from "../../context/UserContext";
import ScrollButton from "../misc/ScrollButton";
import axios from 'axios';
import * as f from "react-bootstrap";
import Loader from "react-loader-spinner";

import "../../style.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default function GuestDashboard() {
    
    //set states
    const [posts, setPosts] = useState([]); //all the existing data in DB, used mainly for inits
    const [loading, setLoading] = useState(false); //default to false, we mannually change it when fetching data
    const [currentPage, setCurrentPage] = useState(1); //current page showing, default at 1st page
    const [postsPerPage, setPostsPerPage] = useState(5); //5 samples per page 
    const [keyword, setKeyword] = useState();
    const [postsNotDefault, setPostsNotDefault] = useState([]); //commonly updated to suit every feature's needs
    const [ext,setExt] = useState(''); //external API requests from Okeanos
    const [n,setN] = useState([]); //the results of the fetched API
    const [nn, setNN] = useState([]); //helper for searching
    const [p,setP] = useState(true); //state for toggling table
    const [loadingFetched,setLoadingFetched] = useState(false);
    //states for fetched data from Okeanos and pagination
    const [exCurrentPage, setExCurrentPage] = useState(1); 
    const [exPostsPerPage, setExPostsPerPage] = useState(5); 
    const exIndexOfLastPost = exCurrentPage * exPostsPerPage; 
    const exIndexOfFirstPost = exIndexOfLastPost - exPostsPerPage; 
    let exCurrentPosts = n.slice(exIndexOfFirstPost, exIndexOfLastPost); 
    const exPageNumber = []; 
    for(let i=1; i<= Math.ceil(n.length/exPostsPerPage); i++){ 
        exPageNumber.push(i); 
    }
    const exPaginate = (exPageNumber) => setExCurrentPage(exPageNumber);

    

    //stylings
    const BarStyling = {width:"180px",background:"#F2F1F9", border:"none", padding:"0.3rem"};//styling for searchBar
    const loadingStyle={color: "white"};
    const columnStyling = {height: "50px"};
  

    
    
    useEffect(() => {
        
        const fetchPosts = async () => {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/ont/ontologyList'); //get all objects
        setPosts(res.data); //update state
        setPostsNotDefault(res.data); //update this state too, if searchbar is empty: posts=postsNonDefault
        setLoading(false);
        };

        
        fetchPosts();
        
    }, []); //no dependencies, otherwise we'll be in an endless loop
    

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

    const [idisSearching, setIdisSearching] = useState(false); //flag for double search
    const [keywordisSearching, setKeywordisSearching] = useState(false);//flag for double search
    const [doubleSearch,setDoubleSearch] = useState([]); //results for double searching criteria
    const [keywordRes,setKeywordRes] = useState([]); //states for 2->1  searching critiria handling
    const [idRes,setIdRes] = useState([]);


    //states for 2->1 searching criteria for fetched data
    const [titleIsSearching, setTitleIsSearching] = useState(false); //flag for double search
    const [exKeywordisSearching, setExKeywordisSearching] = useState(false);//flag for double search
    const [exDoubleSearch,setExDoubleSearch] = useState([]); //results for double searching criteria
    const [exKeywordRes,setExKeywordRes] = useState([]); //states for 2->1  searching critiria handling
    const [titleRes,setTitleRes] = useState([]);
    


    const exUpdateInput = async (input) => { 
        
        if(input){
            setExKeywordisSearching(true);
            if(!titleIsSearching){ //nothing on title searchBar

            
            
            const filtered = nn.filter(post => { 
                 return post.keyword.toString().toLowerCase().includes(input.toLowerCase()) //works for all typos, upper/lower case, all converted
    
            })
            setExKeywordRes(filtered);
            setExDoubleSearch(filtered);
            setN(filtered); //update state  
            setExCurrentPage(1); //we go back to 1st page to prevent bad UI misconseptions
        }else{
            const filtered = exDoubleSearch.filter(post => { //filter posts based on input of searchbar
                    
    
                return post.keyword.toString().toLowerCase().includes(input.toLowerCase()) //works for all typos, upper/lower case, all converted
               
           })
           setN(filtered);
        }
        }
            else{  
                setExKeywordisSearching(false);
                if(!titleIsSearching){      
                    setN(nn); //no search, means show all objects
                }else{
                    setN(titleRes);
                }
            }
         }

         const exUpdateInput2 = async (input) => {
            if(input){
               setTitleIsSearching(true);
               if(!exKeywordisSearching){
                
                const filtered = nn.filter(post => { 
                     return post.title.toLowerCase().includes(input.toLowerCase()) //works for all typos, upper/lower case, all converted
        
                })
                setTitleRes(filtered);
                setExDoubleSearch(filtered);
                setN(filtered); //update state  
                setExCurrentPage(1); //we go back to 1st page to prevent bad UI misconseptions
            }else{
                const filtered = exDoubleSearch.filter(post => { //filter posts based on input of searchbar
                    return post.title.toLowerCase().includes(input.toLowerCase()) //works for all typos, upper/lower case, all converted
                })
                
                setN(filtered);
            }
                }
                else{ 
                    setTitleIsSearching(false);
                    if(!exKeywordisSearching){       
                    setN(nn); //no search, means show all objects
                    }else{
                        setN(exKeywordRes);
                    }
                    
                }
             }

    const updateInput = async (input) => {
        
        if(input){
            
            setKeywordisSearching(true);
            if(!idisSearching) { //nothing on ID searchBar
                
            const filtered = posts.filter(post => { //filter posts based on input of searchbar
                
                return post.keyword.toString().toLowerCase().includes(input.toLowerCase()) //toString otherwise error cuz of how keyword is built
         
            });
            
            
            setKeywordRes(filtered);
            setDoubleSearch(filtered); //for the double searching case
            setPostsNotDefault(filtered); //update state  
            setCurrentPage(1); //we go back to 1st page to prevent bad UI misconseptions
            } else {
                const filtered = doubleSearch.filter(post => { //filter posts based on input of searchbar
                    
    
                             return post.keyword.toString().toLowerCase().includes(input.toLowerCase()) //works for all typos, upper/lower case, all converted
                            
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

    const exSortDataAsc = async (field) => {
        console.log(field);
        const types = {
            id: 'id',
            keyword: 'keyword'
          };
          const sortProperty = types[field];
          console.log(sortProperty);
        const sorted = [...n].sort(function(a,b){
        if(a[sortProperty] < b[sortProperty]) { return -1; }
        if(a[sortProperty] > b[sortProperty]) { return 1; }
        });
        setN(sorted);
    }

    
   
    const exSortDataDesc = async (field) => {
        console.log(field);
        const types = { 
            id: 'id',
            keyword: 'keyword'   
          };
          const sortProperty = types[field];
          console.log(sortProperty);
        const sorted = [...n].sort(function(a,b){
        if(a[sortProperty] < b[sortProperty]) { return 1; }
        if(a[sortProperty] > b[sortProperty]) { return -1; }
        });
        setN(sorted);
    }


    let newposts = [];
    
    const DoSomething = async () => { //fetching data from external API 
        
        const url = `http://snf-630087.vm.okeanos.grnet.gr:8888/SemanticMiddleware-1.3/results?q=${ext}&validate=true`;
        setLoadingFetched(true);
        await fetch(url)
            .then(res => res.text())
            .then(data => {
                const newdata = data.replace(/<(\/?)([^:>\s]*:)?([^>]+)>/g, "<$1$3>");
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(newdata,"text/xml");
                
                const base = xmlDoc.getElementsByTagName("NamedIndividual");
                for (let i = 0; i< base.length; i++) {
                    let score = [];
                    let k =[];
                    const result = base[i].hasAttribute("rdf:ID"); 
                    if(result) {
                        let match = false;
                        let abort = true;
                        let indexOfDupePost = -1;
                        for (let l = 0; l < posts.length && abort; l++) { //check for dupes in DB
                            if(posts[l].title === base[i].getElementsByTagName("title")[0].childNodes[0].nodeValue
                            && posts[l].description === base[i].getElementsByTagName("description")[0].childNodes[0].nodeValue
                            && posts[l].identifier === base[i].getElementsByTagName("identifier")[0].childNodes[0].nodeValue) {
                                match = true;
                                indexOfDupePost = l;
                                abort = false;
                            }  
                        }

                        const count = base[i].getElementsByTagName("keyword");
                        for (let j = 0; j < count.length; j++) { //get all keywords
                            if(count[j].getElementsByTagName("score").length === 0){ //if score element doesnt exist, we assume its 0
                                score.push(null);
                            }else{
                                score.push(parseFloat(count[j].getElementsByTagName("score")[0].childNodes[0].nodeValue, 10));
                            }
                            k.push(count[j].getElementsByTagName("label")[0].childNodes[0].nodeValue);  
                        }
                         
                        const element = {
                            id: base[i].getAttribute("rdf:ID"),
                            title: base[i].getElementsByTagName("title")[0].childNodes[0].nodeValue,
                            description: base[i].getElementsByTagName("description")[0].childNodes[0].nodeValue,
                            identifier: base[i].getElementsByTagName("identifier")[0].childNodes[0].nodeValue,
                            keyword: k,
                            scores:score,
                            exists: match,   
                            dupeIndex: indexOfDupePost

                        }; 
                        newposts.push(element);
                    } 
                                   
                }
                 
            })
            .catch(err => console.log(err));
        setLoadingFetched(false);
        console.log(newposts);
        setN(newposts); //state that holds the queries responded
        setNN(newposts);
        setP(false); //show table
    }


    function ShowKeywords({children}) {
        const givenKeys = children.keyword;
        const times = givenKeys.length;
        const arr = [];
        for (let index = 0; index < times; index++) {
            arr.push(givenKeys[index]);    
        }
            
            return( 
                <ul>
            {arr.map(item => {
                
                return <li><div className="wrapper"><div className="arrow-left"></div><span className="label2">{item}</span></div></li> 
 
            })}
        </ul>
               
            );
          
          
        
    }


    function ExShowKeywords({children}) { //show keywords
        const givenKeys = children.keyword;
        const givenScores = children.scores;
        const times = givenKeys.length;
        let dupek = [];
        let doublek = [];
        if(children.dupeIndex > 0){
            const keywordsFromDB = posts[children.dupeIndex].keyword;
            for (let index = 0; index < keywordsFromDB.length; index++) {
                dupek.push(keywordsFromDB[index]);
                
            }
        }
        
        let arr = [];
        let arrI = [];

        
        
        for (let index = 0; index < times; index++) {
            arr.push(givenKeys[index]); 
            arrI.push(givenKeys[index]); //initial, helps for cases
            
        }
        arrI = arrI.filter((e) => !dupek.includes(e)); // Ǝ Okeano, !Ǝ DB
        doublek = dupek.filter((e) => arr.includes(e));// Ǝ Okeano & Ǝ DB
        dupek = dupek.filter((e) => !arr.includes(e)); // Ǝ DB, !Ǝ Okeano

            if(children.dupeIndex < 0 ){
            return( 
                <ul>
            {arrI.map((item,index) => {
                if(givenScores[index] !== null) {
                return(
                    <>
                    
                    <li><div className="wrapper" ><div className="arrow-left"></div><span className="label2" >{item}</span></div></li> 
                    <p  className="popup-hover"><i>Score: {givenScores[index]*100}%</i></p>
                    </>

                );
                }else{
                    return(
                        <>
                        
                        <li><div className="wrapper" ><div className="arrow-left"></div><span className="label2" >{item}</span></div></li> 
                        </>
    
                    );

                }             })}
        </ul>
               
            );}
            else{
                return( 
                    <>
                    <ul>
                {arrI.map((item,index) => {
                    if(givenScores[index] !== null){
                    
                    return(
                        <>
                         <li><div className="wrapper"><div className="arrow-left"></div><span className="label2">{item}</span></div></li> 
                         <p  className="popup-hover"><i>Score: {givenScores[index]*100}%</i></p>
                         </>
                         );
                    }else{
                        return(
                            <>
                             <li><div className="wrapper"><div className="arrow-left"></div><span className="label2">{item}</span></div></li> 
                             </>
                             );

                    }
                        })}
            </ul>
            <ul>
                {dupek.map(item =>{
                    return <li><div className="wrapper"><div className="arrow-left2"></div><span className="label3">{item}</span></div></li>
                })}
            </ul>
            <ul>
                {doublek.map((item,index) =>{
                    if(givenScores[index] !== null){
                    return(
                        <>
                        <li><div className="wrapper"><div className="arrow-left3"></div><span className="label4">{item}</span></div></li>
                        <p  className="popup-hover"><i>Score: {givenScores[index]*100}%</i></p>
                        </>
                        );
                    }else{
                        return(
                            <>
                            <li><div className="wrapper"><div className="arrow-left3"></div><span className="label4">{item}</span></div></li>
                            </>
                            );

                    }
                    })}
            </ul>
            </>
                   
                );
            }
          
        
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
    
            <h1 className="text-primary mb-3">Object List</h1>
            <div className="search-container">
            <input type="text" className="search-bar" key="random1" value={keyword} placeholder={"search okeanos..."} onChange={(e) => setExt(e.target.value)}/> <button className="search-btn" onClick={(e) => DoSomething()}><i class="fa fa-search fa-2x"></i></button>
            <Loader
                className="spinner"
                visible={loadingFetched}
                type="Puff"
                color="#00BFFF"
                height={30}
                width={30}    
            />
            </div>
            <div className="newMain" hidden={p}>
            <p>Results found: {n.length}</p>
            <div className="wrapper">
            <div className="box-memo"></div><p className="text-memo">Already exists in DB&ensp;</p>
            <div className="box-memo-blue"></div><p className="text-memo">Recommended by DB&ensp;</p>
            <div className="box-memo-yellow"></div><p className="text-memo">Recommended by online repository&ensp;</p>
            <div className="box-memo-black"></div><p className="text-memo">Recommended by both</p>
            
            </div>
            <f.Table table table-bordered table-hover table-sm responsive> 
            
            <thead>
                <tr>
                    <th scope="col" >id</th>
                    <th scope="col" >title</th>
                    <th scope="col" >description</th>
                    <th scope="col" >identifier</th>
                    <th scope="col" style={columnStyling}>keyword<div className="box">
                        <button className="sorting_buttons"><i class="fa fa-sort-desc" onClick={(e) =>exSortDataAsc('keyword')}></i></button>
                        <button className="sorting_buttons"><i class="fa fa-sort-asc" onClick={(e) => exSortDataDesc('keyword')}></i></button></div></th>        
                             
                </tr>
            </thead>
            <tbody>
                <tr>
                <th></th>
                <input style={BarStyling} key="random2" value={keyword} placeholder={"search Title"} onChange={(e) => exUpdateInput2(e.target.value)}/>
                <th></th>
                <th></th>
                <input style={BarStyling} key="random1" value={keyword} placeholder={"search keyword"} onChange={(e) => exUpdateInput(e.target.value)}/>
                </tr> 
                {exCurrentPosts.map(post => (
                
                
                
                <tr style={post.exists ? {background:"#50C878"}: {}}> 
                      
                    <td >{post.id}</td>
                    <td style={post.exists ? {background:"#50C878"} : {background:"#F6F6F6"}}>{post.title}</td>
                    <td><ShowMore>{post.description}</ShowMore></td>
                    <td style={post.exists ? {background:"#50C878"} : {background:"#F6F6F6"}}><a href={post.identifier} target="_blank"  rel="noopener noreferrer">{post.identifier}</a></td>
                    <td><ExShowKeywords children={post}></ExShowKeywords></td>
                        
                    
                    
                   
                </tr>
                
                ))}
            </tbody>
            </f.Table>
            <nav className="endPage">
            <ul className="pagination">
                <li className="page-item ">
                    <a onClick={() => exPaginate(1)} className="page-link" tabIndex="1" href="#">{"<<"}</a></li> 
                {exPageNumber.map(PageNumber =>(
                    <li key={PageNumber} className="page-item " >
                        <a onClick={() => exPaginate(PageNumber)} class="page-link " tabIndex="1" href="#" >
                            {PageNumber}
                        </a>
                    </li>
                ))}
                <li className="page-item">
                    <a onClick={() => exPaginate(exPageNumber.length)} className="page-link" tabIndex="1" href="#">{">>"}</a></li> 

            </ul> 
        </nav>
     
        <div className="test">
             <f.Dropdown> 
                <f.Dropdown.Toggle variant="success" id="dropdown-basic" >
                    {exPostsPerPage}
                </f.Dropdown.Toggle>

                <f.Dropdown.Menu >
                    <f.Dropdown.Item onClick={() => { setExPostsPerPage(5); setExCurrentPage(1);}}>5</f.Dropdown.Item>
                    <f.Dropdown.Item onClick={() => { setExPostsPerPage(10); setExCurrentPage(1);}} >10</f.Dropdown.Item>
                    <f.Dropdown.Item onClick={() => { setExPostsPerPage(20); setExCurrentPage(1);}}>20</f.Dropdown.Item>
                </f.Dropdown.Menu>
            </f.Dropdown>
        </div>
        <h2>Objects in DataBase:</h2>
    </div>
            

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
                    <td className="alt-col">{post.title}</td>
                    <td><ShowMore>{post.description}</ShowMore></td>
                    <td className="alt-col"><a href={post.identifier} target="_blank"  rel="noopener noreferrer">{post.identifier}</a></td>
                    <td><ShowKeywords children={post}></ShowKeywords>
                
                        
                        
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
             <div className="test">
             <f.Dropdown> 
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
<ScrollButton/>
        </div>
    )
    
}