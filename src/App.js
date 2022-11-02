import './index.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './onboarding/auth'
import Account from './account'
import './App.css'
import Pattern from './assets/pattern.svg'
import Home from './home'
import { BrowserRouter, Routes, Route, useLocation,} from "react-router-dom";
import CardView from './cardView'
import EditMode from './editMode'
import ChangeMode from './changeMode'


export default function App() {


  const [session, setSession] = useState(null)
  const [accessCode, setAccessCode] = useState(null)


  useEffect(() => {
    if (window.location.href.includes('p=')) {
      setAccessCode(window.location.href.split('p=')[1])
    
    }
  }, [])



 

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

   
  }, [])

  return (
    <>
      {/* <p className='accessCodePrev'>Access Code: {accessCode}</p>
 */}
      {/* {!accessCode ? (

        !session ? (
          <Auth />
        ) : (
          <Home session={session} />

        )

      ) : (


        <CardView session={session} accessCodeProp={accessCode} />
      )} */}


      <BrowserRouter>
        <Routes >
          {(!accessCode)
          ? (

            !session ? (
              <Route path="/" element={<Auth />} />

            ) : (
              <Route path="/" element={<Home session={session} />} />
    
            )
    
          ) : (
    
            <Route path="/" element={<CardView session={session} accessCodeProp={accessCode} />} />
            
          )

          }
         
        
      
          <Route path="/cardView" element={<CardView session={session} accessCodeProp={accessCode} />} />
     
          <Route path="/editMode" element={<EditMode session={session} />} />

          <Route path="/auth" element={<Auth/>} />

          <Route path="/changeMode" element={<ChangeMode session={session} />} />

        </Routes>
      </BrowserRouter>

    </>
  )
}