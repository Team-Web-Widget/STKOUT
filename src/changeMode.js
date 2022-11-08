import './index.css'
import { useState, useEffect } from 'react'
import Auth from './onboarding/auth'
import { supabase } from './supabaseClient'
import Account from './account'
import './App.css'
import Pattern from './assets/pattern.svg'
import Home from './home'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import placeholder from './assets/stacyPlaceholder.png'
import './vivify.min.css'
import './editMode.css'
import Avatar from './avatar'

const ChangeMode = ({ session }) => {

    const [loading, setLoading] = useState(true)
const [tempMode, setTempMode] = useState(null)
    const [mode, setMode] = useState(null)
    const navigate = useNavigate();
    const [tempThemeColor, setTempThemeColor] = useState(null)
    const [profileModeState, setProfileModeState] = useState(null)
    const [linkModeState, setLinkModeState] = useState(null)





   




    const getProfile = async () => {
        console.log(session)
        console.log(session.user.id)
        try {
            setLoading(true)
            const { user } = session

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url, shareMail, phoneNum, bio, mode`)
                .eq('id', session.user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                console.log(data.mode + "mode")
            
              setMode(data.mode)
               
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
            document.getElementById('chngemde-container').style.display = "block"
            document.getElementById('progress-indicate').style.display = "none"
        }
    }


    useEffect(() => {

        getProfile();


    }, [session])

    const updateProfile = async () => {
        

        try {
            setLoading(true)
            const { user } = session

            const updates = {
                id: user.id,
                mode,
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
        }

        localStorage.setItem('changesSaved', true)
   

    }

    useEffect(() => {
    
       
        console.log(mode)
        setTimeout(() => {
            updateProfile()
        }
            , 1000)


    
    }, [mode])



    const closeModal = () => {
        navigate('/', { replace: true })
    }

   

    return (
        <>
            <div  className="editPfile vivify fadeInBottom duration-200 ">


                <div className='navbar-strip '>
                    <button onClick={closeModal} className='nav-icon' ><i className='material-icons' >arrow_back</i><span>Back</span></button>
                    <h3></h3>
                    <button className='nav-t-right' ></button>
                </div>
                <div id='progress-indicate' class="progress-bar">
    <div class="progress-bar-value"></div>
  </div>



                <div className='maximized-card ' id='chngemde-container'>

                    <div className='max-aligner vivify fadeIn delay-100 duration-300'>

                        <h1 className='page-title'>Change Mode</h1>
                    
                        <form className="form-widget">

                   

                            <div >
                                <label id="profileBTN" className="snap-tab">
                                    <input value={'profileMode'} onChange={(e) => setMode(e.target.value)} checked={mode === 'profileMode' ? 'checked' : ''} type={'radio'} name="radio"></input>
                                    <div className="snap-btn">
                                        <i className='material-icons'>account_circle</i>
                                        <div className='snap-text'>
                                            <h6>Recommended</h6>
                                            <h3>Profile Mode</h3>
                                            <p>When your sticker is scanned it takes you to your profile. </p>
                                        </div>
                                    </div>
                                </label>
                                <label id="linkBTN" className="snap-tab">
                                    <input value={'linkMode'} onChange={(e) => setMode(e.target.value)} checked={mode === 'linkMode' ? 'checked' : ''} type={'radio'}  name="radio"></input>
                                    <div className="snap-btn">
                                        <i className='material-icons'>business</i>
                                        <div className='snap-text'>
                                         
                                            <h3>Busines Mode</h3>
                                            <p>This mode allows you to manage multiple employees stickers profiles.</p>
                                        </div>
                                    </div>
                                </label>
                            </div>

                         
                        </form>

                    </div>


                </div>


            </div>






        </>

    )
}

export default ChangeMode