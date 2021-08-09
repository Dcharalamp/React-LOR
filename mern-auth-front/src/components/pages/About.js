import React from "react";

import {Link} from "react-router-dom";




export default function About() {

    return(
       <div className="about-page">
           <h1>A safe repository for educational data</h1>
           <p >LOR is a web interface that handles Learning Objects.
            It is responsible for storing the Learning Objects(LO) and its metadata.
            </p>
            <h2>What is the purpose of this interface?</h2>
            <p >We built this application while having in mind that it will be used for educational purposes,
            ideally for all educational levels. The concept of a "digital library" having every piece of information a student might need
            was our main priority. Therefore, we made a very UI-focused app, that can show LOs fast and with a more distinct way.
            On the other hand, we wanted to provide the admins(which in our case can be faculty) the power to alter the
            metadata of the given object, based on their knowledge and experience. </p>
            <h2>What kind of data can be found here?</h2>
            <p >For the time being we have focused on medical learning objects, but for this specific field, 
                any information anyone can possibly imagine can be found!
                All it takes is using the "search" option to type a specific keyword and, based on that,
                all types of information matching this keyword will show up. From article titles and extensive description to URL links.<br></br>
                We do plan on expanding our scientific fields in the future, so stay tuned for further updates!
            </p>
            <h2>What power does a user have on a Learning Object?</h2>
            <p >We have two levels of users in the interface, the guest user who only has read-only
            rights and the admin user who has has additional options. An admin has the right to add new LOs, edit the existing ones or even delete them.
            He also has the right to change in any way he/she sees fit the keywords of the given object.</p>
            <h2>Searching data from other online sources</h2>
            <p >Apart from the LOs that are locally saved in our database, we provide the chance to search
            for data from very big online repositories, which provide huge amount of information. That way, information and
            knowledge can be expanded and be accessible easier for everyone.</p>
            <h2>What are you waiting for?</h2>
            <p >You're not sure that this interface can provide all the above yet?
             Fear not! <Link to="/register">Sign up</Link>, create an account and dive deep 
            into the vast world of Learning Objects! 
            If you'd like to get administator right, please contact our support team first.
            </p>

       </div>
    );

}