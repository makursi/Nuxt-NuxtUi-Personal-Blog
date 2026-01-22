
export default function getUserData(){
   try {
    const userData = localStorage.getItem('userdata')


     if(typeof userData !== 'object'){
       const parseUserData = JSON.parse(userData)
   return {
     user:parseUserData?.user,
token:parseUserData?.token
   }
     }
   } catch (error) {
    console.log(error);
   }
}