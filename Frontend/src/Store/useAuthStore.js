import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import { toast } from 'react-hot-toast'
import { io } from 'socket.io-client'

const BASE_URL = "http://localhost:3797"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            console.log(res);
            
            set({ authUser: res.data })

            get().connectSocket()
        } catch (error) {
            console.log("Error in CheckAuth:", error);
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        console.log("Sending Data:", data);

        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account Created Successfully");

            get().connectSocket()
        } catch (error) {
            toast.error("Error in Signup");
            console.log("Error in Signup:", error);
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIng: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIng: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged Out Successfully");

            get.disconnectSocket();
        } catch (error) {
            console.log("Error in Logout:", error);
            toast.error(error.response.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile Updated Successfully");
        }
        catch (error) {
            console.log("Error in Update Profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL,{
            query:{
                userId: authUser.id,
            },
        })
        socket.connect()

        set({ socket: socket });

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds})
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));