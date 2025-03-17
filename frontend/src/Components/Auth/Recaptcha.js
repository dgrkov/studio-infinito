import { useEffect } from "react";

export default function Recaptcha() {
    const handleLoaded = _ => {
        window.grecaptcha.ready(_ => {
          window.grecaptcha
            .execute(process.env.REACT_APP_RECAPTCHA_SITE_KEY, { action: "homepage" })
            .then(token => {})
        })
      }
      
      useEffect(() => {
        const script = document.createElement("script")
        script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_RECAPTCHA_SITE_KEY}`
        script.addEventListener("load", handleLoaded)
        document.body.appendChild(script)
      }, [])
      
      return (
        <div
          className="g-recaptcha"
          data-sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          data-size="invisible"
        ></div>
      )
}
