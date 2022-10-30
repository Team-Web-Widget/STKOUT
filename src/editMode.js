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
import { fetchPlace } from './autoCity'

const EditMode = ({ session }) => {

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [website, setWebsite] = useState(null)
    const [phoneNum, setPhoneNum] = useState(null)
    const [bio, setBio] = useState(null)
    const [shareMail, setShareMail] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)
    const [themeColor, setThemeColor] = useState(null)
    const [accessCode, setAccessCode] = useState(null)
    const [strictAvatar, setStrictAvatar] = useState(null)
    const [tagline, setTagline] = useState(null)
    const navigate = useNavigate();
    const [staticCity, setStaticCity] = useState(null);
    const [tempThemeColor, setTempThemeColor] = useState(null)
    const [city, setCity] = useState("");
    const [autocompleteCities, setAutocompleteCities] = useState([]);
    const [autocompleteErr, setAutocompleteErr] = useState("");
    const [qrCodeStatus, setQrCodeStatus] = useState(false);
    const [shareID , setShareID] = useState(null);
    const [activationStatus, setactivationStatus] = useState(null)

    const handleCityChange = async (e) => {
        setCity(e.target.value);
        if (!city) return;

        const res = await fetchPlace(city);
        !autocompleteCities.includes(e.target.value) &&
            res.features &&
            setAutocompleteCities(res.features.map((place) => place.place_name));
        res.error ? setAutocompleteErr(res.error) : setAutocompleteErr("");
    }

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
        if (avatar_url) downloadImage(avatar_url)
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

    const updateTracker = async (e) => {
     
     
if(shareID == null || shareID == undefined || shareID == ''){
        try {
            setLoading(true)
            const { user } = session

            const updates = {
             
                activationStatus,
                updated_at: new Date(),
            }

            let { error } = await supabase
            .from('codetrack')
            .update(updates)
            .eq('accessid', shareID)

            if (error) {
                throw error
            }
        } catch (error) {
                console.log(error.message)
        } finally {
            setLoading(false)
            
        }

       console.log('uptrack complete')
    }
    }


    const getProfile = async () => {
        try {
            setLoading(true)
            const { user } = session

            let { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url, shareMail, phoneNum, bio,tagline, city`)
                .eq('id', user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
                setShareMail(data.shareMail)
                setPhoneNum(data.phoneNum)
                setBio(data.bio)
                setTagline(data.tagline)
                setCity(data.city)
                setShareID(data.shareID)
                console.log(data.avatar_url)
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const { user } = session

            const updates = {
                id: user.id,
                username,
                website,
                avatar_url,
                shareMail,
                phoneNum,
                bio,
                themeColor,
                tagline,
                city,
                shareID,
                updated_at: new Date(),
            }

            let { error } = await supabase.from('profiles').upsert(updates)

            if (error) {
                throw error
            }
        } catch (error) {
            alert(error.message)
        } finally {
            setLoading(false)
           
            
        }

        setactivationStatus("true")
        updateTracker()
        localStorage.removeItem('codeStatus')
        localStorage.removeItem('code')
        localStorage.setItem('changesSaved', true)
        navigate('/', { replace: true })

    }

    const closeModal = () => {
        navigate('/', { replace: true })
    }

    const updateCity = async (e) => {

    }

    
  useEffect(() => {
    if (localStorage.getItem('codeStatus') === 'active') {
        setQrCodeStatus("hideModeGlobal")
        setShareID(localStorage.getItem('code'))
      console.log('codeStatus is true')
    }else{
      console.log('codeStatus is false')
    }
  }, [])


    function handleThemeColorChange(e) {
        setTempThemeColor(e.target.value)
        setThemeColor(e.target.value)

        document.documentElement.style.setProperty('--main-color', e.target.value);

    }

    return (
        <>
            <div className="editPfile vivify fadeInBottom duration-200 ">


                <div className='navbar-strip '>
                    <button onClick={closeModal} className='nav-icon' ><i className='material-icons'>arrow_back</i><span>Back</span></button>
                    <h3></h3>
                    <button className='nav-t-right' ></button>
                </div>



                <div className='maximized-card '>

                    <div className='max-aligner'>
                    
                        <h1 className='page-title'>{qrCodeStatus === 'hideModeGlobal' ? 'Setup QR Code' : 'Edit Profile'}</h1>

                   
                       
                        <form onSubmit={updateProfile} className="form-widget">

                            <div>
                                <label htmlFor="username">Name</label>
                                <br></br>
                                <input
                                    id="username"
                                    type="text"
                                    value={username || ''}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="tagline">Tagline</label>
                                <br></br>
                                <input
                                    id="tagline"
                                    type="text"
                                    value={tagline || ''}
                                    onChange={(e) => setTagline(e.target.value)}
                                />
                            </div>




                            <div>
                                <label htmlFor="city" className="label">
                                    Your City
                                    {autocompleteErr && (
                                        <span className="inputError">{autocompleteErr}</span>
                                    )}
                                </label>
                                <input
                                    list="places"
                                    type="text"
                                    id="city"
                                    name="city"
                                    onChange={handleCityChange}
                                    value={city}

                                  
                                    autoComplete="off"
                                />


                                {autocompleteCities.map((city, i) => (
                                    <p className='autfill-items' onClick={(e) => setCity(city)} key={i}>{city}</p>
                                ))}

                            </div>









                        
                            <div>
                                <label htmlFor="shareMail">Email</label>
                                <br></br>
                                <input
                                    id="shareMail"
                                    type="text"
                                    value={shareMail || ''}
                                    onChange={(e) => setShareMail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="phoneNum">Phone Number</label>
                                <br></br>
                                <input
                                    id="phoneNum"
                                    type="text"
                                    value={phoneNum || ''}
                                    onChange={(e) => setPhoneNum(e.target.value)}
                                />
                            </div>
                            <div className='theme-color'>
                                <label htmlFor="themeColor">Theme Color</label>
                                <br></br>
                                <div className='colorSelect' onChange={handleThemeColorChange}>
                                    <input style={{ backgroundColor: "#007AB6" }} type={'radio'} name={'themeColor'} value={'#007AB6'} ></input>

                                    <input style={{ backgroundColor: '#932D2D' }} type={'radio'} name={'themeColor'} value={'#932D2D'}></input>

                                    <input style={{ backgroundColor: "#2D3D93" }} type={'radio'} name={'themeColor'} value={'#2D3D93'}></input>

                                    <input style={{ backgroundColor: "#2D9379" }} type={'radio'} name={'themeColor'} value={'#2D9379'}></input>

                                    <input style={{ backgroundColor: "#9C27B0" }} type={'radio'} name={'themeColor'} value={'#9C27B0'}></input>

                                    <input style={{ backgroundColor: "#E91E63" }} type={'radio'} name={'themeColor'} value={'#E91E63'}></input>
                                </div>

                            </div>


                            <div className="form-widget">
                                {/* Add to the body */}
                                <Avatar
                                    url={avatar_url}
                                    size={150}
                                    onUpload={(url) => {
                                        setAvatarUrl(url)
                                        updateProfile({ username, website, avatar_url: url })
                                    }}
                                />
                                {/* ... */}
                            </div>

                            <div>
                                <label htmlFor="bio">Bio</label>
                                <br></br>
                                <textarea
                                    id="bio"
                                    type="text"
                                    value={bio || ''}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>

                            <div>
                                <button className="lg-button primary block" disabled={loading}>
                                    Save Changes
                                </button>
                            </div>
                        </form>

                    </div>


                </div>


            </div>






        </>

    )
}

export default EditMode