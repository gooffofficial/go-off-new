import React,{useState, useEffect, useContext} from 'react'
import '../../styles/mobile/setting.css'
import { UserContext } from '../../contexts/userContext'

const MobileSetting = () => {
    const [option, setOption] = useState("a")
    const [page, setPage] = useState("Settings")
    const helper = () =>{
        switch(option){
            case "a":
                //setPage("Settings")
                return <Default setOption={setOption}/>;
            case "b":
                //setPage("Account Settings")
                return <AccountSettings setOption={setOption}/>;
            case "c":
                //setPage("Edit Profile")
                return <Edit setOption={setOption}/>
            default:
                return <Default setOption={setOption}/>
        }
    }
    useEffect(()=>{
        return
    },[])
    return (
        <div className="settingModal">
            <div className="card card-setting shadow-lg">
                <div className="card-body">
                    {
                        helper()
                    }
                </div>
            </div>
        </div>
    )
}

const Default = ({setOption}) => {
    const {setModal} = useContext(UserContext)
    return<>
        <div className="row card-header m-1">
            <div className="col" onClick={()=>setModal(false)}><span uk-icon="chevron-left"/></div>
            <div className="col-10"><h5 className="cart-title">Settings</h5></div>
        </div>
        <div className="row m-2" onClick={()=>setOption("b")}>
            <div className="col"><span uk-icon="user"/></div>
            <div className="col-8 text-start h3">Account Settings</div>
            <div className="col"><span uk-icon="chevron-right"/></div>
        </div>
        <div className="row m-2" onClick={()=>setOption("c")}>
            <div className="col"><span uk-icon="pencil"/></div>
            <div className="col-8 text-start h3"> Edit Profile</div>
            <div className="col"><span uk-icon="chevron-right"/></div>
        </div>
    </>
}

const AccountSettings = ({setOption}) => {
    return <>
        <div className="row card-header m-1">
            <div className="col" onClick={()=>setOption("a")}><span uk-icon="chevron-left"/></div>
            <div className="col-10"><h5 className="cart-title">Account Settings</h5></div>
        </div>
    <div className="m-2">
        <div className="row setting-option">
            <div className="col h3">First Name</div>
            <div className="col-7"></div>
        </div>
        <div className="row setting-option">
            <div className="col h3">Last Name</div>
            <div className="col-7"></div>
        </div>
        <div className="row setting-option">
            <div className="col h3">Email</div>
            <div className="col-7"></div>
        </div>
        <div className="row setting-option">
            <div className="col h3">Phone</div>
            <div className="col-7"></div>
        </div>
        <div className="row setting-option">
            <div className="col h3">Gender</div>
            <div className="col-7"></div>
        </div>
    </div></>
}
const Edit = ({setOption}) => {
    return <>
    <div className="row card-header m-1">
        <div className="col" onClick={()=>setOption("a")}><span uk-icon="chevron-left"/></div>
        <div className="col-10"><h5 className="cart-title">Edit Profile</h5></div>
    </div>
    <div className="row d-flex text-center justify-content-center">
    <img className="pic col-12" src="https://miro.medium.com/max/316/1*LGHbA9o2BKka2obwwCAjWg.jpeg"/>
    <a disabled className="h3">Update Profile Photo</a>
    </div>
    <div className="row">
    <div className="m-2">
        <div className="row setting-option">
            <div className="col h3">First Name</div>
            <div className="col-7"></div>
        </div>
        <div className="row setting-option">
            <div className="col h3">Last Name</div>
            <div className="col-7"></div>
        </div>
        <div className="row setting-option">
            <div className="col h3">Email</div>
            <div className="col-7"></div>
        </div>
        <div className="row setting-option">
            <div className="col h3">Phone</div>
            <div className="col-7"></div>
        </div>
        <div className="row setting-option">
            <div className="col h3">Gender</div>
            <div className="col-7"></div>
        </div>
        <div className="row setting-option">
            <div className="col h3">Bio</div>
            <div className="col-7"></div>
        </div>
    </div>
    </div>
    </>
}
export default MobileSetting
