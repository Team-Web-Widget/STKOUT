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
    const navigate = useNavigate()

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

        document.documentElement.style.setProperty('--main-color', themeColor);
    }, [themeColor])


    useEffect(() => {
        if (avatar_url) downloadImage(avatar_url)
    }, [avatar_url])


    useEffect(() => {
        setAccessCode(accessCodeProp)
    }, []);

    useEffect(() => {

        getProfile();


    }, [session])

    const addNew = () => {
        setTimeout(() => {
            setAccessCode(prompt("Enter Card Access Code"));
            if (accessCode != null) {
                console.log('do stuff')
            }
        }, 500);


    }


    const getProfile = async () => {
        try {
            setLoading(true)
         

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url, shareMail, phoneNum, bio, themeColor, tagline, city`)
                .eq('shareID', accessCodeProp)
                .single()

            if (error && status !== 406) {
                throw error
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
                setCity(data.city)
                console.log(data.avatar_url)
                console.log(data.themeColor)
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }



    const closeModal = () => {
        window.location.href = "/"
    }





    return (
        <>

        


            <div className="editPfile vivify fadeIn delay-300">


                <div className='navbar-strip '>
                    <button onClick={closeModal} className='nav-icon' ><i className='material-icons'>arrow_back</i><span>Back</span></button>
                    <h3></h3>
                    <button className='nav-t-right' ></button>
                </div>

                <div className='maximized-card '>

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
                            <button>Save Contact</button>
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