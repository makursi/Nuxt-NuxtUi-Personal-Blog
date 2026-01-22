
export default function getUserData(){
   try {
    const userData = localStorage.getItem('userdata')

    const parseUserData = JSON.parse(userData)
     if(typeof userData !== 'object'){
   return {
     user:parseUserData?.user,
token:parseUserData?.token
   }
     }
   } catch (error) {
    
   }
}