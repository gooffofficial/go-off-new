import MobileSignup from "./mobile/MobileSignup";
import Sform from "./sform";

const Signup = props =>{
      
	if( window.innerWidth <= 800 ){
    console.log(window.innerWidth)
    return <MobileSignup/>
}
      return (
        <div>
          <Sform />

        </div>
      )
    }
    export default Signup;