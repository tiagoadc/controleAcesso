import axios from 'axios'

const http = axios.create({
    baseURL: 'http://localhost:4000'
})

export default {
    AuthLogin: (user) =>{
        return http.post('postLogin/', user)
    },
    AddUser: (user, token) =>{        
        http.post('/postUser', user, { headers: {
            'x-access-token':  token,
            
          }})
    },
    DelUser: (user, token) =>{                
       return http.delete('/deleteUser/' + user.id, { headers: {
            'x-access-token':  token,                        
          }}
          )
    },
    GetUser: ( token) =>{        
       return http.get('/getUser', { headers: {
            'x-access-token':  token,
            
          }})
    },
    PutUser: (user, token) =>{        
        http.put('/putUser', user, { headers: {
            'x-access-token':  token,
            
          }})
    },
    GetName: ( name, token) =>{        
        return http.get('/getName/' + name, { headers: {
             'x-access-token':  token,
             
           }})
     },
     GetDocument: ( document, token) =>{            
      return http.get('/getDocument/' + document, { headers: {
           'x-access-token':  token,
           
         }})
   },
   GetDocumentEspecific: ( document, token) =>{            
    return http.get('/getDocumentEspecific/' + document, { headers: {
         'x-access-token':  token,
         
       }})
  },

   GetOpusername: ( opusername, token) =>{            
    return http.get('/getOpusername/' + opusername, { headers: {
         'x-access-token':  token,
         
       }})
 },
 
}

