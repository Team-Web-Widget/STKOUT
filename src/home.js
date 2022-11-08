import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import appclip from './assets/appcliplogo.png'
import logo from "./assets/logoicon.svg"
import logotext from "./assets/logotxt.svg"
import previewImg from './assets/preview.png'
import Avatar from './avatar'
import promImage from './assets/meeting.jpg'
import { Link, useNavigate } from 'react-router-dom'

import EditMode from './editMode'

const Home = ({ session }) => {
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [website, setWebsite] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)
    const [accessCode, setAccessCode] = useState(null)
    const [strictAvatar, setStrictAvatar] = useState(null)
    const [statusUpdate, setStatusUpdate] = useState(null)
    const [localShare, setLocalShare] = useState(null)
    const [parsedsavedcontacts, setParsedsavedcontacts] = useState(null)
    const [savedcontacts, setSavedcontacts] = useState([])
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
        if (localStorage.getItem('codeStatus') == "active") {
            navigate('/editMode')
        }
    }, [])


    useEffect(() => {
        if (avatar_url) downloadImage(avatar_url);
        if (localStorage.getItem('changesSaved') == 'true') {
            console.log('changes saved')
            localStorage.setItem('changesSaved', 'false')
            setStatusUpdate('Changes Saved');
            document.getElementById('saveStateIcon').style.display = 'block';
        } else {
            document.getElementById('saveStateIcon').style.display = 'none';
        }
    }, [avatar_url])



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

    const editProfile = async () => {
        navigate('/editMode')
    }

    const changeMode = async () => {
        navigate('/changeMode')
    }


    const getProfile = async () => {
        try {
            setLoading(true)
            const { user } = session

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url, shareID, themeColor, savedcontacts`)
                .eq('id', user.id )
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
                setLocalShare(data.shareID)
                setSavedcontacts(data.savedcontacts)
                localStorage.setItem('themeColor', data.themeColor)
                document.documentElement.style.setProperty('--main-color', data.themeColor);
                console.log(data.savedcontacts)
                console.log(data.avatar_url)
                console.log(data.savedcontacts)
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }

    const viewProfile = async () => {
        window.location.href = '/?p=' + localShare
    }

    const shareProfile = async () => {
        if (navigator.share) {
            navigator.share({
                title: username + ' | STKOUT Profile',
                text: 'Check out web.dev.',
                url: window.location.href + '?p=' + localShare,
            }).then(() => {
                console.log('Thanks for sharing!');
            })
                .catch(console.error);
        } else {
            // fallback
        }
    }

    async function signout() {
        const { error } = await supabase.auth.signOut()
    }

    return (
        <>
            <div className='vivify fadeIn delay-400'>

                <nav className='home-nav'>
                    <div className='logo-container'>
                        <i className='material-icons'>qr_code_scanner
                        </i>
                        <img src={logotext} alt="logo" />
                    </div>

                    <img onClick={editProfile} className='vivify fadeIn duration-300' src={strictAvatar}></img>
                </nav>


                <div className="grouped-btns vivify fadeIn duration-300 delay-100 slim-mode">



                    <button onClick={viewProfile} className="btn btn-primary"><i className='material-icons'>account_circle</i><span>View Profile</span></button>

                    <div className='slim-bar'></div>

                    <button onClick={shareProfile} className="btn btn-primary" ><i className='material-icons'>ios_share</i><span>Share Profile</span></button>
                </div>





             
            <div className='discover-feed'>

                <div className='discover-card vivify fadeIn duration-300 delay-100'>
                    <img src={promImage}></img>
                    <div className='discover-txt'>
                        <h3>Discover</h3>
                        <p>Make Your Next Meeting a Slam Dunk</p>
                    </div>
                    </div>

                    <div className='discover-card vivify fadeIn duration-300 delay-100'>
                    <img src={promImage}></img>
                    <div className='discover-txt'>
                        <h3>Discover</h3>
                        <p>Make Your Next Meeting a Slam Dunk</p>
                    </div>
                    </div>

                    <div className='discover-card vivify fadeIn duration-300 delay-100'>
                    <img src={promImage}></img>
                    <div className='discover-txt'>
                        <h3>Discover</h3>
                        <p>Make Your Next Meeting a Slam Dunk</p>
                    </div>
                    </div>
            </div> 






                <label className='btn-label vivify fadeIn duration-300 delay-100'>Customize</label>
                <div className="grouped-btns vivify fadeIn duration-300 delay-100">



                    <button onClick={editProfile} className="btn btn-primary" ><i className='material-icons'>edit</i><span>Edit Profile</span></button>

                    <button onClick={changeMode} className="btn btn-subtext"><i className='material-icons'>swap_horizontal_circle</i><span>Change Mode <p>Current: Profile Mode</p></span></button>

                </div>


{savedcontacts && savedcontacts.map((contact) => (
                    <div className='contact-feed'>
                        <button className='contact-item'>
                            <img src='https://shotkit.com/wp-content/uploads/2021/06/cool-profile-pic-matheus-ferrero.jpeg'></img>
                            <h3>Avery Gram</h3>
                            </button>
                            </div>
                            ))}

           
     







                <div className='vivify blink delay-1000'>
                    <p className='statusUpdate vivify fadeOut delay-5000'><i className='material-icons' id='saveStateIcon'>save</i>{statusUpdate}</p>
                </div>


                <button className='signoutBTN' onClick={signout}>SignOut</button>
            </div>
        </>

    )
}

export default Home