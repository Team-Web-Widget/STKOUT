import './index.css'
import { useState, useEffect } from 'react'
import Auth from './onboarding/auth'
import Account from './account'
import './App.css'
import Pattern from './assets/pattern.svg'
import Home from './home'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from './supabaseClient'
import placeholder from './assets/stacyPlaceholder.png'
import './vivify.min.css'
import { Link, useNavigate } from 'react-router-dom'

const EditMode = ({ session, accessCodeProp }) => {

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [website, setWebsite] = useState(null)
    const [phoneNum, setPhoneNum] = useState(null)
    const [bio, setBio] = useState(null)
    const [shareMail, setShareMail] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)
    const [accessCode, setAccessCode] = useState(null)
    const [strictAvatar, setStrictAvatar] = useState(null)
    const [tagline, setTagline] = useState(null)
    const [themeColor, setThemeColor] = useState(null)
    const [city, setCity] = useState(null)
    const [activestatus , setActivestatus] = useState(null)
    const [cardstate, setCardstate] = useState(null)
    const navigate = useNavigate()
    const [tempContacts, setTempContacts] = useState([])
    const savedcontacts = ["777777", "018999"];
  



    const downloadImage = async (path) => {
        try {
            const { data, error } = await supabase.storage
                .from('avatars')
                .download(path)
            if (error) {
                throw error
            }
            const url = URL.createObjectURL(data)
            setStrictAvatar(url)
        } catch (error) {
            console.log('Error downloading image: ', error.message)
        }
    }

    useEffect(() => {

        document.documentElement.style.setProperty('--main-color', localStorage.getItem('themeColor'));
    }, [themeColor])


    useEffect(() => {
        if (avatar_url) downloadImage(avatar_url)
    }, [avatar_url])


    useEffect(() => {
        setAccessCode(accessCodeProp)
    }, []);

    useEffect(() => {

      
        getCodeStatus();

    }, [session])

    const addNew = () => {
        setTimeout(() => {
            setAccessCode(prompt("Enter Card Access Code"));
            if (accessCode != null) {
                console.log('do stuff')
            }
        }, 500);


    }

    
    const getCodeStatus = async () => {
        try {
     
            setLoading(true)
         console.log('checking code status')

            let { data, error, status } = await supabase
                .from('codetrack')
                .select(`accessid, activationStatus`)
                .eq('accessid', accessCodeProp)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
              setActivestatus(data.activestatus)
                setCardstate(data.cardstate)
                console.log('code status: ', data)
                console.log('code status: ', data.accessid)
                console.log('card state: ', data.activationStatus)
                if(data.activationStatus == 'false'){
                    closeModal();
                    console.log('code is inactive')
                    localStorage.setItem('codeStatus', 'active');
                    localStorage.setItem('code', accessCodeProp);
                    navigate('/')
                }else{
                    getProfile();
                }
            }
        } catch (error) {
            console.log(error.message);
            console.log('Your code is invalid or has expired. Please try again.')
       
        } finally {
            setLoading(false)
  
        }
    }


    

    const getProfile = async () => {
        try {
            setLoading(true)
         

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url, shareMail, phoneNum, bio, themeColor, tagline, city, savedcontacts`)
                .eq('shareID', accessCodeProp)
                .single()

            if (error && status !== 406) {
               
                throw error;
                
            }

            if (data) {
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
                setShareMail("mailto:" + data.shareMail)
                setPhoneNum("tel:" + data.phoneNum)
                setBio(data.bio)
                setThemeColor(data.themeColor)
                setTagline(data.tagline)
                setTempContacts(data.savedcontacts)
                setCity(data.city)
                console.log(data.avatar_url)
                console.log(data.themeColor)
              
            }
        } catch (error) {
            console.log(error.message)
      
        } finally {
          
            setLoading(false)
            document.getElementById('progress-indicate').style.display = 'none';
            document.getElementById('max-card').style.display = 'block';
        }
    }




    const handleSaveContact = async () => {
        console.log('saved contact')
        const temparr = [...tempContacts, {name: username, number: accessCode, avatar: avatar_url}];
        setTempContacts (temparr);
      
        

        
        try {
            setLoading(true)
            const { user } = session

            const updates = {
                id: user.id,
                "savedcontacts":temparr,
                updated_at: new Date(),
            }

            let { error } = await supabase.from('profiles').upsert(updates)

            if (error) {
                throw error
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
            localStorage.setItem('changesSaved', true)
        }

       
   


    }


    const closeModal = () => {
        window.location.href = "/"
    }





    return (
        <>

        


            <div id='editPFILE' className="editPfile vivify fadeIn delay-300">
       

                <div className='navbar-strip '>
                    <button onClick={closeModal} className='nav-icon' ><i className='material-icons'>arrow_back</i><span>Back</span></button>
                    <h3></h3>
                    <button className='nav-t-right' ></button>
                </div>

                <div id='progress-indicate' class="progress-bar">
    <div class="progress-bar-value"></div>
  </div>

                <div id='max-card' className='maximized-card '>

                    <div className='max-aligner'>


                        <div className='profile-shell'>
                            <div className='profile-container'>
                                <img className='vivify fadeIn duration-300 delay-400' src={strictAvatar}></img>

                                <div className='profile-info vivify fadeIn duration-300 delay-400 '>

                                    <h1>{username || ""}</h1>
                                    <h4>{tagline || "Job Title Unavailable"}</h4>
                                    <p>{city || "Location Unavailable"}</p>
                                </div>
                            </div>

                        </div>

                        <div className='prom-btn vivify fadeIn delay-500'>
                            <button onClick={handleSaveContact}>Save Contact</button>
                            

                        </div>


                        <div className="prom-flow">
                            <div className="flow-btns">




                                <a href={phoneNum} className={phoneNum === 'tel:' ? 'nonVisibleElement' : ''}>  <button className="flow-btn vivify fadeIn duration-300 delay-500"><i className='material-icons'>call</i><span>Call Now</span></button></a>



                                <a href={shareMail} className={shareMail === 'mailto:' ? 'nonVisibleElement' : ''}> <button className="flow-btn vivify fadeIn duration-300 delay-500"><i className='material-icons'>mail</i><span>Email Me</span></button>
                                </a>





                                <a>
                                    <button className="flow-btn vivify fadeIn duration-300 delay-500" id='iosShare'><i className='material-icons shareIconOV'>ios_share</i><span>Share To</span></button>

                                    <button className="flow-btn vivify fadeIn duration-300 delay-500" id='androidShare'><i className='material-icons shareIconOV'>share</i><span>Share To</span></button>
                                </a>



                            </div>

                            <div className={bio === '' ? 'nonVisibleElement' : ''}>
                                <div className="flow-desc">
                                    <h3>About Me</h3>
                                    <p>{bio}</p>


                                </div>
                            </div>

                        </div>


                        {/*  <div className="quick-links">
                        <h3>Quick Links</h3>
                        <div className="link-container">
                            <button className="link-btn vivify fadeIn duration-300 delay-400"><i className='material-icons'>link</i><span>Linkedin</span></button>
                            

                            <button className="link-btn vivify fadeIn duration-300 delay-500"><i className='material-icons'>link</i><span>Instagram</span></button>



                            </div>
                    </div> */}

                    </div>


                </div>

            </div>

        </>

    )
}

export default EditMode