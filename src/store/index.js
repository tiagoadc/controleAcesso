import Vue from 'vue'
import Vuex from 'vuex'
import Serve from "../server/index";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:{},
    token: '',
    authLogin: null,
    role: '',
  },
  getters:{
    GetUser: state => {
      return state.user
    },
    getToken: state => {
      return state.token
    },
    getRole: state => {
      return state.token
    },
  },
  mutations: {
    SET_USER (state, payload){
      state.user = payload      
    },
    SET_TOKEN (state,  payload){
      state.token = payload
    },
    SET_LOGIN (state, payload){
      state.authLogin = payload 
    } 
  },
  actions: {
     ActionSetUser (context, payload){
      context.commit('SET_USER', payload)
    },
    ActionSetToken (context, payload){
      context.commit('SET_TOKEN', payload)
    },
    ActionDoLogin (context, payload){
     
      return Serve.AuthLogin(payload)
    
    },
    ActionAddUser (context, payload){      
      return Serve.AddUser(payload._user, payload.token)    
    },
    ActionDelUser (context, payload){      
      return Serve.DelUser({id: payload._id}, payload.token)    
    },
    ActionGetlUser (contex, token){      
      return Serve.GetUser(token)    
    },
    ActionPutUser (context, payload){      
      return Serve.PutUser(payload._user, payload.token)    
    },
    ActionGetName (context, payload){          
      return Serve.GetName(payload.name, payload.token)    
    },
    ActionGetDocument (context, payload){          
      return Serve.GetDocument(payload.document, payload.token)    
    },
    ActionGetDocumentEspecific (context, payload){          
      return Serve.GetDocumentEspecific(payload.document, payload.token)    
    },
    ActionGetOpusername (context, payload){          
      return Serve.GetOpusername(payload.opusername, payload.token)    
    },
  },
  modules: {
  }
})
