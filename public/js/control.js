const app = new Vue({

    el : "#app",

    data: {
        
        message : "Hola mundo!",
        control : 0,
        password : "",
        password2 : "",
        disabled : true,
    },

    methods: {


    },

    updated() {
        
        if (this.password == this.password2 && this.password != "" && this.password2 != "") {

            return this.disabled = false;
        }

        else {

            return this.disabled = true;
        }
    },
})