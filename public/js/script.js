(function() {
    new Vue({
        el: '#main',
        data: {
            title: 'Ninas Imageboard',
            heading: 'Latest Images',
            images: null
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
        updated: function() {
            console.log('updated');
        },
        methods: {
            sayHello: function() {
                console.log('hello');
            }
        }
    });
}());
