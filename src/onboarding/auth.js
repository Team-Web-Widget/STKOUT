import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import logo from "../assets/shroutlogo 2.png"
import linkedinBtn from '../assets/signinbtn.png'
import outline from '../assets/pattern.svg'



export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  async function signInWithLinkedIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin',
    })
  }

  /*
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', "#131127");
  }, [])
*/
  return (

    
  <>

    <div className="auth-container">
      <div className="auth-wrap form-widget" aria-live="polite">
  
    {/*     {loading ? (
          'Sending magic link...'
        ) : (
          <form onSubmit={handleLogin} className="auth-form-magic">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="button block" aria-live="polite">
              Send magic link
            </button>
          </form>
        )} */}
        <div className="auth-logo-container">
        <img className='vivify fadeIn duration-300 delay-200' src={logo} alt="Shrout Logo" />
        </div>
  

        <button className='auth-btn-prov vivify fadeIn duration-300 delay-400' onClick={signInWithLinkedIn}><img src={linkedinBtn} alt="Sign in with Linkedin" /></button>
  
      </div>
    </div>
    </>
  )
}