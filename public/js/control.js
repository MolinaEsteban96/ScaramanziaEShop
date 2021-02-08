const app = new Vue({

    el : "#app",

    data: {
        
        message : "Hola mundo!",
        control : 0,
        password : "",
        password2 : "",
        disabled : true,
        isToken : false,
        activeUsername : "",
    },

    methods: {
    
    },

    created() {
        
        try{
            let cookies = decodeURIComponent(document.cookie)
            let cookiesList = cookies.split(";")
            let token = cookiesList[0].slice(6)
            let username = cookiesList[1].slice(10)
            if (token != null) {

                this.isToken = true
                this.activeUsername = username
            } else {

                this.isToken = false
            }
            console.log(username)
        } catch {

            return
        }
    },

    updated() {
        
        if (this.password == this.password2 && this.password != "" && this.password2 != "") {

            return this.disabled = false;
        }

        else if (this.password != this.password2 || this.password == "" || this.password2 == "") {

            return this.disabled = "true"
        }

        if (this.loginusername != "") {

            return this.logindisabled = false;
        }

    },
})