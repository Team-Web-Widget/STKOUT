import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import appclip from './assets/appcliplogo.png'
import logo from "./assets/logoicon.svg"
import logotext from "./assets/logotxt.svg"
import previewImg from './assets/preview.png'
import Avatar from './avatar'
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
        if(localStorage.getItem('codeStatus') == "active"){
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
        }else{
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
                .select(`username, website, avatar_url, shareID, themeColor`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
                setLocalShare(data.shareID)

                document.documentElement.style.setProperty('--main-color', data.themeColor);
                console.log(data.avatar_url)
            }
        } catch (error) {
            alert(error.message)
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
            <div className='logo-container'>
                <i className='material-icons'>qr_code_scanner
</i>
                <img src={logotext} alt="logo" />
            </div>

            <div className='profile-shell vivify fadeIn '>
                <div className='profile-container'>
                    <img className='vivify fadeIn duration-300' src={strictAvatar}></img>

                    <div className='profile-info vivify fadeIn duration-300 '>
                        <h3>Welcome Back,</h3>
                        <h1>{username}</h1>
                    </div>
                </div>

            </div>




            <label className='btn-label vivify fadeIn duration-300 delay-100'>Customize</label>
            <div className="grouped-btns vivify fadeIn duration-300 delay-100">



                <button onClick={editProfile} className="btn btn-primary" ><i className='material-icons'>edit</i><span>Edit Profile</span></button>

                <button onClick={changeMode} className="btn btn-subtext"><i className='material-icons'>swap_horizontal_circle</i><span>Change Mode <p>Current: Profile Mode</p></span></button>

            </div>

            <label className='btn-label vivify fadeIn duration-300 delay-100'>Your Profile</label>
            <div className="grouped-btns vivify fadeIn duration-300 delay-100 slim-mode">



                <button onClick={viewProfile} className="btn btn-primary"><i className='material-icons'>account_circle</i><span>View Profile</span></button>

                <div className='slim-bar'></div>

                <button onClick={shareProfile} className="btn btn-primary" ><i className='material-icons'>ios_share</i><span>Share Profile</span></button>
            </div>


            <div className='vivify blink delay-1000'>
                <p className='statusUpdate vivify fadeOut delay-5000'><i className='material-icons' id='saveStateIcon'>save</i>{statusUpdate}</p>
            </div>


            <button className='signoutBTN' onClick={signout}>SignOut</button>
            </div>
        </>

    )
}

export default Home