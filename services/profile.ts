import axios from 'axios'

export const updateUserProfile = async (bio?: string): Promise<{ data: any , error:any} >=> {
    //if at least one arguments not provided, return
   

    try {
        const { data } = await axios.patch('/api/user/profile', {bio});
        return  { data ,error:null}
    } catch (error:any) {
        return { data:null,error:error.response.data.message}
    }
}