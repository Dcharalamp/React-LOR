import React,{useState} from "react";
import "./../../style.css";

export default function ScrollButton() {
  
        const [visible, setVisible] = useState(false)

        const imgStyle = {color: "white"};
        
        const toggleVisible = () => {
          const scrolled = document.documentElement.scrollTop;
          if (scrolled > 300){
            setVisible(true)
          } 
          else if (scrolled <= 300){
            setVisible(false)
          }
        };
        
        const scrollToTop = () =>{
          window.scrollTo({
            top: 0, 
            behavior: 'smooth'
          });
        };
        
        window.addEventListener('scroll', toggleVisible);

        return (
            
            <button className="go-to-top" onClick={scrollToTop} 
            style={{display: visible ? 'inline' : 'none'}}>
             <i class="fa fa-arrow-circle-up" ></i>
            </button>
           
          );

}