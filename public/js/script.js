(function() {
    new Vue({
        el: '#main',
        data: {
            images: [],
            title: '',
            description: '',
            username: '',
            file: null
        },
        created: function() {
            console.log('created');
        },
        mounted: function() {
            console.log('mounted');
            var vueInstance = this;
            axios.get('/images').then(function(res){
                // console.log('res.data in script.js: ', res.data);
                vueInstance.images = res.data;
            }).catch(function(err) {
                console.log('err in mounted():', err);
            });
        },
        methods: {
            handleClick: function(e) {
                // to make the button do not refresh the page:
                e.preventDefault();
                // 'this' allows me to say all the properties of data:
                // console.log('this: ', this);
                // formData to send file to the server
                var formData = new FormData();
                formData.append('title', this.title);
                formData.append('description', this.description);
                formData.append('username', this.username);
                formData.append('file', this.file);
                // will only log an empty object, but the data is actually in there:
                // console.log('formData: ', formData);
                var vueInstance = this;
                axios.post('./upload', formData).then(function(res) {
                    // console.log('response from POST /upload: ', res.data[0]);
                    vueInstance.images.unshift(res.data[0]);
                }).catch(function(err) {
                    console.log('err in POST /upload: ', err);
                });
            },
            handleChange: function(e) {
                console.log('handleChange is running');
                // file that we just uploaded:
                console.log('file: ', e.target.files[0]);
                this.file = e.target.files[0];
            }
        },
        updated: function() {
            console.log('updated');
        }
    });
}());
